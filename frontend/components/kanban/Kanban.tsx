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

function SortableCard({ 
  ordonnance, 
  onActionClick 
}: { 
  ordonnance: any; 
  onActionClick: (ordonnance: any) => void 
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: ordonnance.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 mb-3 cursor-grab active:cursor-grabbing shadow-sm group relative"
    >
      <div className="font-medium">
        {ordonnance.patients?.prenom} {ordonnance.patients?.nom}
      </div>
      <div className="text-sm text-slate-600 mt-1">{ordonnance.pathologie}</div>

      {/* Menu à trois points - Version renforcée */}
      <button
        onPointerDown={(e) => e.stopPropagation()} // Empêche le drag de démarrer ici
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onActionClick(ordonnance)
        }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 hover:bg-slate-100 p-1 rounded text-slate-500 hover:text-slate-700 pointer-events-auto z-10"
      >
        ⋮
      </button>
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

export default function Kanban({ 
  onActionClick 
}: { 
  onActionClick: (ordonnance: any) => void 
}) {
  const supabase = createClient()
  const [columns, setColumns] = useState<Record<string, any[]>>({})
  const [activeId, setActiveId] = useState<string | null>(null)

  const findStatus = (id: string) => {
    // Si l'id est déjà un statut valide (id de colonne)
    if (STATUTS.some(s => s.id === id)) return id
    
    // Sinon, on cherche quelle colonne contient la carte possédant cet ID
    for (const [status, items] of Object.entries(columns)) {
      if (items.some(item => item.id === id)) return status
    }
    return null
  }

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

    // Cleanup correct (sans Promise)
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // CORRECTION : Résoudre les statuts source et destination
    const overStatus = findStatus(overId)
    const activeStatus = findStatus(activeId)

    // Si on ne trouve pas de destination ou si on reste dans la même colonne
    if (!overStatus || overStatus === activeStatus) return

    // Mise à jour Supabase avec le bon statut résolu
    const { error } = await supabase
      .from('ordonnances')
      .update({ statut: overStatus })
      .eq('id', activeId)

    if (error) {
      toast.error('Impossible de déplacer la carte')
      console.error(error)
      return
    }

    // optimistic local update so UI reflects the change immediately
    setColumns((prev) => {
      const newColumns = { ...prev }
      
      // 1. Retirer la carte de sa colonne d'origine
      const sourceItems = [...(newColumns[activeStatus!] || [])]
      const cardIndex = sourceItems.findIndex(i => i.id === activeId)
      const [movedCard] = sourceItems.splice(cardIndex, 1)
      newColumns[activeStatus!] = sourceItems

      // 2. Ajouter la carte à la colonne de destination
      movedCard.statut = overStatus
      newColumns[overStatus] = [...(newColumns[overStatus] || []), movedCard]

      return newColumns
    })
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
              {columns[col.id]?.filter((o) => o.id !== activeId).map((o) => (
                <SortableCard 
                  key={o.id} 
                  ordonnance={o} 
                  onActionClick={onActionClick} 
                />
              ))}
            </SortableContext>
          </DroppableColumn>
        ))}
      </div>

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