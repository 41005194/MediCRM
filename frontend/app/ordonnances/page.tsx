'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Kanban from '@/components/kanban/Kanban'
import CreateOrdonnanceModal from '@/components/modals/CreateOrdonnanceModal'
import CreateMedecinModal from '@/components/modals/CreateMedecinModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase'
import Sidebar from '@/components/layout/Sidebar'
import CreatePremierBilanModal from '@/components/modals/CreatePremierBilanModal'
import CreateRecurrentRDVModal from '@/components/modals/CreateRecurrentRDVModal'
import ListeRDVModal from '@/components/modals/ListeRDVModal'
import CreateSuiviPreventifModal from '@/components/modals/CreateSuiviPreventifModal'

export default function OrdonnancesPage() {
  const [tab, setTab] = useState('kanban')
  const [ordonnancesListe, setOrdonnancesListe] = useState<any[]>([])
  const supabase = createClient()

  // États pour les filtres et tris
  const [searchListe, setSearchListe] = useState('')
  const [sortListe, setSortListe] = useState<'date' | 'patient' | 'statut'>('date')
  const [ordonnancesListeFiltrees, setOrdonnancesListeFiltrees] = useState<any[]>([])

  // États pour les modals
  const [currentOrdonnance, setCurrentOrdonnance] = useState<any>(null)
  const [showBilanModal, setShowBilanModal] = useState(false)
  const [showRecurrentModal, setShowRecurrentModal] = useState(false)
  const [showListeRDVModal, setShowListeRDVModal] = useState(false)
  const [showSuiviModal, setShowSuiviModal] = useState(false)

  // Chargement des ordonnances pour la vue liste
  useEffect(() => {
    if (tab === 'liste') {
      supabase
        .from('ordonnances')
        .select('*, patients(nom, prenom), medecins(nom, prenom)')
        .order('createdAt', { ascending: false })
        .then(({ data }) => setOrdonnancesListe(data || []))
    }
  }, [tab])

  // Filtre + Tri en temps réel
  useEffect(() => {
    let result = [...ordonnancesListe]

    if (searchListe) {
      const term = searchListe.toLowerCase()
      result = result.filter(o =>
        `${o.patients?.prenom} ${o.patients?.nom}`.toLowerCase().includes(term) ||
        o.pathologie.toLowerCase().includes(term)
      )
    }

    if (sortListe === 'date') {
      result.sort((a, b) => new Date(a.dateOrdonnance).getTime() - new Date(b.dateOrdonnance).getTime())
    } else if (sortListe === 'patient') {
      result.sort((a, b) => 
        `${a.patients?.prenom} ${a.patients?.nom}`.localeCompare(`${b.patients?.prenom} ${b.patients?.nom}`)
      )
    } else if (sortListe === 'statut') {
      result.sort((a, b) => a.statut.localeCompare(b.statut))
    }

    setOrdonnancesListeFiltrees(result)
  }, [ordonnancesListe, searchListe, sortListe])

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-72">
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
                <Kanban 
                  onActionClick={(ordonnance) => {
                    if (ordonnance.statut === 'NOUVELLE_DEMANDE') {
                      // Ouvrir pop-up premier bilan
                      setCurrentOrdonnance(ordonnance)
                      setShowBilanModal(true)
                    } 
                    else if (ordonnance.statut === 'BILAN_PROGRAMME') {
                      // Ouvrir pop-up RDV récurrents
                      setCurrentOrdonnance(ordonnance)
                      setShowRecurrentModal(true)
                    } 
                    else if (ordonnance.statut === 'EN_COURS_DE_SOIN') {
                      // Ouvrir pop-up liste RDV
                      setCurrentOrdonnance(ordonnance)
                      setShowListeRDVModal(true)
                    } 
                    else if (ordonnance.statut === 'FIN_DE_TRAITEMENT') {
                      // Ouvrir pop-up suivi préventif
                      setCurrentOrdonnance(ordonnance)
                      setShowSuiviModal(true)
                    }
                    else if (ordonnance.statut === 'SUIVI_PREVENTIF') {
                      // Ouvrir pop-up liste RDV
                      setCurrentOrdonnance(ordonnance)
                      setShowListeRDVModal(true)
                    }
                  }} 
                />
              </TabsContent>

              <TabsContent value="liste">
                <Card>
                  <CardHeader>
                    <CardTitle>Liste complète des ordonnances ({ordonnancesListeFiltrees.length})</CardTitle>
                    
                    <div className="flex gap-4 mt-4">
                      <Input
                        placeholder="Rechercher patient ou pathologie..."
                        value={searchListe}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchListe(e.target.value)}
                        className="max-w-md"
                      />
                      <select
                        value={sortListe}
                        onChange={(e) => setSortListe(e.target.value as 'date' | 'patient' | 'statut')}
                        className="border rounded-lg px-4"
                      >
                        <option value="date">Trier par date</option>
                        <option value="patient">Trier par patient</option>
                        <option value="statut">Trier par statut</option>
                      </select>
                    </div>
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
                        {ordonnancesListeFiltrees.map((o) => (
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
      </div>
      <CreatePremierBilanModal
        ordonnance={currentOrdonnance}
        open={showBilanModal}
        onClose={() => setShowBilanModal(false)}
        onSuccess={() => window.location.reload()}
      />
      <CreateRecurrentRDVModal
        ordonnance={currentOrdonnance}
        open={showRecurrentModal}
        onClose={() => setShowRecurrentModal(false)}
        onSuccess={() => window.location.reload()}
      />
      <ListeRDVModal
        ordonnance={currentOrdonnance}
        open={showListeRDVModal}
        onClose={() => setShowListeRDVModal(false)}
      />
      <CreateSuiviPreventifModal
        ordonnance={currentOrdonnance}
        open={showSuiviModal}
        onClose={() => setShowSuiviModal(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  )
}