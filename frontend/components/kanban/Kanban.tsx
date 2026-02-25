'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User } from 'lucide-react'

type Ordonnance = any // on typpera mieux plus tard

const STATUTS = [
  { id: 'NOUVELLE_DEMANDE', label: 'Nouvelle demande', color: 'bg-slate-200 text-slate-700' },
  { id: 'BILAN_PROGRAMME', label: 'Bilan Programmé', color: 'bg-blue-200 text-blue-700' },
  { id: 'EN_COURS_DE_SOIN', label: 'En cours de soin', color: 'bg-emerald-200 text-emerald-700' },
  { id: 'FIN_DE_TRAITEMENT', label: 'Fin de traitement', color: 'bg-amber-200 text-amber-700' },
  { id: 'SUIVI_PREVENTIF', label: 'Suivi préventif', color: 'bg-purple-200 text-purple-700' },
]

function SortableCard({ ordonnance }: { ordonnance: Ordonnance }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: ordonnance.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-4 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{ordonnance.patient?.prenom} {ordonnance.patient?.nom}</p>
          <p className="text-sm text-slate-600">{ordonnance.pathologie}</p>
        </div>
        <Badge className={STATUTS.find(s => s.id === ordonnance.statut)?.color}>
          {STATUTS.find(s => s.id === ordonnance.statut)?.label}
        </Badge>
      </div>
      <div className="mt-3 text-xs text-slate-500 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {new Date(ordonnance.dateOrdonnance).toLocaleDateString('fr-FR')}
        </div>
        {ordonnance.praticien && (
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" /> {ordonnance.praticien.prenom}
          </div>
        )}
      </div>
    </Card>
  )
}

export default function Kanban() {
  const supabase = createClient()
  const [ordonnances, setOrdonnances] = useState<Record<string, Ordonnance[]>>({})

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  // Chargement initial + Realtime
  useEffect(() => {
    const fetchOrdonnances = async () => {
      const { data } = await supabase
        .from('ordonnances')
        .select('*, patient(*), praticien(*), medecin(*)')
        .order('createdAt', { ascending: false })

      const grouped: Record<string, Ordonnance[]> = {}
      STATUTS.forEach(s => grouped[s.id] = [])
      data?.forEach(o => grouped[o.statut].push(o))
      setOrdonnances(grouped)
    }

    fetchOrdonnances()

    // REALTIME
    const channel = supabase
      .channel('ordonnances-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ordonnances' }, fetchOrdonnances)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeOrdo = Object.values(ordonnances).flat().find(o => o.id === active.id)
    if (!activeOrdo) return

    const newStatut = over.id as string

    // Mise à jour en base
    await supabase
      .from('ordonnances')
      .update({ statut: newStatut })
      .eq('id', active.id)

    // Le realtime se chargera de rafraîchir tout le monde
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {STATUTS.map((col) => (
          <div key={col.id} className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-slate-50 py-2">
              <h3 className="font-semibold text-slate-700">{col.label}</h3>
              <Badge variant="secondary">{ordonnances[col.id]?.length || 0}</Badge>
            </div>

            <SortableContext items={ordonnances[col.id]?.map(o => o.id) || []} strategy={verticalListSortingStrategy}>
              <div className="space-y-3 min-h-[400px]">
                {ordonnances[col.id]?.map((ordo) => (
                  <SortableCard key={ordo.id} ordonnance={ordo} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  )
}