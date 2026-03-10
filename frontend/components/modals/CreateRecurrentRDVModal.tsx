'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export default function CreateRecurrentRDVModal({
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
  const [weeks, setWeeks] = useState(8)
  const [dayOfWeek, setDayOfWeek] = useState('1') // 1 = Lundi
  const [time, setTime] = useState('14:00')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const startDate = new Date()
    const targetDay = parseInt(dayOfWeek)
    const now = new Date().toISOString()

    let successCount = 0

    for (let i = 0; i < weeks; i++) {
      const date = new Date(startDate)
      // Calcul du prochain jour de la semaine
      date.setDate(date.getDate() + i * 7 + ((targetDay - date.getDay() + 7) % 7))
      date.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]), 0, 0)

      const { error } = await supabase.from('seances').insert([{
        id: crypto.randomUUID(),
        ordonnanceId: ordonnance.id,
        praticienId: 'k1', // À adapter plus tard avec l'utilisateur connecté
        dateHeure: date.toISOString(),
        statut: 'PREVU',
        note: `Séance récurrente ${i + 1}/${weeks}`,
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

    // Déplacement automatique de l'ordonnance
    await supabase
      .from('ordonnances')
      .update({ statut: 'EN_COURS_DE_SOIN' })
      .eq('id', ordonnance.id)

    if (successCount > 0) {
      toast.success(`${successCount} rendez-vous récurrents créés avec succès !`)
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
            RDV récurrents — {ordonnance.patients?.prenom} {ordonnance.patients?.nom}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre de semaines</Label>
            <Input 
              type="number" 
              value={weeks} 
              onChange={(e) => setWeeks(parseInt(e.target.value))} 
              min="1" 
            />
          </div>

          <div>
            <Label>Jour de la semaine</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Lundi</SelectItem>
                <SelectItem value="2">Mardi</SelectItem>
                <SelectItem value="3">Mercredi</SelectItem>
                <SelectItem value="4">Jeudi</SelectItem>
                <SelectItem value="5">Vendredi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Heure du rendez-vous</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création en cours...' : `Créer ${weeks} rendez-vous récurrents`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}