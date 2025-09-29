import { useSession } from 'next-auth/react'
import { useSupabaseAuth } from './useSupabaseAuth'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const nextAuthSession = useSession()
  const supabaseAuth = useSupabaseAuth()

  // If Supabase is configured and we have a Supabase user, use that
  if (supabase && supabaseAuth.user && !supabaseAuth.loading) {
    return {
      user: {
        id: supabaseAuth.user.id,
        email: supabaseAuth.user.email,
        name: supabaseAuth.user.user_metadata?.name || supabaseAuth.user.email?.split('@')[0] || '',
        image: supabaseAuth.user.user_metadata?.avatar_url || null,
        role: 'ADMIN' // We'll need to fetch this from your database
      },
      loading: false,
      signOut: supabaseAuth.signOut
    }
  }

  // If Supabase is loading, show loading state
  if (supabase && supabaseAuth.loading) {
    return {
      user: null,
      loading: true,
      signOut: supabaseAuth.signOut
    }
  }

  // Fall back to NextAuth
  return {
    user: nextAuthSession.data?.user || null,
    loading: nextAuthSession.status === 'loading',
    signOut: async () => {
      const { signOut } = await import('next-auth/react')
      return signOut()
    }
  }
}