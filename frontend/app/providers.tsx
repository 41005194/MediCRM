'use client'

import { createClient } from '@/lib/supabase'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient())
  return <>{children}</>
}