'use client'

import { useEffect, useState } from 'react'
import { createClient } from './supabase'

export function useUserRole() {
  const supabase = createClient()
  const [role, setRole] = useState<'ADMIN' | 'KINE' | 'STANDARD' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('userId', user.id)
        .single()

      setRole(data?.role || 'KINE')
      setLoading(false)
    }

    getRole()
  }, [supabase])

  return { role, loading }
}