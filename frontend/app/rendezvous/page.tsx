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
import { Textarea } from '@/components/ui/textarea'

export default function MesRendezVousPage() {
  const supabase = createClient()

  const [praticienId, setPraticienId] = useState<string | null>(null)   // ← ID de la table profiles
  const [rdvs, setRdvs] = useState<any[]>([])
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
  const [selectedRDV, setSelectedRDV] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newDateHeure, setNewDateHeure] = useState('')
  const [ordonnances, setOrdonnances] = useState<any[]>([])
  const [selectedOrdonnanceId, setSelectedOrdonnanceId] = useState('')
  const [note, setNote] = useState('')

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
        end.setDate(end.getDate() + 7);
        end.setHours(0, 0, 0, -1);

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

    useEffect(() => {
        if (!praticienId) return

        const loadOrdonnances = async () => {
            const { data } = await supabase
            .from('ordonnances')
            .select('id, patientId, pathologie, patient:patients(nom, prenom)')
            .eq('praticienId', praticienId)
            
            setOrdonnances(data || [])
        }

        loadOrdonnances()
    }, [praticienId])

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
    if (!newDateHeure || !praticienId || !selectedOrdonnanceId) {
        return toast.error("Veuillez remplir tous les champs");
    }

    // 1. Trouver le patient_id associé à l'ordonnance sélectionnée
    const ordonnanceSource = ordonnances.find(o => o.id === selectedOrdonnanceId);
    const patientId = ordonnanceSource?.patientId;

    if (!patientId) {
        console.log("Ordonnance trouvée :", ordonnanceSource);
        return toast.error("Impossible de trouver le patient associé");
    }

    const now = new Date().toISOString();
    const montantSeance = 30.0;

    try {
        // 2. Créer la facture d'abord
        const factureId = crypto.randomUUID();
        const { error: factureError } = await supabase
        .from('factures')
        .insert([{
            id: factureId,
            montantTotal: montantSeance,
            statut: 'EN_ATTENTE', 
            patient_id: patientId,
            createdAt: now,
            updatedAt: now
        }]);

        if (factureError) throw factureError;

        // 3. Créer la séance liée à cette facture 
        const { error: seanceError } = await supabase
        .from('seances')
        .insert([{
            id: crypto.randomUUID(),
            praticienId,
            ordonnanceId: selectedOrdonnanceId,
            factureId: factureId,
            dateHeure: new Date(newDateHeure),
            statut: 'PREVU',
            note: note,
            cotation: 'AMK 9',
            montant: montantSeance,
            createdAt: now,
            updatedAt: now
        }]);

        if (seanceError) throw seanceError;

        toast.success('Rendez-vous et facture créés !');
        setShowCreateModal(false);
        setNewDateHeure('');
        setNote('');
        setSelectedOrdonnanceId('');
        setCurrentWeekStart(new Date(currentWeekStart)); // Refresh
        
    } catch (err: any) {
        toast.error(err.message || "Erreur lors de la création");
    }
};

    // Regroupement par jour - Toujours à partir du lundi
    const monday = getMonday(currentWeekStart);
    monday.setHours(0, 0, 0, 0);

    const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
    });

    const rdvsByDay = days.map(day => {
    return rdvs.filter(rdv => {
        const rdvDate = new Date(rdv.dateHeure);
        return (
        rdvDate.getDate() === day.getDate() &&
        rdvDate.getMonth() === day.getMonth() &&
        rdvDate.getFullYear() === day.getFullYear()
        );
    });
    });

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
                              {new Date(rdv.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}
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
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Nouveau rendez-vous</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            {/* Sélection de l'ordonnance (Patient) */}
            <div className="space-y-2">
                <Label htmlFor="ordonnance">Patient & Dossier</Label>
                <select 
                id="ordonnance"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedOrdonnanceId}
                onChange={(e) => setSelectedOrdonnanceId(e.target.value)}
                >
                <option value="">Sélectionner un dossier...</option>
                {ordonnances.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                    {ord.patient?.prenom} {ord.patient?.nom} - {ord.pathologie}
                    </option>
                ))}
                </select>
            </div>

            {/* Date et Heure */}
            <div className="space-y-2">
                <Label htmlFor="date">Date et heure</Label>
                <Input 
                id="date"
                type="datetime-local" 
                value={newDateHeure} 
                onChange={e => setNewDateHeure(e.target.value)} 
                />
            </div>

            {/* Note */}
            <div className="space-y-2">
                <Label htmlFor="note">Note de séance (optionnel)</Label>
                <Textarea 
                id="note"
                placeholder="Ex: Première séance, bilan à prévoir..."
                value={note}
                onChange={e => setNote(e.target.value)}
                />
            </div>

            <Button onClick={createRDV} className="w-full mt-4">
                Confirmer le rendez-vous
            </Button>
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
              <p><strong>Date :</strong> {new Date(selectedRDV.dateHeure).toLocaleTimeString('fr-FR')}</p>
              <p><strong>Note :</strong> {selectedRDV.note || 'Aucune note'}</p>
            </div>
            <Button onClick={() => setShowEditModal(false)}>Fermer</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}