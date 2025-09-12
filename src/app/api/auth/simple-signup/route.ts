import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Simple in-memory storage for testing (in production, this would be a database)
const users: Array<{
  id: string
  email: string
  name: string | null
  password: string
  role: string
  createdAt: Date
}> = []

export async function POST(request: NextRequest) {
  try {
    console.log('Simple signup endpoint called')
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

    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const user = {
      id: userId,
      email,
      name: name || null,
      password: hashedPassword,
      role: 'CONTRIBUTOR',
      createdAt: new Date()
    }

    users.push(user)

    console.log(`User created successfully: ${email}`)

    return NextResponse.json(
      { 
        message: 'User created successfully (simple version)', 
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

  } catch (error) {
    console.error('Simple signup error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error in simple signup',
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