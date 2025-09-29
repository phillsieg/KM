import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Create the admin user directly in the database
    const user = await prisma.user.upsert({
      where: { email: 'admin@metrics-llc.com' },
      update: {
        role: 'ADMIN'
      },
      create: {
        id: 'supabase-admin-user',
        email: 'admin@metrics-llc.com',
        name: 'Admin User',
        role: 'ADMIN'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}