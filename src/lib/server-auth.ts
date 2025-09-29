import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

export interface AuthUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role?: string
}

export async function getAuthUser(request?: NextRequest): Promise<AuthUser | null> {
  // Try Supabase first if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey && request) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // Get auth token from request headers
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (user && !error) {
          // Try to get user profile from database
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          return {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || user.email!.split('@')[0],
            image: user.user_metadata?.avatar_url || null,
            role: dbUser?.role || 'VISITOR'
          }
        }
      }
    } catch (error) {
      console.error('Supabase auth error:', error)
    }
  }

  // Fall back to NextAuth
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.email) {
      // Get user from database to include role
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      return {
        id: dbUser?.id || session.user.id || '',
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        role: dbUser?.role || 'VISITOR'
      }
    }
  } catch (error) {
    console.error('NextAuth session error:', error)
  }

  return null
}