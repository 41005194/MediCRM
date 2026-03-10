'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Home, Users, List, History, FileText, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/ordonnances', label: 'Ordonnances', icon: List },
  { href: '/historique', label: 'Historique', icon: History },
  { href: '/factures', label: 'Factures', icon: FileText },   // ← visible pour tout le monde (Kine + Admin)
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Déconnexion réussie')
    router.push('/login')
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 flex flex-col z-50 shadow-sm">
      <div className="p-6 border-b flex items-center gap-3">
        <Heart className="w-9 h-9 text-emerald-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">MediCRM</h1>
          <p className="text-xs text-slate-500">Cabinet Kiné</p>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50">
          <LogOut className="w-5 h-5 mr-3" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}