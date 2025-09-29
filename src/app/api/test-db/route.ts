import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Testing database connection...')

    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // Check if we can query (this will fail if tables don't exist)
    try {
      const userCount = await prisma.user.count()
      console.log('Users table exists, count:', userCount)
    } catch (error) {
      console.log('Users table does not exist yet:', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      database_url_configured: !!process.env.DATABASE_URL,
      database_url_preview: process.env.DATABASE_URL ?
        process.env.DATABASE_URL.substring(0, 30) + '...' : 'Not set'
    })

  } catch (error) {
    console.error('Database connection failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        database_url_configured: !!process.env.DATABASE_URL
      },
      { status: 500 }
    )
  }
}