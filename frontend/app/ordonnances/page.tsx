'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Kanban from '@/components/kanban/Kanban'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function OrdonnancesPage() {
  const [tab, setTab] = useState('kanban')

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Pipeline des soins</h1>
          <Button className="bg-emerald-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle ordonnance
          </Button>
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