'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function HistoriquePage() {
  const supabase = createClient()
  const [activites, setActivites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivites = async () => {
      const { data } = await supabase
        .from('activites')
        .select('*, patient(nom, prenom)')
        .order('createdAt', { ascending: false })
      setActivites(data || [])
      setLoading(false)
    }
    fetchActivites()
  }, [supabase])

  if (loading) return <div className="p-8">Chargement...</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Historique des activités</h1>
      <Card>
        <CardHeader>
          <CardTitle>Toutes les actions ({activites.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Patient</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activites.map(a => (
                <TableRow key={a.id}>
                  <TableCell>{new Date(a.createdAt).toLocaleString('fr-FR')}</TableCell>
                  <TableCell className="capitalize">{a.type}</TableCell>
                  <TableCell>{a.description}</TableCell>
                  <TableCell>{a.patient ? `${a.patient.prenom} ${a.patient.nom}` : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}