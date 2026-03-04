'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Kanban from '@/components/kanban/Kanban'
import CreateOrdonnanceModal from '@/components/modals/CreateOrdonnanceModal'
import CreateMedecinModal from '@/components/modals/CreateMedecinModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/lib/supabase'

export default function OrdonnancesPage() {
  const [tab, setTab] = useState('kanban')
  const [ordonnancesListe, setOrdonnancesListe] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (tab === 'liste') {
      supabase
        .from('ordonnances')
        .select('*, patients(nom, prenom), medecins(nom, prenom)')
        .order('createdAt', { ascending: false })
        .then(({ data }) => setOrdonnancesListe(data || []))
    }
  }, [tab])

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Pipeline des soins</h1>
          <div className="flex gap-3">
            <CreateMedecinModal onSuccess={() => window.location.reload()} />
            <CreateOrdonnanceModal onSuccess={() => window.location.reload()} />
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="kanban">Vue Kanban</TabsTrigger>
            <TabsTrigger value="liste">Vue Liste</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban">
            <Kanban />
          </TabsContent>

          <TabsContent value="liste">
            <Card>
              <CardHeader>
                <CardTitle>Liste complète ({ordonnancesListe.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Médecin</TableHead>
                      <TableHead>Pathologie</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordonnancesListe.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>{o.patients?.prenom} {o.patients?.nom}</TableCell>
                        <TableCell>{o.medecins?.prenom} {o.medecins?.nom}</TableCell>
                        <TableCell>{o.pathologie}</TableCell>
                        <TableCell className="capitalize">{o.statut.replace(/_/g, ' ')}</TableCell>
                        <TableCell>{new Date(o.dateOrdonnance).toLocaleDateString('fr-FR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}