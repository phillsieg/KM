import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET() {
  try {
    console.log('Running Prisma db push...')

    // Run prisma db push to create all tables
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss')

    console.log('Prisma output:', stdout)
    if (stderr) console.log('Prisma stderr:', stderr)

    return NextResponse.json({
      success: true,
      message: 'Database schema pushed successfully!',
      output: stdout,
      errors: stderr || null
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}