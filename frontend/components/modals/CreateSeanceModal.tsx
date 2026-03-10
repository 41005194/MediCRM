'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export default function CreateSeanceModal({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const [ordonnances, setOrdonnances] = useState<any[]>([])
  const [form, setForm] = useState({
    ordonnanceId: '',
    dateHeure: '',
    statut: 'PREVU',
    note: '',
    cotation: 'AMK 9',
    montant: 9.0
  })

  useEffect(() => {
    if (open) {
      supabase
        .from('ordonnances')
        .select('id, pathologie, patient:patients(prenom, nom)')
        .then(({ data }) => setOrdonnances(data || []))
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const newSeance = {
      id: crypto.randomUUID(),
      ordonnanceId: form.ordonnanceId,
      praticienId: 'k1', // à adapter selon l'utilisateur connecté
      dateHeure: new Date(form.dateHeure).toISOString(),
      statut: form.statut,
      note: form.note,
      cotation: form.cotation,
      montant: form.montant,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const { data: seance, error } = await supabase
      .from('seances')
      .insert([newSeance])
      .select()
      .single()

    if (error) {
      toast.error(error.message)
    } else {
      // === EMAIL AUTOMATIQUE ===
      const ordonnance = ordonnances.find(o => o.id === form.ordonnanceId)
      const patientEmail = ordonnance?.patient?.email

      if (patientEmail) {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': process.env.NEXT_PUBLIC_BREVO_API_KEY!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: 'MediCRM', email: 'contact@medicrm.fr' },
            to: [{ email: patientEmail }],
            subject: 'Confirmation de votre rendez-vous',
            htmlContent: `
              <h2>Bonjour,</h2>
              <p>Votre séance est confirmée pour le <strong>${new Date(form.dateHeure).toLocaleString('fr-FR')}</strong>.</p>
              <p>À bientôt !</p>
            `
          })
        })
      }

      toast.success('Séance créée + email envoyé')
      setOpen(false)
      onSuccess?.()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nouveau rendez-vous</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau rendez-vous</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Ordonnance liée</Label>
            <Select onValueChange={(v) => setForm({ ...form, ordonnanceId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une ordonnance" />
              </SelectTrigger>
              <SelectContent>
                {ordonnances.map(o => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.patient?.prenom} {o.patient?.nom} - {o.pathologie}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Date et heure du rendez-vous</Label>
            <Input
              type="datetime-local"
              onChange={(e) => setForm({ ...form, dateHeure: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Montant de la séance (€)</Label>
            <Input
              type="number"
              step="0.1"
              value={form.montant}
              onChange={(e) => setForm({ ...form, montant: parseFloat(e.target.value) })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer le rendez-vous + envoyer email'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}