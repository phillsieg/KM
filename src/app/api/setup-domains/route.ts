import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('Setting up domains...')
    
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
          }
        ],
        skipDuplicates: true
      })
      
      console.log('Created domains:', domains.count)
    }
    
    // Return all domains
    const allDomains = await prisma.domain.findMany({
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Domains setup complete',
      domains: allDomains,
      count: allDomains.length
    })
    
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