import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Fetching domains...')
    let domains = await prisma.domain.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    console.log('Found domains:', domains.length)

    // If no domains exist, create the default ones
    if (domains.length === 0) {
      console.log('No domains found, creating default domains...')
      
      await prisma.domain.createMany({
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
          }
        ],
        skipDuplicates: true
      })

      // Fetch again after creating
      domains = await prisma.domain.findMany({
        orderBy: {
          name: 'asc'
        }
      })
      console.log('Created and fetched domains:', domains.length)
    }

    return NextResponse.json(domains)
  } catch (error) {
    console.error('Error fetching domains:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}