import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/server-auth'
import { prisma } from '@/lib/prisma'
import { ContentType, Sensitivity, LifecycleState } from '@prisma/client'
import type { Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    console.log('=== API /content POST Debug ===')
    console.log('Authorization header:', request.headers.get('authorization'))
    console.log('All headers:', Object.fromEntries(request.headers.entries()))

    const authUser = await getAuthUser(request)
    console.log('Auth user result:', authUser)

    if (!authUser?.email) {
      console.log('No auth user found, returning 401')
      return NextResponse.json({ error: 'Unauthorized - Please log in first' }, { status: 401 })
    }

    console.log('Authenticated user:', authUser.email)

    // Try to find user, create if doesn't exist
    let user = await prisma.user.findUnique({
      where: { email: authUser.email }
    })

    if (!user) {
      console.log('User not found, creating new user:', authUser.email)
      user = await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email,
          name: authUser.name || null,
          image: authUser.image || null,
          role: authUser.email === 'admin@metrics-llc.com' ? 'ADMIN' : 'CONTRIBUTOR'
        }
      })
    }

    const body = await request.json()
    const { 
      title, 
      summary, 
      content: bodyContent, 
      contentType, 
      domainId, 
      sensitivity,
      reviewCycle,
      effectiveDate 
    } = body

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Create content
    const newContent = await prisma.content.create({
      data: {
        title,
        summary,
        body: bodyContent,
        slug,
        contentType: contentType as ContentType,
        domainId,
        ownerId: user.id,
        authorId: user.id,
        sensitivity: sensitivity as Sensitivity || 'INTERNAL',
        reviewCycle: reviewCycle || 12,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
        lifecycleState: 'DRAFT',
      },
      include: {
        domain: true,
        owner: true,
        author: true
      }
    })

    return NextResponse.json(newContent, { status: 201 })
  } catch (error) {
    console.error('Error creating content:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('relation') || error.message.includes('table')) {
        return NextResponse.json({ 
          error: 'Database not properly initialized. Please contact administrator to set up the database tables.' 
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    const { searchParams } = new URL(request.url)
    const domainId = searchParams.get('domain')
    const contentType = searchParams.get('type')
    const status = searchParams.get('status')
    const publicOnly = searchParams.get('public') === 'true'

    // Build where clause
    const where: Prisma.ContentWhereInput = {}
    if (domainId) where.domainId = domainId
    if (contentType) where.contentType = contentType.toUpperCase() as ContentType
    if (status) where.lifecycleState = status.toUpperCase() as LifecycleState

    // If not authenticated, only show published content
    if (!authUser?.email || publicOnly) {
      where.lifecycleState = 'PUBLISHED'
      where.sensitivity = {
        in: ['PUBLIC', 'INTERNAL']
      }
    }

    let content
    try {
      content = await prisma.content.findMany({
        where,
        include: {
          domain: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          _count: {
            select: {
              versions: true,
              comments: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })
    } catch (dbError) {
      console.log('Database query failed, likely tables don\'t exist yet:', dbError)
      // Return empty array if database/tables don't exist yet
      return NextResponse.json([])
    }

    return NextResponse.json(content || [])
  } catch (error) {
    console.error('Error fetching content:', error)

    // Return more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('relation') || error.message.includes('table') || error.message.includes('does not exist')) {
        console.log('Database tables not found, returning empty content array')
        return NextResponse.json([])
      }

      if (error.message.includes('connection') || error.message.includes('connect')) {
        return NextResponse.json({
          error: 'Database connection failed. Please try again later.'
        }, { status: 503 })
      }
    }

    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}