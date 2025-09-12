import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('Starting database initialization...')
    
    // First ensure we can connect
    await prisma.$connect()
    console.log('Database connected successfully')

    // Create basic tables if they don't exist
    try {
      // Create users table
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
      console.log('✅ Users table ready')

      // Create accounts table for OAuth
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "accounts" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "provider" TEXT NOT NULL,
          "providerAccountId" TEXT NOT NULL,
          "refresh_token" TEXT,
          "access_token" TEXT,
          "expires_at" INTEGER,
          "token_type" TEXT,
          "scope" TEXT,
          "id_token" TEXT,
          "session_state" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE ("provider", "providerAccountId")
        );
      `
      console.log('✅ Accounts table ready')

      // Create sessions table
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "sessions" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "sessionToken" TEXT NOT NULL UNIQUE,
          "userId" TEXT NOT NULL,
          "expires" TIMESTAMP(3) NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `
      console.log('✅ Sessions table ready')

      // Create domains table
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "domains" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "slug" TEXT NOT NULL UNIQUE,
          "color" TEXT DEFAULT '#3B82F6',
          "icon" TEXT,
          "parentId" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `
      console.log('✅ Domains table ready')

      // Create content table
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "content" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "summary" TEXT,
          "body" TEXT NOT NULL,
          "contentType" TEXT NOT NULL DEFAULT 'SOP',
          "lifecycleState" TEXT NOT NULL DEFAULT 'DRAFT',
          "sensitivity" TEXT NOT NULL DEFAULT 'INTERNAL',
          "version" TEXT NOT NULL DEFAULT '1.0',
          "reviewCycle" INTEGER DEFAULT 12,
          "effectiveDate" TIMESTAMP(3),
          "domainId" TEXT NOT NULL,
          "authorId" TEXT NOT NULL,
          "ownerId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "publishedAt" TIMESTAMP(3),
          "lastReviewedAt" TIMESTAMP(3),
          "nextReviewDate" TIMESTAMP(3)
        );
      `
      console.log('✅ Content table ready')

      // Insert default domains if none exist
      const domainCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM domains
      `
      
      if (Number(domainCount[0].count) === 0) {
        await prisma.$executeRaw`
          INSERT INTO domains (id, name, description, slug, color, icon) VALUES 
          ('domain_1', 'Compliance', 'Regulatory compliance and legal requirements', 'compliance', '#EF4444', 'shield-check'),
          ('domain_2', 'Engineering', 'Technical documentation and best practices', 'engineering', '#3B82F6', 'cog'),
          ('domain_3', 'Operations', 'Operational procedures and workflows', 'operations', '#10B981', 'clipboard-list'),
          ('domain_4', 'Human Resources', 'HR policies and employee resources', 'human-resources', '#8B5CF6', 'users'),
          ('domain_5', 'Finance', 'Financial procedures and policies', 'finance', '#F59E0B', 'banknotes')
        `
        console.log('✅ Default domains inserted')
      }

      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully',
        details: {
          connected: true,
          tablesCreated: ['users', 'accounts', 'sessions', 'domains', 'content'],
          defaultDomainsInserted: Number(domainCount[0].count) === 0
        }
      })

    } catch (tableError) {
      console.error('Table creation error:', tableError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create tables',
        details: tableError instanceof Error ? tableError.message : 'Unknown table error'
      }, { status: 500 })
    }

  } catch (connectionError) {
    console.error('Database connection error:', connectionError)
    return NextResponse.json({
      success: false,
      error: 'Failed to connect to database',
      details: connectionError instanceof Error ? connectionError.message : 'Unknown connection error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}