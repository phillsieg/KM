import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Import Prisma dynamically
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    console.log('Testing database connection...')
    
    // Test connection first
    await prisma.$executeRaw`SELECT 1`
    console.log('Database connection successful!')

    // Create tables using raw SQL based on our schema
    console.log('Creating database tables...')

    // Create enum types first
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "UserRole" AS ENUM ('VISITOR', 'CONTRIBUTOR', 'STEWARD', 'OWNER', 'ADMIN');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "ContentType" AS ENUM ('SOP', 'POLICY', 'STANDARD', 'WORK_INSTRUCTION', 'JOB_AID', 'FORM_TEMPLATE', 'FAQ', 'TECH_NOTE', 'RELEASE_NOTES', 'DECISION_LOG', 'DASHBOARD');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "LifecycleState" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'DEPRECATED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "Sensitivity" AS ENUM ('PUBLIC', 'INTERNAL', 'RESTRICTED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
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

    // Create users table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "name" TEXT,
        "image" TEXT,
        "role" "UserRole" NOT NULL DEFAULT 'VISITOR',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create basic tables for NextAuth
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "accounts" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "user_id" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "provider_account_id" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        UNIQUE("provider", "provider_account_id")
      );
    `

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "session_token" TEXT NOT NULL UNIQUE,
        "user_id" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL
      );
    `

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "verificationtokens" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL UNIQUE,
        "expires" TIMESTAMP(3) NOT NULL,
        UNIQUE("identifier", "token")
      );
    `

    console.log('Core tables created successfully!')

    // Add sample domains
    const existingDomains = await prisma.$queryRaw<{count: bigint}[]>`SELECT COUNT(*) as count FROM domains`
    const domainCount = Number(existingDomains[0].count)

    if (domainCount === 0) {
      console.log('Adding sample domains...')
      
      await prisma.$executeRaw`
        INSERT INTO domains (id, name, slug, description, color, icon) VALUES
        ('engineering', 'Engineering', 'engineering', 'Technical documentation, SOPs, and standards', '#3B82F6', 'code'),
        ('operations', 'Operations', 'operations', 'Operational procedures and guidelines', '#10B981', 'cog'),
        ('compliance', 'Compliance', 'compliance', 'Regulatory and compliance documentation', '#EF4444', 'shield'),
        ('sales', 'Sales', 'sales', 'Sales processes and customer resources', '#8B5CF6', 'chart'),
        ('marketing', 'Marketing', 'marketing', 'Marketing materials and brand guidelines', '#F59E0B', 'megaphone')
      `
      
      console.log('Sample domains added successfully!')
    }

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'Database schema created successfully!',
      domains: domainCount === 0 ? 5 : domainCount,
      status: 'ready'
    })

  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      tip: 'Raw SQL approach for schema creation'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    info: 'POST to this endpoint to create database schema using raw SQL',
    approach: 'Direct SQL execution instead of Prisma CLI'
  })
}