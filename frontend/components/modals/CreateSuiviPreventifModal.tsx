'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function CreateSuiviPreventifModal({
  ordonnance,
  open,
  onClose,
  onSuccess
}: {
  ordonnance: any
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [praticienId, setPraticienId] = useState<string | null>(null)
  const [months, setMonths] = useState(3)
  const [dayOfMonth, setDayOfMonth] = useState('15')
  const [time, setTime] = useState('14:00')

  // Récupération du kiné connecté via l'email (plus fiable)
  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user.email)
          .single()
        if (profile) setPraticienId(profile.id)
      }
    }
    if (open) getProfile()
  }, [supabase, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // SÉCURITÉ : On vérifie que le praticien est bien identifié
    if (!praticienId) {
      return toast.error("Le profil du praticien n'est pas encore chargé. Veuillez patienter.")
    }

    setLoading(true)
    const now = new Date().toISOString()
    const startDate = new Date()
    const seancesToInsert = []

    // 1. Préparation de la liste des séances
    for (let i = 0; i < months; i++) {
      const date = new Date(startDate)
      date.setMonth(date.getMonth() + i)
      date.setDate(parseInt(dayOfMonth))
      
      const [hours, minutes] = time.split(':')
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      
      // Gestion des fins de mois (ex: 31 février -> 28/29 février)
      if (date.getDate() !== parseInt(dayOfMonth)) {
        date.setDate(1)
        date.setMonth(date.getMonth() + 1)
        date.setDate(0)
      }

      seancesToInsert.push({
        id: crypto.randomUUID(),
        ordonnanceId: ordonnance.id,
        praticienId: praticienId,
        dateHeure: date.toISOString(),
        statut: 'PREVU',
        note: `Suivi préventif ${i + 1}/${months}`,
        cotation: 'AMK 9',
        montant: 9.0,
        createdAt: now,
        updatedAt: now
      })
    }

    // 2. Insertion groupée des séances
    const { error: errS } = await supabase.from('seances').insert(seancesToInsert)

    if (errS) {
      toast.error("Erreur lors de la création des séances : " + errS.message)
      setLoading(false)
      return
    }

    // 3. Création de la facture globale pour le suivi
    const { error: errF } = await supabase.from('factures').insert([{
      id: crypto.randomUUID(),
      montantTotal: 9.0 * months,
      statut: 'EN_ATTENTE',
      patient_id: ordonnance.patientId,
      createdAt: now,
      updatedAt: now
    }])

    if (errF) {
      toast.error("Erreur lors de la génération de la facture : " + errF.message)
    }

    // 4. Mise à jour du statut de l'ordonnance
    await supabase
      .from('ordonnances')
      .update({ statut: 'SUIVI_PREVENTIF' })
      .eq('id', ordonnance.id)

    toast.success(`Suivi préventif activé avec ${months} rendez-vous !`)
    onSuccess()
    onClose()
    setLoading(false)
  }

  if (!ordonnance) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Suivi préventif — {ordonnance.patients?.prenom} {ordonnance.patients?.nom}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre de mois</Label>
            <Input 
              type="number" 
              value={months} 
              onChange={(e) => setMonths(parseInt(e.target.value))} 
              min="1" 
              max="24"
            />
          </div>

          <div>
            <Label>Jour du mois (1-28)</Label>
            <Input 
              type="number" 
              value={dayOfMonth} 
              onChange={(e) => setDayOfMonth(e.target.value)} 
              min="1" 
              max="28" 
            />
          </div>

          <div>
            <Label>Heure du rendez-vous</Label>
            <Input 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
            />
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading || !praticienId}>
            {loading ? 'Création en cours...' : `Activer le suivi (${months} mois)`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}