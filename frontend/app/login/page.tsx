'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Heart } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
        toast.error(error.message)
    } else {
        toast.success('Connexion réussie !')
        router.push('/dashboard')
    }
    setLoading(false)
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Heart className="w-16 h-16 text-emerald-600" />
          </div>
          <CardTitle className="text-3xl text-emerald-700">MediCRM</CardTitle>
          <p className="text-slate-600">Cabinet de Kinésithérapie</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="kiné@cabinet.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Mot de passe</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleLogin} className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
          <p className="text-center text-xs text-slate-500">
            Utilise ton compte Supabase Auth
          </p>
        </CardContent>
      </Card>
    </div>
  )
}