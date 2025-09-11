import { NextResponse } from 'next/server'

export async function GET() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ]
  
  const optionalEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
  ]
  
  const missing = requiredEnvVars.filter(env => !process.env[env])
  const optional = optionalEnvVars.filter(env => !process.env[env])
  
  return NextResponse.json({
    status: missing.length === 0 ? 'ready' : 'needs_config',
    required: {
      configured: requiredEnvVars.filter(env => !!process.env[env]),
      missing: missing
    },
    optional: {
      configured: optionalEnvVars.filter(env => !!process.env[env]),
      missing: optional
    },
    nextSteps: missing.length > 0 ? [
      'Add missing environment variables in Vercel Project Settings',
      'NEXTAUTH_SECRET: Generate with `openssl rand -base64 32`',
      'NEXTAUTH_URL: Your Vercel deployment URL'
    ] : [
      'Environment configured! Call /api/init-db to initialize database'
    ]
  })
}