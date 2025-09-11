import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Push schema to database (equivalent to prisma db push)
    console.log('Initializing database schema...')
    
    // Create some sample domains if they don't exist
    const existingDomains = await prisma.domain.count()
    
    if (existingDomains === 0) {
      await prisma.domain.createMany({
        data: [
          {
            name: 'Engineering',
            slug: 'engineering',
            description: 'Technical documentation, SOPs, and standards',
            color: '#3B82F6',
            icon: 'code',
          },
          {
            name: 'Operations',
            slug: 'operations', 
            description: 'Operational procedures and guidelines',
            color: '#10B981',
            icon: 'cog',
          },
          {
            name: 'Compliance',
            slug: 'compliance',
            description: 'Regulatory and compliance documentation',
            color: '#EF4444',
            icon: 'shield',
          },
          {
            name: 'Sales',
            slug: 'sales',
            description: 'Sales processes and customer resources',
            color: '#8B5CF6',
            icon: 'chart',
          },
          {
            name: 'Marketing',
            slug: 'marketing',
            description: 'Marketing materials and brand guidelines',
            color: '#F59E0B',
            icon: 'megaphone',
          },
        ],
      })
      
      console.log('Sample domains created successfully')
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully',
      domains: await prisma.domain.count()
    })
    
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}