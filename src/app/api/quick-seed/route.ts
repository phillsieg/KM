import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('Starting quick content seeding...')

    // Create a simple user without password (OAuth user)
    let user
    try {
      user = await prisma.user.findFirst()
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: 'admin@example.com',
            name: 'System Administrator',
            role: 'ADMIN'
            // No password field - OAuth user
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

    // Create one simple test document
    try {
      const slug = 'api-development-standards'

      const existing = await prisma.content.findUnique({
        where: { slug }
      })

      if (existing) {
        return NextResponse.json({
          message: 'Test document already exists',
          document: {
            title: existing.title,
            id: existing.id
          }
        })
      }

      const created = await prisma.content.create({
        data: {
          title: 'API Development Standards',
          summary: 'Guidelines for developing consistent and maintainable APIs.',
          body: '# API Development Standards\n\nThis document outlines the standards for API development.\n\n## REST Principles\n- Use nouns in URLs\n- Use proper HTTP methods\n- Return appropriate status codes\n\n## Authentication\n- Use JWT tokens\n- Implement rate limiting\n- Log all API access',
          slug: slug,
          contentType: 'STANDARD',
          domainId: 'engineering',
          ownerId: user.id,
          authorId: user.id,
          sensitivity: 'INTERNAL',
          lifecycleState: 'PUBLISHED',
          reviewCycle: 12,
          publishedAt: new Date(),
          nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      })

      return NextResponse.json({
        message: 'Quick seeding completed successfully',
        document: {
          title: created.title,
          id: created.id,
          domain: created.domainId
        }
      })

    } catch (contentError) {
      console.log('Content creation failed:', contentError)
      return NextResponse.json({
        error: 'Failed to create content',
        details: contentError instanceof Error ? contentError.message : 'Unknown error'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error in quick seeding:', error)
    return NextResponse.json({
      error: 'Failed to seed content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}