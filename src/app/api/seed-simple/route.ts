import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ContentType } from '@prisma/client'

export async function POST() {
  try {
    console.log('Starting simple content seeding...')

    // First, ensure domains exist
    try {
      await prisma.domain.upsert({
        where: { id: 'engineering' },
        create: {
          id: 'engineering',
          name: 'Engineering',
          slug: 'engineering',
          description: 'Technical documentation, SOPs, and standards',
          color: '#3B82F6',
          icon: 'code'
        },
        update: {}
      })

      await prisma.domain.upsert({
        where: { id: 'operations' },
        create: {
          id: 'operations',
          name: 'Operations',
          slug: 'operations',
          description: 'Operational procedures and guidelines',
          color: '#10B981',
          icon: 'cog'
        },
        update: {}
      })

      await prisma.domain.upsert({
        where: { id: 'compliance' },
        create: {
          id: 'compliance',
          name: 'Compliance',
          slug: 'compliance',
          description: 'Regulatory and compliance documentation',
          color: '#EF4444',
          icon: 'shield'
        },
        update: {}
      })
    } catch (domainError) {
      console.log('Domain creation failed:', domainError)
      return NextResponse.json({
        error: 'Failed to create domains',
        details: domainError instanceof Error ? domainError.message : 'Unknown error'
      }, { status: 500 })
    }

    // Create a default user if none exists
    let user
    try {
      user = await prisma.user.findFirst()
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: 'admin@example.com',
            name: 'System Administrator',
            role: 'ADMIN'
          }
        })
      }
    } catch (userError) {
      console.log('User creation failed:', userError)
      return NextResponse.json({
        error: 'Failed to create user',
        details: userError instanceof Error ? userError.message : 'Unknown error'
      }, { status: 500 })
    }

    // Create simple test documents
    const testDocs = [
      {
        title: "API Development Standards",
        summary: "Guidelines for developing consistent and maintainable APIs.",
        body: "# API Development Standards\n\nThis document outlines the standards for API development.\n\n## REST Principles\n- Use nouns in URLs\n- Use proper HTTP methods\n- Return appropriate status codes\n\n## Authentication\n- Use JWT tokens\n- Implement rate limiting\n- Log all API access",
        contentType: "STANDARD",
        domainId: "engineering"
      },
      {
        title: "Incident Response Policy",
        summary: "Procedures for responding to and managing incidents.",
        body: "# Incident Response Policy\n\n## Purpose\nEstablish clear procedures for incident response.\n\n## Severity Levels\n- P0: Critical - Complete outage\n- P1: High - Major functionality unavailable\n- P2: Medium - Minor issues\n- P3: Low - Cosmetic issues\n\n## Response Team\n- Incident Commander\n- Technical Lead\n- Communications Lead",
        contentType: "POLICY",
        domainId: "operations"
      },
      {
        title: "Data Privacy Policy",
        summary: "Guidelines for data handling and privacy protection.",
        body: "# Data Privacy Policy\n\n## Purpose\nProtect personal data in compliance with privacy regulations.\n\n## Principles\n- Data minimization\n- Purpose limitation\n- Transparency\n\n## Data Subject Rights\n- Right to access\n- Right to rectification\n- Right to erasure\n- Right to portability",
        contentType: "POLICY",
        domainId: "compliance"
      }
    ]

    const results = []

    for (const doc of testDocs) {
      try {
        const slug = doc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

        const created = await prisma.content.create({
          data: {
            title: doc.title,
            summary: doc.summary,
            body: doc.body,
            slug,
            contentType: doc.contentType as ContentType,
            domainId: doc.domainId,
            ownerId: user.id,
            authorId: user.id,
            sensitivity: 'INTERNAL',
            lifecycleState: 'PUBLISHED',
            reviewCycle: 12,
            publishedAt: new Date(),
            nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
          }
        })

        results.push({
          title: doc.title,
          status: 'created',
          id: created.id
        })

      } catch (error) {
        results.push({
          title: doc.title,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      message: 'Simple content seeding completed',
      results,
      summary: {
        total: testDocs.length,
        created: results.filter(r => r.status === 'created').length,
        errors: results.filter(r => r.status === 'error').length
      }
    })

  } catch (error) {
    console.error('Error in simple seeding:', error)
    return NextResponse.json({
      error: 'Failed to seed content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}