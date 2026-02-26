'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function CreatePatientModal({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    email: '',
    telephone: '',
    antecedents: '',
    adresse: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const newPatient = {
      id: crypto.randomUUID(),
      nom: form.nom,
      prenom: form.prenom,
      dateNaissance: form.dateNaissance ? new Date(form.dateNaissance).toISOString() : null,
      email: form.email || null,
      telephone: form.telephone || null,
      antecedents: form.antecedents || null,
      adresse: form.adresse || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const { error } = await supabase.from('patients').insert([newPatient])

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('✅ Patient ajouté avec succès !')
      setOpen(false)
      setForm({ nom: '', prenom: '', dateNaissance: '', email: '', telephone: '', antecedents: '', adresse: '' })
      onSuccess?.()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un patient</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau patient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Prénom</Label>
              <Input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} required />
            </div>
            <div>
              <Label>Nom</Label>
              <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
            </div>
          </div>
          <div>
            <Label>Date de naissance</Label>
            <Input type="date" value={form.dateNaissance} onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
          </div>
          <div>
            <Label>Antécédents</Label>
            <Input value={form.antecedents} onChange={(e) => setForm({ ...form, antecedents: e.target.value })} />
          </div>
          <div>
            <Label>Adresse</Label>
            <Input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
          </div>

          <Button type="submit" className="w-full bg-emerald-600" disabled={loading}>
            {loading ? 'Ajout en cours...' : 'Créer le patient'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}