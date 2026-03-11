'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function CreatePremierBilanModal({
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
  const [dateHeure, setDateHeure] = useState('')

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        // Correction : Utilisation de l'email pour plus de fiabilité
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user.email)
          .single()
        if (profile) setPraticienId(profile.id)
      }
    }
    getProfile()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dateHeure) return toast.error("Choisissez une date et heure")
    if (!praticienId) return toast.error("Profil praticien non chargé, veuillez patienter.")

    setLoading(true)
    const now = new Date().toISOString()

    // 1. Création de la séance avec gestion d'erreur
    const { data: seance, error: seanceError } = await supabase.from('seances').insert([{
      id: crypto.randomUUID(),
      ordonnanceId: ordonnance.id,
      praticienId: praticienId,
      dateHeure: new Date(dateHeure).toISOString(),
      statut: 'PREVU',
      note: 'Premier bilan',
      cotation: 'AMK 9',
      montant: 9.0,
      createdAt: now,
      updatedAt: now
    }]).select().single()

    if (seanceError) {
      toast.error("Erreur lors de la création de la séance : " + seanceError.message)
      setLoading(false)
      return // On arrête tout si la séance échoue
    }

    // 2. Création de la facture
    await supabase.from('factures').insert([{
      id: crypto.randomUUID(),
      montantTotal: 9.0,
      statut: 'EN_ATTENTE',
      patient_id: ordonnance.patientId,
      createdAt: now,
      updatedAt: now
    }])

    // 3. Mise à jour de l'ordonnance
    await supabase.from('ordonnances').update({ statut: 'BILAN_PROGRAMME' }).eq('id', ordonnance.id)

    toast.success('Premier bilan créé + facture générée')
    setLoading(false)
    onSuccess()
    onClose()
  }

  if (!ordonnance) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Premier bilan — {ordonnance.patients?.prenom} {ordonnance.patients?.nom}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Date et heure du bilan</Label>
            <Input type="datetime-local" value={dateHeure} onChange={(e) => setDateHeure(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            Créer le bilan + facture
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}