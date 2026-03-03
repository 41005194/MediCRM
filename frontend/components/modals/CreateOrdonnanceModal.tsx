'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { toast } from 'sonner'

export default function CreateOrdonnanceModal({ onSuccess }: { onSuccess?: () => void }) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [medecins, setMedecins] = useState<any[]>([])

  const [form, setForm] = useState({
    patientId: '',
    medecinId: '',
    dateOrdonnance: '',
    nbSeancesPrescrites: 10,
    pathologie: '',
    typePriseEnCharge: 'ALD',
    statut: 'NOUVELLE_DEMANDE' as const
  })

  useEffect(() => {
    if (open) {
      supabase.from('patients').select('id, prenom, nom').then(({ data }) => setPatients(data || []))
      supabase.from('medecins').select('id, prenom, nom').then(({ data }) => setMedecins(data || []))
    }
  }, [open, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const newOrdo = {
      id: crypto.randomUUID(),
      ...form,
      dateOrdonnance: new Date(form.dateOrdonnance).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const { error } = await supabase.from('ordonnances').insert([newOrdo])
    if (error) {
      toast.error(error.message)
    } else {
      // === LOG ACTIVITÉ POUR ORDONNANCE ===
      await supabase.from('activites').insert([{
        id: crypto.randomUUID(),
        type: 'ordonnance',
        description: `Nouvelle ordonnance créée pour ${form.pathologie}`,
        ordonnanceId: newOrdo.id,
        patientId: newOrdo.patientId,
        createdAt: new Date().toISOString()
      }])
      toast.success('✅ Ordonnance créée avec succès !')
      setOpen(false)
      onSuccess?.()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nouvelle ordonnance</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle ordonnance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Patient</Label>
            <Select onValueChange={(v) => setForm({ ...form, patientId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.prenom} {p.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Médecin prescripteur</Label>
            <Select onValueChange={(v) => setForm({ ...form, medecinId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un médecin" />
              </SelectTrigger>
              <SelectContent>
                {medecins.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.prenom} {m.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Date de l’ordonnance</Label>
            <Input 
              type="date" 
              onChange={(e) => setForm({ ...form, dateOrdonnance: e.target.value })} 
              required 
            />
          </div>

          <div>
            <Label>Pathologie / Motif</Label>
            <Input 
              value={form.pathologie} 
              onChange={(e) => setForm({ ...form, pathologie: e.target.value })} 
              required 
            />
          </div>

          <Button type="submit" className="w-full bg-emerald-600" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer l’ordonnance'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}