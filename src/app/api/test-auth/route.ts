import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    console.log('Testing database connection...')
    
    // Try to connect to database
    await prisma.$connect()
    console.log('Database connection successful')
    
    // Try to query users table
    const userCount = await prisma.user.count()
    console.log(`Found ${userCount} users in database`)
    
    // Test environment variables
    const hasGoogleId = !!process.env.GOOGLE_CLIENT_ID
    const hasGoogleSecret = !!process.env.GOOGLE_CLIENT_SECRET
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    
    return NextResponse.json({
      status: 'success',
      database: {
        connected: true,
        userCount
      },
      environment: {
        hasGoogleId,
        hasGoogleSecret,
        hasNextAuthSecret,
        hasNextAuthUrl,
        hasDatabaseUrl,
        nodeEnv: process.env.NODE_ENV
      }
    })
    
  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      database: {
        connected: false
      },
      environment: {
        hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    })
  }
}