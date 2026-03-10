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
    const dayMap = [6, 0, 1, 2, 3, 4, 5] // JS Sunday=0 → Monday=1
    const targetDay = parseInt(dayOfWeek)

    for (let i = 0; i < weeks; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i * 7)
      date.setDate(date.getDate() + (targetDay - date.getDay() + 7) % 7)
      date.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]))

      await supabase.from('seances').insert([{
        id: crypto.randomUUID(),
        ordonnanceId: ordonnance.id,
        praticienId: 'k1',
        dateHeure: date.toISOString(),
        statut: 'PREVU',
        note: `Séance récurrente ${i + 1}/${weeks}`,
        cotation: 'AMK 9',
        montant: 9.0
      }])
    }

    // Déplacement automatique vers "En cours de soin"
    await supabase
      .from('ordonnances')
      .update({ statut: 'EN_COURS_DE_SOIN' })
      .eq('id', ordonnance.id)

    toast.success(`${weeks} rendez-vous récurrents créés !`)
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
            RDV récurrents — {ordonnance.patients?.prenom} {ordonnance.patients?.nom}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre de semaines</Label>
            <Input type="number" value={weeks} onChange={(e) => setWeeks(parseInt(e.target.value))} min="1" />
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
            <Label>Heure</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création des RDV...' : `Créer ${weeks} rendez-vous récurrents`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}