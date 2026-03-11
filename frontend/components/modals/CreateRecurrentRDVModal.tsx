'use client'

import { useState, useEffect } from 'react'
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
  const [praticienId, setPraticienId] = useState<string | null>(null)
  const [weeks, setWeeks] = useState(8)
  const [dayOfWeek, setDayOfWeek] = useState('1') // 1 = Lundi
  const [time, setTime] = useState('14:00')

  // Récupération du kiné connecté
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
    getProfile()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!praticienId) return toast.error("Profil praticien non chargé.")
    
    setLoading(true)
    const startDate = new Date()
    const targetDay = parseInt(dayOfWeek)
    const now = new Date().toISOString()
    
    // Préparation de l'insertion groupée pour éviter les erreurs de boucle
    const seancesToInsert = []
    for (let i = 0; i < weeks; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i * 7 + ((targetDay - date.getDay() + 7) % 7))
      date.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]), 0, 0)

      seancesToInsert.push({
        id: crypto.randomUUID(),
        ordonnanceId: ordonnance.id,
        praticienId: praticienId,
        dateHeure: date.toISOString(),
        statut: 'PREVU',
        note: `Séance récurrente ${i + 1}/${weeks}`,
        cotation: 'AMK 9',
        montant: 9.0,
        createdAt: now,
        updatedAt: now
      })
    }

    const { error: batchError } = await supabase.from('seances').insert(seancesToInsert)

    if (batchError) {
      toast.error("Erreur séances : " + batchError.message)
    } else {
      await supabase.from('factures').insert([{
        id: crypto.randomUUID(),
        montantTotal: 9.0 * weeks, 
        statut: 'EN_ATTENTE',
        patient_id: ordonnance.patientId,
        createdAt: now,
        updatedAt: now
      }])

      await supabase.from('ordonnances').update({ statut: 'EN_COURS_DE_SOIN' }).eq('id', ordonnance.id)
      toast.success(`${weeks} rendez-vous créés !`)
      onSuccess()
      onClose()
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