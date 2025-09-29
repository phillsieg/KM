import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Fixing users table schema...')

    // Add missing columns to users table
    try {
      await prisma.$executeRaw`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" TEXT`
      console.log('✅ Added password column')
    } catch (error) {
      console.log('⚠️ Password column:', error)
    }

    // Now create the admin user
    const user = await prisma.user.create({
      data: {
        id: 'admin-supabase-user',
        email: 'admin@metrics-llc.com',
        name: 'Admin User',
        role: 'ADMIN',
        password: null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Users table fixed and admin user created!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Error fixing users table:', error)

    // If user already exists, try updating
    if (error instanceof Error && error.message.includes('unique constraint')) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: 'admin@metrics-llc.com' }
        })

        return NextResponse.json({
          success: true,
          message: 'Admin user already exists!',
          user: existingUser
        })
      } catch (findError) {
        console.error('Error finding existing user:', findError)
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fix users table',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}