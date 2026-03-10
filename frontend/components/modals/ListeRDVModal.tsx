'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ListeRDVModal({
  ordonnance,
  open,
  onClose
}: {
  ordonnance: any | null
  open: boolean
  onClose: () => void
}) {
  const supabase = createClient()
  const [rdvs, setRdvs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Hook toujours appelé
  useEffect(() => {
    if (!open || !ordonnance) {
      setRdvs([])
      setLoading(false)
      return
    }

    supabase
      .from('seances')
      .select('*')
      .eq('ordonnanceId', ordonnance.id)
      .order('dateHeure', { ascending: true })
      .then(({ data }) => {
        setRdvs(data || [])
        setLoading(false)
      })
  }, [ordonnance, open, supabase])

  // Early return après les hooks
  if (!ordonnance) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Rendez-vous de {ordonnance.patients?.prenom || ''} {ordonnance.patients?.nom || ''}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Chargement des rendez-vous...</p>
        ) : rdvs.length === 0 ? (
          <p className="text-slate-500 py-8 text-center">Aucun rendez-vous planifié pour le moment.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date et heure</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rdvs.map((rdv) => (
                <TableRow key={rdv.id}>
                  <TableCell>{new Date(rdv.dateHeure).toLocaleString('fr-FR')}</TableCell>
                  <TableCell className="capitalize">{rdv.statut}</TableCell>
                  <TableCell>{rdv.note || '-'}</TableCell>
                  <TableCell>{rdv.montant} €</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Button onClick={onClose} className="mt-4">Fermer</Button>
      </DialogContent>
    </Dialog>
  )
}