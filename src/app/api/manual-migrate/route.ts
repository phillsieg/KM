import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Starting manual database migration...')
    await prisma.$connect()

    const results = []

    // Create users table (simplified - no enums)
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "name" TEXT,
          "image" TEXT,
          "password" TEXT,
          "role" TEXT NOT NULL DEFAULT 'VISITOR',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "users_pkey" PRIMARY KEY ("id")
        )
      `
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")`
      results.push('✅ Created users table')
    } catch (error) {
      results.push(`❌ Users table: ${error}`)
    }

    // Create domains table
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "domains" (
          "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
          "name" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "description" TEXT,
          "color" TEXT,
          "icon" TEXT,
          "active" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
        )
      `
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "domains_name_key" ON "domains"("name")`
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "domains_slug_key" ON "domains"("slug")`
      results.push('✅ Created domains table')
    } catch (error) {
      results.push(`❌ Domains table: ${error}`)
    }

    // Insert default domains
    try {
      await prisma.$executeRaw`
        INSERT INTO "domains" ("name", "slug", "description", "color", "icon")
        VALUES
          ('Engineering', 'engineering', 'Software development and technical documentation', '#3B82F6', 'CodeBracketIcon'),
          ('Operations', 'operations', 'Operational procedures and processes', '#10B981', 'CogIcon'),
          ('Compliance', 'compliance', 'Regulatory and compliance documentation', '#F59E0B', 'ShieldCheckIcon')
        ON CONFLICT ("name") DO NOTHING
      `
      results.push('✅ Inserted default domains')
    } catch (error) {
      results.push(`⚠️ Default domains: ${error}`)
    }

    // Create content table (simplified)
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "content" (
          "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
          "title" TEXT NOT NULL,
          "summary" TEXT NOT NULL,
          "body" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "contentType" TEXT NOT NULL DEFAULT 'SOP',
          "lifecycleState" TEXT NOT NULL DEFAULT 'DRAFT',
          "effectiveDate" TIMESTAMP(3),
          "reviewCycle" INTEGER NOT NULL DEFAULT 12,
          "sensitivity" TEXT NOT NULL DEFAULT 'INTERNAL',
          "domainId" TEXT NOT NULL,
          "ownerId" TEXT NOT NULL,
          "authorId" TEXT NOT NULL,
          "stewardId" TEXT,
          "approvedById" TEXT,
          "approvedAt" TIMESTAMP(3),
          "linkedRegulations" JSONB,
          "decisionRationale" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "publishedAt" TIMESTAMP(3),
          "lastReviewedAt" TIMESTAMP(3),
          "nextReviewDate" TIMESTAMP(3),
          "deprecatedAt" TIMESTAMP(3),
          CONSTRAINT "content_pkey" PRIMARY KEY ("id")
        )
      `
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "content_slug_key" ON "content"("slug")`
      results.push('✅ Created content table')
    } catch (error) {
      results.push(`❌ Content table: ${error}`)
    }

    console.log('Migration completed')

    return NextResponse.json({
      success: true,
      message: 'Manual migration completed!',
      results: results,
      tables_created: ['users', 'domains', 'content']
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}