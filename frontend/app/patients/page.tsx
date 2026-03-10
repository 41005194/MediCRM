'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import CreatePatientModal from '@/components/modals/CreatePatientModal'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Papa from 'papaparse'
import Sidebar from '@/components/layout/Sidebar'

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

  const exportCSV = () => {
    const csv = patients.map(p => `${p.prenom};${p.nom};${p.email};${p.telephone}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'patients.csv'
    a.click()
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-72">
        <div className="p-8 bg-slate-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800">Patients</h1>
                <CreatePatientModal onSuccess={() => window.location.reload()} />
                <Button onClick={exportCSV}>Exporter CSV</Button>
                <Button onClick={() => document.getElementById('csv-input')?.click()}>
                  Importer CSV
                </Button>
                <input
                  id="csv-input"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    Papa.parse(file, {
                      header: true,
                      skipEmptyLines: true,
                      complete: async (results) => {
                        const patientsToInsert = results.data.map((row: any) => ({
                          id: crypto.randomUUID(),
                          nom: row.nom || '',
                          prenom: row.prenom || '',
                          dateNaissance: row.dateNaissance ? new Date(row.dateNaissance).toISOString() : null,
                          email: row.email || null,
                          telephone: row.telephone || null,
                          antecedents: row.antecedents || null,
                          adresse: row.adresse || null,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        }))

                        const { error } = await supabase.from('patients').insert(patientsToInsert)
                        if (error) toast.error(error.message)
                        else toast.success(`${patientsToInsert.length} patients importés avec succès !`)
                      }
                    })
                  }}
                />
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
      </div>
    </div>
  )
}