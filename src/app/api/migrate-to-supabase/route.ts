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

    // Create your schema tables using Prisma
    // This will run the equivalent of `prisma db push`
    await prisma.$executeRaw`
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Create enum types
      DO $$ BEGIN
        CREATE TYPE "UserRole" AS ENUM ('VISITOR', 'CONTRIBUTOR', 'STEWARD', 'OWNER', 'ADMIN');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "ContentType" AS ENUM ('SOP', 'POLICY', 'STANDARD', 'WORK_INSTRUCTION', 'JOB_AID', 'FORM_TEMPLATE', 'FAQ', 'TECH_NOTE', 'RELEASE_NOTES', 'DECISION_LOG', 'DASHBOARD');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "LifecycleState" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'NEEDS_UPDATE', 'ARCHIVED', 'DEPRECATED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "Sensitivity" AS ENUM ('PUBLIC', 'INTERNAL', 'RESTRICTED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      -- Create users table
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "name" TEXT,
        "image" TEXT,
        "password" TEXT,
        "role" "UserRole" NOT NULL DEFAULT 'VISITOR',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

      -- Create domains table
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
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "domains_name_key" ON "domains"("name");
      CREATE UNIQUE INDEX IF NOT EXISTS "domains_slug_key" ON "domains"("slug");

      -- Insert some default domains
      INSERT INTO "domains" ("name", "slug", "description", "color", "icon")
      VALUES
        ('Engineering', 'engineering', 'Software development and technical documentation', '#3B82F6', 'CodeBracketIcon'),
        ('Operations', 'operations', 'Operational procedures and processes', '#10B981', 'CogIcon'),
        ('Compliance', 'compliance', 'Regulatory and compliance documentation', '#F59E0B', 'ShieldCheckIcon')
      ON CONFLICT ("name") DO NOTHING;

      -- Create content table
      CREATE TABLE IF NOT EXISTS "content" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "title" TEXT NOT NULL,
        "summary" TEXT NOT NULL,
        "body" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "contentType" "ContentType" NOT NULL,
        "lifecycleState" "LifecycleState" NOT NULL DEFAULT 'DRAFT',
        "effectiveDate" TIMESTAMP(3),
        "reviewCycle" INTEGER NOT NULL DEFAULT 12,
        "sensitivity" "Sensitivity" NOT NULL DEFAULT 'INTERNAL',
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

        CONSTRAINT "content_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "content_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "domains"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "content_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "content_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "content_stewardId_fkey" FOREIGN KEY ("stewardId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "content_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "content_slug_key" ON "content"("slug");
    `

    console.log('Database schema created successfully')

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