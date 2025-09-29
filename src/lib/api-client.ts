import { supabase } from './supabase'

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers)

  // Add Supabase auth token if available
  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        headers.set('authorization', `Bearer ${session.access_token}`)
      }
    } catch (error) {
      console.error('Error getting Supabase session:', error)
    }
  }

  return fetch(url, {
    ...options,
    headers,
  })
}