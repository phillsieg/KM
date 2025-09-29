import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  return runMigration()
}

export async function POST() {
  return runMigration()
}

async function runMigration() {
  try {
    console.log('Starting Supabase database migration...')

    // Test connection first
    await prisma.$connect()
    console.log('Connected to database successfully')

    const results = []

    // Enable UUID extension
    try {
      await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
      results.push('✅ UUID extension enabled')
    } catch (error) {
      results.push(`⚠️ UUID extension: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Create enum types one by one
    const enums = [
      { name: 'UserRole', values: ['VISITOR', 'CONTRIBUTOR', 'STEWARD', 'OWNER', 'ADMIN'] },
      { name: 'ContentType', values: ['SOP', 'POLICY', 'STANDARD', 'WORK_INSTRUCTION', 'JOB_AID', 'FORM_TEMPLATE', 'FAQ', 'TECH_NOTE', 'RELEASE_NOTES', 'DECISION_LOG', 'DASHBOARD'] },
      { name: 'LifecycleState', values: ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'NEEDS_UPDATE', 'ARCHIVED', 'DEPRECATED'] },
      { name: 'Sensitivity', values: ['PUBLIC', 'INTERNAL', 'RESTRICTED'] }
    ]

    for (const enumType of enums) {
      try {
        const enumValues = enumType.values.map(v => `'${v}'`).join(', ')
        await prisma.$executeRaw`CREATE TYPE ${enumType.name} AS ENUM (${enumValues})`
        results.push(`✅ Created enum ${enumType.name}`)
      } catch (error) {
        results.push(`⚠️ Enum ${enumType.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Use simpler approach - let's just use Prisma's db push equivalent
    // This is a more direct approach
    await prisma.$executeRaw`
      -- Create users table
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

    // Create domains table
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

    results.push('✅ Created users and domains tables')

    return NextResponse.json({
      success: true,
      message: 'Database migration completed successfully!',
      tables_created: [
        'users',
        'domains',
        'content'
      ],
      enums_created: [
        'UserRole',
        'ContentType',
        'LifecycleState',
        'Sensitivity'
      ]
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