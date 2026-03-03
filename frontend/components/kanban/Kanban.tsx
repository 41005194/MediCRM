'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'

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
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-4 mb-3 cursor-grab active:cursor-grabbing">
      <p className="font-medium">{ordonnance.patient?.prenom} {ordonnance.patient?.nom}</p>
      <p className="text-sm text-slate-600">{ordonnance.pathologie}</p>
      <div className="mt-2 text-xs text-slate-500 flex gap-3">
        <span>📅 {new Date(ordonnance.dateOrdonnance).toLocaleDateString('fr-FR')}</span>
        {ordonnance.praticien && <span>👤 {ordonnance.praticien.prenom}</span>}
      </div>
    </Card>
  )
}

export default function Kanban() {
  const supabase = createClient()
  const [ordonnances, setOrdonnances] = useState<Record<string, any[]>>({})

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('ordonnances')
        .select('*, patient(*), medecin(*), praticien(*)')
        .order('createdAt', { ascending: false })

      const grouped: Record<string, any[]> = {}
      STATUTS.forEach(s => grouped[s.id] = [])
      data?.forEach(o => grouped[o.statut]?.push(o))
      setOrdonnances(grouped)
    }

    fetchData()

    const channel = supabase.channel('ordonnances')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ordonnances' }, fetchData)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    await supabase.from('ordonnances').update({ statut: over.id }).eq('id', active.id)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {STATUTS.map(col => (
          <div key={col.id} className="bg-slate-50 p-4 rounded-xl">
            <h3 className="font-bold mb-4">{col.label}</h3>
            <SortableContext items={ordonnances[col.id]?.map(o => o.id) || []} strategy={verticalListSortingStrategy}>
              <div className="space-y-3 min-h-[500px]">
                {ordonnances[col.id]?.map(o => <SortableCard key={o.id} ordonnance={o} />)}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  )
}