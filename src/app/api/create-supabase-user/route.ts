import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    // Create user with Supabase Admin API (you'd need service key for this)
    // For demo, let's provide instructions instead

    return NextResponse.json({
      success: true,
      message: 'To create a demo user in Supabase:',
      instructions: [
        '1. Go to your Supabase Authentication → Users',
        '2. Click "Add user" or "Invite user"',
        '3. Create user with:',
        '   - Email: admin@metrics-llc.com',
        '   - Password: admin123',
        '   - Auto confirm: Yes',
        '4. The user will appear in your auth.users table',
        '5. You can then sign in with those credentials'
      ],
      note: 'The user profile will be automatically created in your users table via trigger (if set up)'
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}