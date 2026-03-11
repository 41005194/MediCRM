'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, Euro, TrendingUp } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    caMois: 0,
    caMoisPrecedent: 0,
    nouveauxPatients: 0,
    rdvsAujourdHui: 0,
    tauxConversion: 0,
    totalPatients: 0,
  })
  const [caEvolution, setCaEvolution] = useState<any[]>([])

  // États pour la gestion Admin
  const [isAdmin, setIsAdmin] = useState(false)
  const [allKines, setAllKines] = useState<any[]>([])
  const [selectedKineId, setSelectedKineId] = useState<string | 'all'>('all')

  // 1. Initialisation : Vérification du rôle et chargement des kinés
  useEffect(() => {
    const initDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', user.email)
        .single()

      if (profile) {
        if (profile.role === 'ADMIN') {
          setIsAdmin(true)
          const { data: kines } = await supabase
            .from('profiles')
            .select('id, nom, prenom')
            .eq('role', 'KINE')
          setAllKines(kines || [])
          setSelectedKineId('all')
        } else {
          setSelectedKineId(profile.id)
        }
      }
    }
    initDashboard()
  }, [])

  // 2. Chargement des statistiques (se déclenche quand selectedKineId change)
  useEffect(() => {
    if (!selectedKineId) return

    const loadDashboardData = async () => {
      setLoading(true)
      const now = new Date()
      const debutMoisActuel = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const debutMoisSuivant = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
      const debutMoisPrecedent = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
      const aujourdHui = new Date().toISOString().split('T')[0]

      // --- FILTRES ---
      const isGlobal = selectedKineId === 'all'

      // 1 & 2. Patients (Total et Nouveaux)
      let patientsQuery = supabase.from('patients').select('id', { count: 'exact' })
      let nouveauxQuery = supabase.from('patients').select('id', { count: 'exact' }).gte('createdAt', debutMoisActuel)

      if (!isGlobal) {
        // Si kiné spécifique, on filtre via les ordonnances
        const { data: ordos } = await supabase.from('ordonnances').select('patientId').eq('praticienId', selectedKineId)
        const patientIds = Array.from(new Set(ordos?.map(o => o.patientId) || []))
        
        patientsQuery = supabase.from('patients').select('id', { count: 'exact' }).in('id', patientIds)
        nouveauxQuery = supabase.from('patients').select('id', { count: 'exact' }).in('id', patientIds).gte('createdAt', debutMoisActuel)
      }

      const { count: totalPatients } = await patientsQuery
      const { count: nouveauxPatients } = await nouveauxQuery

      // 3. RDV Aujourd'hui
      let rdvsQuery = supabase.from('seances').select('*', { count: 'exact' }).eq('statut', 'PREVU').gte('dateHeure', aujourdHui).lt('dateHeure', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString())
      if (!isGlobal) rdvsQuery = rdvsQuery.eq('praticienId', selectedKineId)
      const { count: rdvsAujourdHui } = await rdvsQuery

      // 4. Chiffre d'Affaires (Via séances payées)
      const getCA = async (debut: string, fin: string) => {
        let q = supabase.from('seances').select('montant, facture:factures!inner(statut, dateEmission)').eq('facture.statut', 'PAYE').gte('facture.dateEmission', debut).lt('facture.dateEmission', fin)
        if (!isGlobal) q = q.eq('praticienId', selectedKineId)
        const { data } = await q
        return data?.reduce((sum, s) => sum + (s.montant || 0), 0) || 0
      }

      const caMois = await getCA(debutMoisActuel, debutMoisSuivant)
      const caMoisPrecedent = await getCA(debutMoisPrecedent, debutMoisActuel)

      // 5. Évolution Graphique (6 mois)
      const evolution = []
      for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const dDebut = new Date(d.getFullYear(), d.getMonth(), 1).toISOString()
        const dFin = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString()
        const val = await getCA(dDebut, dFin)
        evolution.push({
          mois: d.toLocaleString('fr-FR', { month: 'short' }),
          ca: val
        })
      }
      setCaEvolution(evolution)

      // 6. Taux de Conversion
      let ordoQ = supabase.from('ordonnances').select('statut')
      if (!isGlobal) ordoQ = ordoQ.eq('praticienId', selectedKineId)
      const { data: ordosData } = await ordoQ
      const totalOrdos = ordosData?.length || 0
      const terminees = ordosData?.filter(o => ['FIN_DE_TRAITEMENT', 'SUIVI_PREVENTIF'].includes(o.statut)).length || 0

      setStats({
        caMois,
        caMoisPrecedent,
        nouveauxPatients: nouveauxPatients || 0,
        rdvsAujourdHui: rdvsAujourdHui || 0,
        tauxConversion: totalOrdos ? Math.round((terminees / totalOrdos) * 100) : 0,
        totalPatients: totalPatients || 0,
      })
      setLoading(false)
    }

    loadDashboardData()
  }, [selectedKineId])

  // Rendu UI (Sélecteur + Stats)
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-72 p-8 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Tableau de bord</h1>
              <p className="text-slate-500">Bienvenue sur votre espace de gestion</p>
            </div>

            {/* Sélecteur Admin */}
            {isAdmin && (
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border shadow-sm">
                <Label className="text-xs font-bold text-slate-400 uppercase">Vue :</Label>
                <select 
                  className="text-sm font-semibold bg-transparent border-none focus:ring-0"
                  value={selectedKineId}
                  onChange={(e) => setSelectedKineId(e.target.value)}
                >
                  <option value="all">Cabinet (Global)</option>
                  {allKines.map(kine => (
                    <option key={kine.id} value={kine.id}>{kine.prenom} {kine.nom}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="CA du mois" 
              value={`${stats.caMois.toLocaleString()} €`} 
              icon={<Euro className="w-5 h-5" />}
              trend={stats.caMoisPrecedent > 0 ? Math.round(((stats.caMois - stats.caMoisPrecedent) / stats.caMoisPrecedent) * 100) : 0}
            />
            <StatCard title="Patients totaux" value={stats.totalPatients} icon={<Users className="w-5 h-5" />} />
            <StatCard title="RDV aujourd'hui" value={stats.rdvsAujourdHui} icon={<Calendar className="w-5 h-5" />} />
            <StatCard title="Taux de conversion" value={`${stats.tauxConversion}%`} icon={<TrendingUp className="w-5 h-5" />} />
          </div>

          {/* Graphique d'évolution en courbe */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Évolution du chiffre d'affaires</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={caEvolution}>
                  <defs>
                    <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="mois" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    tickFormatter={(value) => `${value}€`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ca" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCa)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, trend }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>
          {trend !== undefined && (
            <span className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-slate-500">{title}</div>
      </CardContent>
    </Card>
  )
}