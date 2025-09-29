import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    // Get current user session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session?.user) {
      return NextResponse.json(
        { success: false, error: 'No authenticated user found' },
        { status: 401 }
      )
    }

    const user = session.user

    // Check if user exists in Prisma database
    let prismaUser = await prisma.user.findUnique({
      where: { email: user.email! }
    })

    if (!prismaUser) {
      // Create user profile in Prisma database
      prismaUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
          role: user.email === 'admin@metrics-llc.com' ? 'ADMIN' : 'VISITOR'
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'User profile synced successfully',
      user: {
        id: prismaUser.id,
        email: prismaUser.email,
        name: prismaUser.name,
        role: prismaUser.role
      }
    })

  } catch (error) {
    console.error('Error syncing user profile:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}