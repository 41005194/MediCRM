'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Sidebar from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

export default function MesRendezVousPage() {
  const supabase = createClient()

  const [praticienId, setPraticienId] = useState<string | null>(null)   // ← ID de la table profiles
  const [rdvs, setRdvs] = useState<any[]>([])
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
  const [selectedRDV, setSelectedRDV] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newDateHeure, setNewDateHeure] = useState('')

    const getMonday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    // Ajustement pour que Lundi soit le premier jour (0 pour Dimanche, 1 pour Lundi...)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
    };

  // 1. Récupère l'utilisateur connecté + son profil via email
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user.email)
        .single()

      if (profile) {
        setPraticienId(profile.id)
      } else {
        toast.error("Aucun profil kiné trouvé pour cet email")
      }
    }
    loadProfile()
  }, [])

    useEffect(() => {
        if (!praticienId) return

        const start = getMonday(currentWeekStart);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        supabase
            .from('seances')
            .select(`
            *,
            ordonnance:ordonnances (
                patient:patients (prenom, nom)
            )
            `)
            .eq('praticienId', praticienId)
            .gte('dateHeure', start.toISOString())
            .lte('dateHeure', end.toISOString())
            .order('dateHeure')
            .then(({ data }) => setRdvs(data || []))
    }, [praticienId, currentWeekStart])

  // Navigation semaines
  const goToPrevWeek = () => {
    const d = new Date(currentWeekStart)
    d.setDate(d.getDate() - 7)
    setCurrentWeekStart(d)
  }
  const goToNextWeek = () => {
    const d = new Date(currentWeekStart)
    d.setDate(d.getDate() + 7)
    setCurrentWeekStart(d)
  }
  const goToToday = () => setCurrentWeekStart(new Date())

  const openRDV = (rdv: any) => {
    setSelectedRDV(rdv)
    setShowEditModal(true)
  }

  // Création d'un RDV
  const createRDV = async () => {
    if (!newDateHeure || !praticienId) return toast.error("Choisis une date/heure")

    const { error } = await supabase.from('seances').insert([{
      id: crypto.randomUUID(),
      praticienId,
      dateHeure: new Date(newDateHeure).toISOString(),
      statut: 'PREVU',
      note: 'RDV créé depuis agenda',
      cotation: 'AMK 9',
      montant: 9.0
    }])

    if (error) toast.error(error.message)
    else {
      toast.success('Rendez-vous créé !')
      setShowCreateModal(false)
      setNewDateHeure('')
      setCurrentWeekStart(new Date(currentWeekStart)) // refresh
    }
  }

    // Regroupement par jour - Toujours à partir du lundi
    const monday = getMonday(currentWeekStart);

    const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
    });

  const rdvsByDay = days.map(day => {
    const dayStr = day.toISOString().split('T')[0]
    return rdvs.filter(rdv => rdv.dateHeure.startsWith(dayStr))
  })

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-72 p-8 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Mes rendez-vous</h1>

            <div className="flex gap-3">
              <Button variant="outline" onClick={goToPrevWeek}><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" onClick={goToToday}>Semaine actuelle</Button>
              <Button variant="outline" onClick={goToNextWeek}><ChevronRight className="w-4 h-4" /></Button>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" /> Nouveau RDV
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden">
                {days.map((day, i) => (
                  <div key={i} className="bg-white">
                    <div className="p-4 text-center border-b bg-slate-50">
                      <div className="text-sm text-slate-500">
                        {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                      </div>
                      <div className="text-2xl font-semibold">{day.getDate()}</div>
                    </div>
                    <div className="p-3 min-h-[500px] space-y-2">
                      {rdvsByDay[i].length === 0 ? (
                        <p className="text-slate-400 text-xs text-center mt-8">Aucun RDV</p>
                      ) : (
                        rdvsByDay[i].map((rdv) => (
                          <div
                            key={rdv.id}
                            onClick={() => openRDV(rdv)}
                            className="bg-emerald-50 hover:bg-emerald-100 p-3 rounded-lg cursor-pointer transition"
                          >
                            <div className="font-medium text-sm">
                              {new Date(rdv.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-xs mt-1">
                              {rdv.ordonnance?.patient?.prenom} {rdv.ordonnance?.patient?.nom}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal création */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouveau rendez-vous</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Label>Date et heure</Label>
            <Input type="datetime-local" value={newDateHeure} onChange={e => setNewDateHeure(e.target.value)} />
            <Button onClick={createRDV} className="w-full">Créer le rendez-vous</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal détails */}
      {selectedRDV && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader><DialogTitle>Détails du rendez-vous</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <p><strong>Patient :</strong> {selectedRDV.ordonnance?.patient?.prenom} {selectedRDV.ordonnance?.patient?.nom}</p>
              <p><strong>Date :</strong> {new Date(selectedRDV.dateHeure).toLocaleString('fr-FR')}</p>
              <p><strong>Note :</strong> {selectedRDV.note || 'Aucune note'}</p>
            </div>
            <Button onClick={() => setShowEditModal(false)}>Fermer</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}