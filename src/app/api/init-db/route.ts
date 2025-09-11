import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Import prisma dynamically to avoid module loading issues
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    console.log('Testing database connection...')
    
    // Test basic connection
    await prisma.$executeRaw`SELECT 1`
    console.log('Database connection successful!')
    
    // Check if domains table exists and has data
    try {
      const existingDomains = await prisma.domain.count()
      console.log(`Found ${existingDomains} existing domains`)
      
      if (existingDomains === 0) {
        console.log('Creating sample domains...')
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
          ],
        })
        console.log('Sample domains created successfully')
      }
      
      const finalDomainCount = await prisma.domain.count()
      await prisma.$disconnect()
      
      return NextResponse.json({ 
        success: true, 
        message: 'Database initialized successfully',
        domains: finalDomainCount,
        status: existingDomains === 0 ? 'created_sample_data' : 'already_initialized'
      })
      
    } catch (tableError) {
      console.log('Tables may not exist yet, this is normal on first run')
      return NextResponse.json({ 
        success: true, 
        message: 'Database connected but schema not yet created. Run `npx prisma db push` to create tables.',
        error: tableError instanceof Error ? tableError.message : 'Schema setup needed'
      })
    }
    
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown database error',
      tip: 'Make sure DATABASE_URL is set correctly and database is accessible'
    }, { status: 500 })
  }
}

// Also support POST for manual triggering
export async function POST() {
  return GET()
}