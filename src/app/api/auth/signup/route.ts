import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

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

    // First, try to ensure database tables exist
    try {
      // Try to query users table to see if it exists
      await prisma.user.findFirst()
    } catch (dbError) {
      // If table doesn't exist, try to create it using raw SQL
      console.log('Database tables may not exist, attempting to create them...')
      
      try {
        // Create basic users table if it doesn't exist
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "users" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "email" TEXT NOT NULL UNIQUE,
            "name" TEXT,
            "image" TEXT,
            "password" TEXT,
            "role" TEXT NOT NULL DEFAULT 'VISITOR',
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `
        console.log('Users table created successfully')
      } catch (createError) {
        console.error('Failed to create users table:', createError)
      }
    }

    // Check if user already exists
    let existingUser
    try {
      existingUser = await prisma.user.findUnique({
        where: { email }
      })
    } catch (err) {
      console.log('User lookup failed, continuing with creation...')
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate a simple ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Try to create user
    let user
    try {
      user = await prisma.user.create({
        data: {
          id: userId,
          email,
          name: name || null,
          password: hashedPassword,
          role: 'CONTRIBUTOR'
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      })
    } catch (createUserError) {
      // If Prisma create fails, try raw SQL
      console.log('Prisma create failed, trying raw SQL...')
      
      await prisma.$executeRaw`
        INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
        VALUES (${userId}, ${email}, ${name || null}, ${hashedPassword}, 'CONTRIBUTOR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `
      
      user = {
        id: userId,
        email,
        name: name || null,
        role: 'CONTRIBUTOR',
        createdAt: new Date()
      }
    }

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}