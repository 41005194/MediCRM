'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

  const loadFactures = async () => {
    const { data } = await supabase
      .from('factures')
      .select(`
        *,
        patient:patients(nom, prenom)
      `)
      .order('dateEmission', { ascending: false })

    setFactures(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadFactures()
  }, [])

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

  if (loading) return <div className="p-8">Chargement...</div>

  const caTotal = factures
    .filter(f => f.statut === 'PAYE')
    .reduce((sum, f) => sum + f.montantTotal, 0)

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-72 p-8 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Factures</h1>
            <div className="text-2xl font-bold text-emerald-600">
              CA total : {caTotal.toLocaleString('fr-FR')} €
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Liste des factures ({factures.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factures.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">
                        {f.patient ? `${f.patient.prenom} ${f.patient.nom}` : '—'}
                      </TableCell>
                      <TableCell>{new Date(f.dateEmission).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="font-medium">{f.montantTotal} €</TableCell>
                      <TableCell>
                        <Badge variant={f.statut === 'PAYE' ? 'default' : 'secondary'}>
                          {f.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {f.statut !== 'PAYE' && (
                          <Button size="sm" onClick={() => marquerPayee(f.id)}>
                            Marquer comme payée
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}