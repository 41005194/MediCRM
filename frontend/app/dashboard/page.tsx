'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Heart, Users, Calendar, BarChart3 } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setSession(session)
      }
      setLoading(false)
    })
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        Chargement du dashboard...
      </div>
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-emerald-600" />
          <h1 className="text-2xl font-bold text-slate-800">MediCRM</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">{session?.user?.email}</p>
            <p className="text-xs text-emerald-600">Kiné connecté</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </header>

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Tableau de bord</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <Users className="w-10 h-10 text-emerald-600 mb-4" />
            <p className="text-4xl font-bold">142</p>
            <p className="text-slate-600 mt-1">Patients totaux</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <Calendar className="w-10 h-10 text-teal-600 mb-4" />
            <p className="text-4xl font-bold">8</p>
            <p className="text-slate-600 mt-1">RDV aujourd’hui</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <BarChart3 className="w-10 h-10 text-amber-600 mb-4" />
            <p className="text-4xl font-bold">4 820 €</p>
            <p className="text-slate-600 mt-1">CA du mois</p>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
        <Button 
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700" 
            onClick={() => router.push('/patients')}
        >
            Gérer les patients
        </Button>
        <Button 
            size="lg" 
            variant="outline"
            onClick={() => router.push('/ordonnances')}
        >
            Voir le Pipeline Kanban →
        </Button>
        </div>
      </div>
    </div>
  )
}