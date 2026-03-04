'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const STATUTS = [
  { id: 'NOUVELLE_DEMANDE', label: 'Nouvelle demande' },
  { id: 'BILAN_PROGRAMME', label: 'Bilan Programmé' },
  { id: 'EN_COURS_DE_SOIN', label: 'En cours de soin' },
  { id: 'FIN_DE_TRAITEMENT', label: 'Fin de traitement' },
  { id: 'SUIVI_PREVENTIF', label: 'Suivi préventif' },
]

export default function Kanban() {
  const supabase = createClient()
  const [columns, setColumns] = useState<Record<string, any[]>>({})
  const [total, setTotal] = useState(0)

  const loadData = async () => {
    const { data, error } = await supabase
      .from('ordonnances')
      .select(`
        *,
        patients(nom, prenom),
        profiles(nom, prenom)
      `)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error("❌ Erreur Supabase :", error)
      toast.error("Erreur chargement Kanban")
      return
    }

    setTotal(data?.length || 0)

    const grouped: Record<string, any[]> = {}
    STATUTS.forEach(s => grouped[s.id] = [])

    data?.forEach((o: any) => {
      if (grouped[o.statut]) grouped[o.statut].push(o)
    })

    setColumns(grouped)
  }

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('kanban')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ordonnances' }, loadData)
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return (
    <div>
      <div className="mb-6 p-4 bg-yellow-100 rounded-xl text-sm">
        <strong>Debug :</strong> {total} ordonnance(s) trouvée(s) dans la base
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {STATUTS.map((col) => (
          <div key={col.id} className="bg-slate-50 p-4 rounded-xl border">
            <div className="font-bold mb-3 flex justify-between">
              {col.label}
              <Badge>{columns[col.id]?.length || 0}</Badge>
            </div>
            <div className="space-y-3 min-h-[400px]">
              {columns[col.id]?.map((o) => (
                <Card key={o.id} className="p-4">
                  <div className="font-medium">
                    {o.patients?.prenom} {o.patients?.nom}
                  </div>
                  <div className="text-sm text-slate-600">{o.pathologie}</div>
                </Card>
              )) || <div className="text-slate-400 text-center py-8">Aucune ordonnance ici</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}