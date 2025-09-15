import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    console.log('Setting up domains...')

    const url = new URL(request.url)
    const seedContent = url.searchParams.get('seed') === 'true'

    // Check if domains exist
    const existingDomains = await prisma.domain.findMany()
    console.log('Existing domains count:', existingDomains.length)

    if (existingDomains.length === 0) {
      console.log('Creating default domains...')

      const domains = await prisma.domain.createMany({
        data: [
          {
            id: 'engineering',
            name: 'Engineering',
            slug: 'engineering',
            description: 'Technical documentation, SOPs, and standards',
            color: '#3B82F6',
            icon: 'code'
          },
          {
            id: 'operations',
            name: 'Operations',
            slug: 'operations',
            description: 'Operational procedures and guidelines',
            color: '#10B981',
            icon: 'cog'
          },
          {
            id: 'compliance',
            name: 'Compliance',
            slug: 'compliance',
            description: 'Regulatory and compliance documentation',
            color: '#EF4444',
            icon: 'shield'
          },
          {
            id: 'marketing',
            name: 'Marketing',
            slug: 'marketing',
            description: 'Marketing materials and brand guidelines',
            color: '#F59E0B',
            icon: 'megaphone'
          },
          {
            id: 'sales',
            name: 'Sales',
            slug: 'sales',
            description: 'Sales processes and customer resources',
            color: '#8B5CF6',
            icon: 'chart'
          }
        ],
        skipDuplicates: true
      })

      console.log('Created domains:', domains.count)
    }

    const contentResults: Array<{ title: string; status: string; id?: string; error?: string }> = []

    // If seed parameter is true, create sample content
    if (seedContent) {
      console.log('Seeding sample content...')

      // Find or create a user
      let user = await prisma.user.findFirst()
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: 'admin@example.com',
            name: 'System Administrator',
            role: 'ADMIN'
          }
        })
      }

      // Create sample documents
      const sampleDocs = [
        {
          title: 'API Development Standards',
          summary: 'Guidelines for developing consistent and maintainable APIs.',
          body: '# API Development Standards\n\nThis document outlines the standards for API development.\n\n## REST Principles\n- Use nouns in URLs\n- Use proper HTTP methods\n- Return appropriate status codes\n\n## Authentication\n- Use JWT tokens\n- Implement rate limiting\n- Log all API access',
          slug: 'api-development-standards',
          contentType: 'STANDARD' as const,
          domainId: 'engineering'
        },
        {
          title: 'Incident Response Policy',
          summary: 'Procedures for responding to and managing incidents.',
          body: '# Incident Response Policy\n\n## Purpose\nEstablish clear procedures for incident response.\n\n## Severity Levels\n- P0: Critical - Complete outage\n- P1: High - Major functionality unavailable\n- P2: Medium - Minor issues\n- P3: Low - Cosmetic issues\n\n## Response Team\n- Incident Commander\n- Technical Lead\n- Communications Lead',
          slug: 'incident-response-policy',
          contentType: 'POLICY' as const,
          domainId: 'operations'
        },
        {
          title: 'Data Privacy Policy',
          summary: 'Guidelines for data handling and privacy protection.',
          body: '# Data Privacy Policy\n\n## Purpose\nProtect personal data in compliance with privacy regulations.\n\n## Principles\n- Data minimization\n- Purpose limitation\n- Transparency\n\n## Data Subject Rights\n- Right to access\n- Right to rectification\n- Right to erasure\n- Right to portability',
          slug: 'data-privacy-policy',
          contentType: 'POLICY' as const,
          domainId: 'compliance'
        }
      ]

      for (const doc of sampleDocs) {
        try {
          // Check if document already exists
          const existing = await prisma.content.findUnique({
            where: { slug: doc.slug }
          })

          if (!existing) {
            const created = await prisma.content.create({
              data: {
                ...doc,
                ownerId: user.id,
                authorId: user.id,
                sensitivity: 'INTERNAL',
                lifecycleState: 'PUBLISHED',
                reviewCycle: 12,
                publishedAt: new Date(),
                nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              }
            })
            contentResults.push({ title: doc.title, status: 'created', id: created.id })
          } else {
            contentResults.push({ title: doc.title, status: 'already exists', id: existing.id })
          }
        } catch (contentError) {
          contentResults.push({
            title: doc.title,
            status: 'error',
            error: contentError instanceof Error ? contentError.message : 'Unknown error'
          })
        }
      }
    }

    // Return all domains
    const allDomains = await prisma.domain.findMany({
      orderBy: { name: 'asc' }
    })

    const response: {
      success: boolean
      message: string
      domains: Array<{
        id: string
        name: string
        slug: string
        description: string | null
        color: string | null
        icon: string | null
        createdAt: Date
        updatedAt: Date
      }>
      count: number
      contentSeeded?: Array<{ title: string; status: string; id?: string; error?: string }>
    } = {
      success: true,
      message: 'Domains setup complete',
      domains: allDomains,
      count: allDomains.length
    }

    if (seedContent) {
      response.contentSeeded = contentResults
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error setting up domains:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to setup domains'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const domains = await prisma.domain.findMany({
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json({
      domains,
      count: domains.length,
      message: 'Current domains in database'
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}