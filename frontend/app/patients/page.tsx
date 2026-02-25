'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Patient = {
  id: string
  nom: string
  prenom: string
  dateNaissance: string
  email?: string
  telephone?: string
}

export default function PatientsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionLoading, setSessionLoading] = useState(true)

  // Vérification session + protection
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      }
      setSessionLoading(false)
    })
  }, [router, supabase])

  // Chargement des patients
  useEffect(() => {
    if (sessionLoading) return

    const fetchPatients = async () => {
      const { data } = await supabase
        .from('patients')
        .select('*')
        .order('createdAt', { ascending: false })
      setPatients(data || [])
      setLoading(false)
    }

    fetchPatients()
  }, [sessionLoading, supabase])

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        Chargement des patients...
      </div>
    )
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Patients</h1>
          <Button>Ajouter un patient</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des patients ({patients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.prenom} {p.nom}
                    </TableCell>
                    <TableCell>
                      {new Date(p.dateNaissance).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>{p.email || '-'}</TableCell>
                    <TableCell>{p.telephone || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}