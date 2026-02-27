'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function CreateMedecinModal({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    rpps: '',
    specialite: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const newMedecin = {
      id: crypto.randomUUID(),
      ...form,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const { error } = await supabase.from('medecins').insert([newMedecin])
    if (error) toast.error(error.message)
    else {
      toast.success('✅ Médecin ajouté !')
      setOpen(false)
      onSuccess?.()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un médecin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau médecin prescripteur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Prénom</Label>
            <Input value={form.prenom} onChange={(e) => setForm({...form, prenom: e.target.value})} required />
          </div>
          <div>
            <Label>Nom</Label>
            <Input value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} required />
          </div>
          <div>
            <Label>RPPS</Label>
            <Input value={form.rpps} onChange={(e) => setForm({...form, rpps: e.target.value})} required />
          </div>
          <div>
            <Label>Spécialité</Label>
            <Input value={form.specialite} onChange={(e) => setForm({...form, specialite: e.target.value})} required />
          </div>
          <Button type="submit" className="w-full bg-emerald-600" disabled={loading}>
            {loading ? 'Ajout...' : 'Créer le médecin'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}