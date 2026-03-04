'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
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

function SortableCard({ ordonnance }: { ordonnance: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: ordonnance.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-4 mb-3 cursor-grab active:cursor-grabbing shadow-sm">
      <div className="font-medium">
        {ordonnance.patients?.prenom} {ordonnance.patients?.nom}
      </div>
      <div className="text-sm text-slate-600 mt-1">{ordonnance.pathologie}</div>
    </Card>
  )
}

function DroppableColumn({ id, label, children, count }: { id: string; label: string; children: React.ReactNode; count: number }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div 
      ref={setNodeRef} 
      className={`bg-slate-50 p-4 rounded-xl border min-h-[500px] transition-colors ${isOver ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''}`}
    >
      <div className="font-bold mb-4 flex justify-between sticky top-0 bg-slate-50 z-10 py-2">
        {label}
        <Badge>{count}</Badge>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export default function Kanban() {
  const supabase = createClient()
  const [columns, setColumns] = useState<Record<string, any[]>>({})
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  const loadData = async () => {
    const { data } = await supabase
      .from('ordonnances')
      .select('*, patients(nom, prenom), profiles(nom, prenom)')
      .order('createdAt', { ascending: false })

    const grouped: Record<string, any[]> = {}
    STATUTS.forEach(s => grouped[s.id] = [])
    data?.forEach(o => grouped[o.statut]?.push(o))
    setColumns(grouped)
  }

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('kanban')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ordonnances' }, loadData)
      .subscribe()

    return () => channel.unsubscribe()
  }, [])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    const { error } = await supabase
      .from('ordonnances')
      .update({ statut: over.id })
      .eq('id', active.id)

    if (error) toast.error('Impossible de déplacer')
  }

  const activeCard = Object.values(columns).flat().find(o => o.id === activeId)

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {STATUTS.map((col) => (
          <DroppableColumn
            key={col.id}
            id={col.id}
            label={col.label}
            count={columns[col.id]?.length || 0}
          >
            <SortableContext items={columns[col.id]?.map(o => o.id) || []} strategy={verticalListSortingStrategy}>
              {columns[col.id]?.map((o) => (
                <SortableCard key={o.id} ordonnance={o} />
              ))}
            </SortableContext>
          </DroppableColumn>
        ))}
      </div>

      {/* DragOverlay = carte qui suit la souris pendant le drag */}
      <DragOverlay>
        {activeCard && (
          <Card className="p-4 shadow-xl bg-white border-2 border-emerald-500 scale-105">
            <div className="font-medium">
              {activeCard.patients?.prenom} {activeCard.patients?.nom}
            </div>
            <div className="text-sm text-slate-600 mt-1">{activeCard.pathologie}</div>
          </Card>
        )}
      </DragOverlay>
    </DndContext>
  )
}