'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import Sidebar from '@/components/layout/Sidebar'
import { toast } from 'sonner'

type Facture = {
  id: string
  montantTotal: number
  statut: 'EN_ATTENTE' | 'PAYE' | 'REJETE'
  dateEmission: string
  patient_id?: string
  patient?: { prenom: string; nom: string }
}

export default function FacturesPage() {
  const supabase = createClient()
  const [factures, setFactures] = useState<Facture[]>([])
  const [loading, setLoading] = useState(true)
  
  // États pour la gestion administrative
  const [isAdmin, setIsAdmin] = useState(false)
  const [allKines, setAllKines] = useState<any[]>([])
  const [selectedKineId, setSelectedKineId] = useState<string>('all')

  // 1. Charger le profil et la liste des kinés si Admin
  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', user.email)
        .single()

      if (profile) {
        if (profile.role === 'ADMIN') {
          setIsAdmin(true)
          const { data: kines } = await supabase
            .from('profiles')
            .select('id, nom, prenom')
            .eq('role', 'KINE')
          setAllKines(kines || [])
          setSelectedKineId('all') // Par défaut "Tous" pour l'admin
        } else {
          setSelectedKineId(profile.id) // Un kiné ne voit que lui
        }
      }
    }
    checkRole()
  }, [])

  // 2. Charger les factures avec filtre dynamique
  const loadFactures = async () => {
    setLoading(true)
    let query = supabase
      .from('factures')
      .select(`
        *,
        patient:patients(nom, prenom),
        seances!inner(praticienId)
      `)

    // Si on filtre par un kiné spécifique (ou si c'est un kiné connecté)
    if (selectedKineId !== 'all') {
      query = query.eq('seances.praticienId', selectedKineId)
    }

    const { data, error } = await query.order('dateEmission', { ascending: false })

    if (error) {
      toast.error("Erreur lors du chargement des factures")
    } else {
      setFactures(data || [])
    }
    setLoading(false)
  }

  // Recharger quand le filtre change
  useEffect(() => {
    if (selectedKineId) loadFactures()
  }, [selectedKineId])

  const marquerPayee = async (id: string) => {
    const { error } = await supabase
      .from('factures')
      .update({ statut: 'PAYE' })
      .eq('id', id)

    if (error) toast.error(error.message)
    else {
      toast.success('Facture marquée comme payée')
      loadFactures()
    }
  }

  // Calcul du CA du mois actuel basé sur la sélection
  const now = new Date()
  const caMensuel = factures
    .filter(f => {
      const dateF = new Date(f.dateEmission)
      return (
        f.statut === 'PAYE' &&
        dateF.getMonth() === now.getMonth() &&
        dateF.getFullYear() === now.getFullYear()
      )
    })
    .reduce((sum, f) => sum + f.montantTotal, 0)

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-72 p-8 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">Facturation</h1>
              
              {/* Sélecteur Admin */}
              {isAdmin && (
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border shadow-sm">
                  <Label htmlFor="kine-filter" className="text-xs font-bold text-slate-500 uppercase">
                    Filtrer par Praticien :
                  </Label>
                  <select
                    id="kine-filter"
                    className="text-sm border-none focus:ring-0 cursor-pointer font-medium"
                    value={selectedKineId}
                    onChange={(e) => setSelectedKineId(e.target.value)}
                  >
                    <option value="all">Tous les praticiens</option>
                    {allKines.map(kine => (
                      <option key={kine.id} value={kine.id}>
                        {kine.prenom} {kine.nom}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                CA {selectedKineId === 'all' ? 'Global' : ''} {now.toLocaleString('fr-FR', { month: 'long' })}
              </div>
              <div className="text-4xl font-black text-emerald-600">
                {caMensuel.toLocaleString('fr-FR')} €
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Liste des factures ({factures.length})</CardTitle>
              {loading && <span className="text-sm text-slate-400 animate-pulse">Mise à jour...</span>}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date d'émission</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factures.length === 0 && !loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                        Aucune facture trouvée pour ce filtre.
                      </TableCell>
                    </TableRow>
                  ) : (
                    factures.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell className="font-semibold">
                          {f.patient ? `${f.patient.prenom} ${f.patient.nom}` : '—'}
                        </TableCell>
                        <TableCell>{new Date(f.dateEmission).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell className="font-bold">{f.montantTotal} €</TableCell>
                        <TableCell>
                        <Badge 
                          variant={f.statut === 'PAYE' ? 'default' : f.statut === 'REJETE' ? 'destructive' : 'outline'}
                          className={f.statut === 'PAYE' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}
                        >
                          {f.statut}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {f.statut !== 'PAYE' && (
                            <Button size="sm" variant="outline" onClick={() => marquerPayee(f.id)}>
                              Marquer payée
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}