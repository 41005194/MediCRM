'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

type Patient = {
  id: string
  nom: string
  prenom: string
  dateNaissance: string
  email?: string
  telephone?: string
  antecedents?: string
  adresse?: string
}

export default function EditPatientModal({ 
  patient, 
  open, 
  onClose, 
  onSuccess 
}: { 
  patient: Patient | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<Patient>({
    id: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    email: '',
    telephone: '',
    antecedents: '',
    adresse: ''
  })

  useEffect(() => {
    if (patient) setForm(patient)
  }, [patient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('patients')
      .update({
        nom: form.nom,
        prenom: form.prenom,
        dateNaissance: form.dateNaissance,
        email: form.email || null,
        telephone: form.telephone || null,
        antecedents: form.antecedents || null,
        adresse: form.adresse || null,
        updatedAt: new Date().toISOString()
      })
      .eq('id', form.id)

    if (error) toast.error(error.message)
    else {
      toast.success('Patient modifié avec succès')
      onSuccess()
      onClose()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le patient</DialogTitle>
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Modification...' : 'Enregistrer les modifications'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}