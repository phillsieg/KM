import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST() {
  try {
    console.log('Starting database schema migration...')
    
    // Run prisma generate and db push
    const { stdout, stderr } = await execAsync('npx prisma generate && npx prisma db push --accept-data-loss')
    
    console.log('Migration output:', stdout)
    if (stderr) {
      console.error('Migration warnings/errors:', stderr)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database schema created successfully',
      output: stdout,
      warnings: stderr || null
    })
    
  } catch (error) {
    console.error('Migration failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Migration failed',
      tip: 'This API creates the database schema. If this fails, the database may not be accessible.'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    info: 'POST to this endpoint to run database migrations',
    commands: [
      'npx prisma generate',
      'npx prisma db push --accept-data-loss'
    ]
  })
}