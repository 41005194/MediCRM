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
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User } from 'lucide-react'
import { toast } from 'sonner'

const STATUTS = [
  { id: 'NOUVELLE_DEMANDE', label: 'Nouvelle demande', color: 'bg-gray-100 text-gray-800' },
  { id: 'BILAN_PROGRAMME', label: 'Bilan Programmé', color: 'bg-blue-100 text-blue-800' },
  { id: 'EN_COURS_DE_SOIN', label: 'En cours de soin', color: 'bg-green-100 text-green-800' },
  { id: 'FIN_DE_TRAITEMENT', label: 'Fin de traitement', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'SUIVI_PREVENTIF', label: 'Suivi préventif', color: 'bg-purple-100 text-purple-800' },
]

function SortableCard({ ordonnance }: { ordonnance: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: ordonnance.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-4 mb-3 cursor-grab active:cursor-grabbing shadow-sm">
      <div className="font-medium">
        {ordonnance.patient?.prenom || '?'} {ordonnance.patient?.nom || '?'}
      </div>
      <div className="text-sm text-gray-600 mt-1">{ordonnance.pathologie || 'Non précisé'}</div>
      <div className="mt-3 text-xs text-gray-500 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(ordonnance.dateOrdonnance).toLocaleDateString('fr-FR')}
        </div>
        {ordonnance.praticien && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {ordonnance.praticien.prenom}
          </div>
        )}
      </div>
    </Card>
  )
}

export default function Kanban() {
  const supabase = createClient()
  const [columns, setColumns] = useState<Record<string, any[]>>({})

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const loadOrdonnances = async () => {
    try {
      const { data, error } = await supabase
        .from('ordonnances')
        .select(`
          *,
          patient:patients (nom, prenom),
          medecin:medecins (nom, prenom),
          praticien:profiles (nom, prenom)
        `)
        .order('createdAt', { ascending: false })

      if (error) {
        toast.error('Erreur chargement ordonnances')
        console.error(error)
        return
      }

      const newColumns: Record<string, any[]> = {}
      STATUTS.forEach(s => { newColumns[s.id] = [] })

      data?.forEach(ordo => {
        if (newColumns[ordo.statut]) {
          newColumns[ordo.statut].push(ordo)
        } else {
          console.warn('Statut inconnu:', ordo.statut)
        }
      })

      setColumns(newColumns)
    } catch (err) {
      console.error('Erreur fetch ordonnances:', err)
    }
  }

  useEffect(() => {
    loadOrdonnances()

    const channel = supabase
      .channel('public:ordonnances')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ordonnances' }, () => {
        loadOrdonnances()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const newStatut = over.id as string

    try {
      await supabase
        .from('ordonnances')
        .update({ statut: newStatut })
        .eq('id', active.id)

    } catch (err) {
      toast.error('Erreur déplacement')
      console.error(err)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 overflow-x-auto pb-4">
        {STATUTS.map((column) => (
          <div key={column.id} className="min-w-[280px] bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-slate-50 z-10 py-2">
              <h3 className="font-semibold text-slate-700">{column.label}</h3>
              <Badge variant="secondary" className={column.color}>
                {columns[column.id]?.length || 0}
              </Badge>
            </div>

            <SortableContext
              items={columns[column.id]?.map((o) => o.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 min-h-[400px]">
                {columns[column.id]?.map((ordo) => (
                  <SortableCard key={ordo.id} ordonnance={ordo} />
                ))}
                {columns[column.id]?.length === 0 && (
                  <div className="text-center text-slate-400 py-8 text-sm">
                    Aucune ordonnance ici
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  )
}