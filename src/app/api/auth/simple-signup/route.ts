import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

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

    console.log('Starting user creation process...')

    // Check if user exists using raw SQL for reliability
    let existingUser
    try {
      const users = await prisma.$queryRaw<Array<{ id: string, email: string }>>`
        SELECT id, email FROM users WHERE email = ${email} LIMIT 1
      `
      existingUser = users[0]
    } catch (queryError) {
      console.log('User query failed, assuming table needs setup')
      
      // Try to ensure users table exists
      try {
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "users" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "email" TEXT NOT NULL UNIQUE,
            "name" TEXT,
            "image" TEXT,
            "password" TEXT,
            "role" TEXT NOT NULL DEFAULT 'CONTRIBUTOR',
            "emailVerified" TIMESTAMP(3),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `
        console.log('Users table created')
      } catch (createError) {
        console.error('Failed to create users table:', createError)
        return NextResponse.json(
          { error: 'Database setup failed', details: createError instanceof Error ? createError.message : 'Unknown error' },
          { status: 500 }
        )
      }
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate simple ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Insert user using raw SQL for maximum reliability
    try {
      await prisma.$executeRaw`
        INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
        VALUES (${userId}, ${email}, ${name || null}, ${hashedPassword}, 'CONTRIBUTOR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `
      
      console.log('User created successfully with raw SQL')

      return NextResponse.json({
        message: 'User created successfully',
        user: {
          id: userId,
          email,
          name: name || null,
          role: 'CONTRIBUTOR'
        }
      }, { status: 201 })

    } catch (insertError) {
      console.error('Failed to insert user:', insertError)
      return NextResponse.json(
        { 
          error: 'Failed to create user',
          details: insertError instanceof Error ? insertError.message : 'Unknown insert error'
        },
        { status: 500 }
      )
    }

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

export async function GET() {
  return NextResponse.json({
    message: 'Simple signup endpoint - POST to create user',
    usersCount: users.length,
    users: users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role }))
  })
}