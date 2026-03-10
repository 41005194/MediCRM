'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  const [months, setMonths] = useState(3)
  const [dayOfMonth, setDayOfMonth] = useState('15')
  const [time, setTime] = useState('14:00')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let successCount = 0
    const now = new Date().toISOString()
    const startDate = new Date()

    for (let i = 0; i < months; i++) {
      const date = new Date(startDate)
      date.setMonth(date.getMonth() + i)
      date.setDate(parseInt(dayOfMonth))
      date.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]), 0, 0)

      // Sécurité si le jour n'existe pas dans le mois
      if (date.getDate() !== parseInt(dayOfMonth)) {
        date.setDate(1)
        date.setMonth(date.getMonth() + 1)
        date.setDate(0)
      }

      const { error } = await supabase.from('seances').insert([{
        id: crypto.randomUUID(),
        ordonnanceId: ordonnance.id,
        praticienId: 'k1',
        dateHeure: date.toISOString(),
        statut: 'PREVU',
        note: `Suivi préventif ${i + 1}/${months}`,
        cotation: 'AMK 9',
        montant: 9.0,
        createdAt: now,
        updatedAt: now
      }])
        // Création de facture pour chaque séance
        await supabase.from('factures').insert([{
        id: crypto.randomUUID(),
        montantTotal: 9.0,
        statut: 'EN_ATTENTE',
        patient_id: ordonnance.patientId,
        createdAt: now,
        updatedAt: now
        }])

      if (!error) successCount++
    }

    // Déplacement de l'ordonnance
    await supabase
      .from('ordonnances')
      .update({ statut: 'SUIVI_PREVENTIF' })
      .eq('id', ordonnance.id)

    if (successCount > 0) {
      toast.success(`${successCount} rendez-vous de suivi préventif créés !`)
      onSuccess()
      onClose()
    } else {
      toast.error("Aucun rendez-vous n'a pu être créé")
    }

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
            <Input type="number" value={months} onChange={(e) => setMonths(parseInt(e.target.value))} min="1" />
          </div>

          <div>
            <Label>Jour du mois (1-28)</Label>
            <Input type="number" value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} min="1" max="28" />
          </div>

          <div>
            <Label>Heure</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création en cours...' : `Créer ${months} rendez-vous de suivi`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}