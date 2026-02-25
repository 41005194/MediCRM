'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Users, Calendar, TrendingUp, Award } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart, CartesianGrid } from 'recharts'

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()

  const [stats, setStats] = useState({
    caMois: 0,
    caMoisPrecedent: 0,
    nouveauxPatients: 0,
    rdvsAujourdHui: 0,
    tauxConversion: 0,
    totalPatients: 0,
  })
  const [caEvolution, setCaEvolution] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      // 1. Total patients
      const { count: totalPatients } = await supabase.from('patients').select('*', { count: 'exact' })

      // 2. Nouveaux patients ce mois
      const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      const { count: nouveauxPatients } = await supabase
        .from('patients')
        .select('*', { count: 'exact' })
        .gte('createdAt', debutMois)

      // 3. RDV aujourd’hui (séances prévues)
      const aujourdHui = new Date().toISOString().split('T')[0]
      const { count: rdvsAujourdHui } = await supabase
        .from('seances')
        .select('*', { count: 'exact' })
        .eq('statut', 'PREVU')
        .gte('dateHeure', aujourdHui)
        .lt('dateHeure', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString())

      // 4. CA du mois + mois précédent + évolution (simplifié)
      const { data: facturesMois } = await supabase
        .from('factures')
        .select('montantTotal')
        .eq('statut', 'PAYE')
        .gte('dateEmission', debutMois)

      const caMois = facturesMois?.reduce((sum, f) => sum + (f.montantTotal || 0), 0) || 0

      // Graphique évolution (6 derniers mois)
      const mois = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const debut = new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
        const fin = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString()

        const { data } = await supabase
          .from('factures')
          .select('montantTotal')
          .eq('statut', 'PAYE')
          .gte('dateEmission', debut)
          .lt('dateEmission', fin)

        mois.push({
          mois: date.toLocaleString('fr-FR', { month: 'short' }),
          ca: data?.reduce((sum, f) => sum + (f.montantTotal || 0), 0) || 0,
        })
      }
      setCaEvolution(mois)

      // Taux de conversion simplifié
      const { count: totalOrdo } = await supabase.from('ordonnances').select('*', { count: 'exact' })
      const { count: terminees } = await supabase
        .from('ordonnances')
        .select('*', { count: 'exact' })
        .in('statut', ['FIN_DE_TRAITEMENT', 'SUIVI_PREVENTIF'])

      const tauxConversion = totalOrdo ? Math.round((terminees! / totalOrdo) * 100) : 0

      setStats({
        caMois,
        caMoisPrecedent: 0, // tu peux l’améliorer plus tard
        nouveauxPatients: nouveauxPatients || 0,
        rdvsAujourdHui: rdvsAujourdHui || 0,
        tauxConversion,
        totalPatients: totalPatients || 0,
      })
      setLoading(false)
    }

    loadDashboard()
  }, [supabase])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement des indicateurs...</div>

  const evolutionPourcent = stats.caMoisPrecedent 
    ? Math.round(((stats.caMois - stats.caMoisPrecedent) / stats.caMoisPrecedent) * 100) 
    : 0

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-emerald-600" />
          <h1 className="text-2xl font-bold text-slate-800">MediCRM</h1>
        </div>
        <Button variant="outline" onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}>
          Déconnexion
        </Button>
      </header>

      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Tableau de bord analytique</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">CA du mois</CardTitle>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.caMois.toLocaleString('fr-FR')} €</p>
              {evolutionPourcent !== 0 && (
                <p className={`text-sm mt-1 ${evolutionPourcent > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {evolutionPourcent > 0 ? '+' : ''}{evolutionPourcent}% vs mois dernier
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
              <Award className="w-5 h-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.tauxConversion}%</p>
              <p className="text-sm text-slate-600">Prospect → Patient</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux patients</CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.nouveauxPatients}</p>
              <p className="text-sm text-slate-600">ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">RDV aujourd’hui</CardTitle>
              <Calendar className="w-5 h-5 text-teal-600" />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.rdvsAujourdHui}</p>
            </CardContent>
          </Card>
        </div>

        {/* Graphique CA */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Évolution du CA (6 derniers mois)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={caEvolution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} €`, 'CA']} />
                <Line type="monotone" dataKey="ca" stroke="#10B981" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button size="lg" className="bg-emerald-600" onClick={() => router.push('/patients')}>
            Gérer les patients
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push('/ordonnances')}>
            Pipeline Kanban
          </Button>
        </div>
      </div>
    </div>
  )
}