import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    console.log('Creating demo admin user...')

    // Hash password for demo user
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create or update demo admin user
    const demoUser = await prisma.user.upsert({
      where: { email: 'admin@metrics-llc.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN'
      },
      create: {
        email: 'admin@metrics-llc.com',
        name: 'Demo Admin',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Demo admin user created successfully!',
      user: {
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role
      },
      credentials: {
        email: 'admin@metrics-llc.com',
        password: 'admin123'
      }
    })

  } catch (error) {
    console.error('Error creating demo user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create demo user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}