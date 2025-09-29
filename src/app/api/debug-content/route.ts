import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/server-auth'
import { prisma } from '@/lib/prisma'
import { ContentType, LifecycleState, Sensitivity } from '@prisma/client'

async function debugContentCreation(request: NextRequest) {
  try {
    console.log('=== DEBUG CONTENT CREATION ===')

    const authUser = await getAuthUser(request)
    console.log('Auth user:', authUser)

    if (!authUser?.email) {
      return NextResponse.json({ error: 'No auth user' }, { status: 401 })
    }

    // Check if user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { email: authUser.email }
    })
    console.log('Database user:', dbUser)

    // Check if domains exist
    const domains = await prisma.domain.findMany()
    console.log('Available domains:', domains)

    const body = await request.json()
    console.log('Request body:', body)

    // Try creating content with minimal data
    const testData = {
      title: 'Test Document',
      summary: 'Test summary',
      body: 'Test content',
      slug: 'test-doc-' + Date.now(),
      contentType: ContentType.SOP,
      domainId: domains[0]?.id || 'missing-domain',
      ownerId: dbUser?.id || 'missing-user',
      authorId: dbUser?.id || 'missing-user',
      sensitivity: Sensitivity.INTERNAL,
      reviewCycle: 12,
      lifecycleState: LifecycleState.DRAFT,
    }

    console.log('Test data to create:', testData)

    const newContent = await prisma.content.create({
      data: testData
    })

    console.log('Created content:', newContent)

    return NextResponse.json({
      success: true,
      authUser,
      dbUser,
      domains,
      requestBody: body,
      createdContent: newContent
    })

  } catch (error) {
    console.error('DEBUG ERROR:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return debugContentCreation(request)
}

export async function GET(request: NextRequest) {
  return debugContentCreation(request)
}