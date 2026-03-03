'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'

export default function HistoriquePage() {
  const supabase = createClient()
  const [activites, setActivites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadActivites = async () => {
    try {
      const { data, error } = await supabase
        .from('activites')
        .select(`
          *,
          patient:patients (nom, prenom)
        `)
        .order('createdAt', { ascending: false })
        .limit(50)

      if (error) throw error
      setActivites(data || [])
    } catch (err: any) {
      toast.error('Erreur chargement historique')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivites()

    const channel = supabase
      .channel('public:activites')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activites' }, () => {
        loadActivites()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) return <div className="p-8 text-center">Chargement des activités...</div>

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Historique des activités</h1>

        {activites.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Aucune activité pour le moment
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Dernières actions ({activites.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Patient concerné</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activites.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{new Date(a.createdAt).toLocaleString('fr-FR')}</TableCell>
                      <TableCell className="capitalize font-medium">{a.type}</TableCell>
                      <TableCell>{a.description}</TableCell>
                      <TableCell>
                        {a.patient ? `${a.patient.prenom} ${a.patient.nom}` : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}