import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('=== BULLETPROOF SIGNUP STARTED ===')
    const { email, password, name } = await request.json()
    console.log('Request data received:', { email, name, passwordLength: password?.length })

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('Password hashed successfully')

    // Try to initialize database and create user
    let prisma
    try {
      const { PrismaClient } = await import('@prisma/client')
      prisma = new PrismaClient()
      console.log('Prisma client created')
    } catch (err) {
      console.error('Failed to create Prisma client:', err)
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    try {
      // Try to create users table if it doesn't exist
      console.log('Creating users table if it doesnt exist...')
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "email" TEXT NOT NULL UNIQUE,
          "name" TEXT,
          "image" TEXT,
          "password" TEXT,
          "role" TEXT NOT NULL DEFAULT 'CONTRIBUTOR',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `
      console.log('Users table created/verified')

      // Check if user already exists
      const existingUsers = await prisma.$queryRaw<{count: bigint}[]>`
        SELECT COUNT(*) as count FROM users WHERE email = ${email}
      `
      
      if (Number(existingUsers[0].count) > 0) {
        await prisma.$disconnect()
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }

      // Create user with raw SQL
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`
      console.log('Creating user with ID:', userId)
      
      await prisma.$executeRaw`
        INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
        VALUES (${userId}, ${email}, ${name || null}, ${hashedPassword}, 'CONTRIBUTOR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `
      
      console.log('User created successfully')

      // Verify user was created
      const createdUsers = await prisma.$queryRaw<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        createdAt: Date;
      }[]>`
        SELECT id, email, name, role, "createdAt" FROM users WHERE id = ${userId}
      `

      await prisma.$disconnect()

      if (createdUsers.length === 0) {
        return NextResponse.json(
          { error: 'User creation verification failed' },
          { status: 500 }
        )
      }

      const user = createdUsers[0]
      console.log('User verified:', user)

      return NextResponse.json(
        { 
          message: 'User created successfully with bulletproof method', 
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt
          }
        },
        { status: 201 }
      )

    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      await prisma?.$disconnect()
      
      return NextResponse.json(
        { 
          error: 'Database operation failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('=== BULLETPROOF SIGNUP ERROR ===', error)
    return NextResponse.json(
      { 
        error: 'Internal server error in bulletproof signup',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Bulletproof signup endpoint - POST to create user',
    info: 'This endpoint handles all database initialization automatically'
  })
}