import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Initializing database tables...')
    
    // Create users table with raw SQL
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
    
    // Create domains table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "domains" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "slug" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "color" TEXT,
        "icon" TEXT,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Add sample domains
    await prisma.$executeRaw`
      INSERT INTO domains (id, name, slug, description, color, icon)
      VALUES 
        ('engineering', 'Engineering', 'engineering', 'Technical documentation, SOPs, and standards', '#3B82F6', 'code'),
        ('operations', 'Operations', 'operations', 'Operational procedures and guidelines', '#10B981', 'cog'),
        ('compliance', 'Compliance', 'compliance', 'Regulatory and compliance documentation', '#EF4444', 'shield')
      ON CONFLICT (id) DO NOTHING;
    `

    // Test that everything works
    const userCount = await prisma.$queryRaw<{count: bigint}[]>`SELECT COUNT(*) as count FROM users`
    const domainCount = await prisma.$queryRaw<{count: bigint}[]>`SELECT COUNT(*) as count FROM domains`
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully!',
      users: Number(userCount[0].count),
      domains: Number(domainCount[0].count),
      status: 'Database is ready for real accounts'
    })
    
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to initialize database'
    }, { status: 500 })
  }
}