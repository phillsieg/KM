import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Testing database connection...')

    // Test 1: Simple connection
    await prisma.$connect()
    console.log('Database connected')

    // Test 2: Check if users table exists and get count
    let userCount = 0
    try {
      userCount = await prisma.user.count()
      console.log('User count:', userCount)
    } catch (userError) {
      console.log('User table error:', userError)
      return NextResponse.json({
        status: 'partial',
        message: 'Connected but user table has issues',
        error: userError instanceof Error ? userError.message : 'Unknown error'
      })
    }

    // Test 3: Check if content table exists and get count
    let contentCount = 0
    try {
      contentCount = await prisma.content.count()
      console.log('Content count:', contentCount)
    } catch (contentError) {
      console.log('Content table error:', contentError)
      return NextResponse.json({
        status: 'partial',
        message: 'Connected but content table has issues',
        error: contentError instanceof Error ? contentError.message : 'Unknown error'
      })
    }

    // Test 4: Check domains
    let domainCount = 0
    try {
      domainCount = await prisma.domain.count()
      console.log('Domain count:', domainCount)
    } catch (domainError) {
      console.log('Domain table error:', domainError)
      return NextResponse.json({
        status: 'partial',
        message: 'Connected but domain table has issues',
        error: domainError instanceof Error ? domainError.message : 'Unknown error'
      })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database connection and tables working',
      counts: {
        users: userCount,
        content: contentCount,
        domains: domainCount
      }
    })

  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}