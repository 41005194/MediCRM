'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export default function CreateFactureModal({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const [form, setForm] = useState({
    montantTotal: '',
    statut: 'EN_ATTENTE' as 'EN_ATTENTE' | 'PAYE' | 'REJETE'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const newFacture = {
      id: crypto.randomUUID(),
      montantTotal: parseFloat(form.montantTotal),
      statut: form.statut,
      dateEmission: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const { error } = await supabase.from('factures').insert([newFacture])

    if (error) toast.error(error.message)
    else {
      toast.success('Facture créée avec succès')
      setOpen(false)
      setForm({ montantTotal: '', statut: 'EN_ATTENTE' })
      onSuccess?.()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Créer une facture</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle facture</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Montant total (€)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.montantTotal}
              onChange={(e) => setForm({ ...form, montantTotal: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Statut</Label>
            <Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                <SelectItem value="PAYE">Payée</SelectItem>
                <SelectItem value="REJETE">Rejetée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer la facture'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}