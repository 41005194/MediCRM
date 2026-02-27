'use client'

import CreateOrdonnanceModal from '@/components/modals/CreateOrdonnanceModal'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Kanban from '@/components/kanban/Kanban'

export default function OrdonnancesPage() {
  const [tab, setTab] = useState('kanban')

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Pipeline des soins</h1>
          <CreateOrdonnanceModal onSuccess={() => window.location.reload()} />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="kanban">Vue Kanban</TabsTrigger>
            <TabsTrigger value="liste">Vue Liste</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban">
            <Kanban />
          </TabsContent>

          <TabsContent value="liste">
            <p className="text-slate-600">Vue liste à venir (on peut l’ajouter très vite si tu veux)</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}