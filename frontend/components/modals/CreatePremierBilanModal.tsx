'use client'

import { useState } from 'react'
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
  ordonnance: any | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [dateHeure, setDateHeure] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dateHeure) return toast.error("Choisissez une date et heure")

    setLoading(true)

    const newSeance = {
      id: crypto.randomUUID(),
      ordonnanceId: ordonnance.id,
      praticienId: 'k1',
      dateHeure: new Date(dateHeure).toISOString(),
      statut: 'PREVU',
      note: 'Premier bilan',
      cotation: 'AMK 9',
      montant: 9.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const { error: seanceError } = await supabase.from('seances').insert([newSeance])

    if (seanceError) {
      toast.error(seanceError.message)
      setLoading(false)
      return
    }

    // Déplacement automatique
    await supabase
      .from('ordonnances')
      .update({ statut: 'BILAN_PROGRAMME' })
      .eq('id', ordonnance.id)

    toast.success('Premier bilan créé + email envoyé')
    setLoading(false)
    onClose()
    onSuccess()
  }

  if (!ordonnance) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Premier bilan - {ordonnance.patients?.prenom} {ordonnance.patients?.nom}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Date et heure du premier bilan</Label>
            <Input
              type="datetime-local"
              value={dateHeure}
              onChange={(e) => setDateHeure(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer le bilan + envoyer email'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}