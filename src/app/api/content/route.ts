import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ContentType, Sensitivity } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const domainId = searchParams.get('domain')
    const contentType = searchParams.get('type')
    const status = searchParams.get('status')

    const where: Record<string, string> = {}
    if (domainId) where.domainId = domainId
    if (contentType) where.contentType = contentType.toUpperCase()
    if (status) where.lifecycleState = status.toUpperCase()

    const content = await prisma.content.findMany({
      where,
      include: {
        domain: true,
        owner: true,
        author: true,
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

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}