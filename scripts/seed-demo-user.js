const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seedDemoUser() {
  try {
    console.log('Creating demo admin user...')

    // Hash password for demo user
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create or update demo admin user
    const demoUser = await prisma.user.upsert({
      where: { email: 'admin@metrics-llc.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN'
      },
      create: {
        email: 'admin@metrics-llc.com',
        name: 'Demo Admin',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('✅ Demo admin user created successfully!')
    console.log('Email: admin@metrics-llc.com')
    console.log('Password: admin123')
    console.log('Role: ADMIN')

  } catch (error) {
    console.error('❌ Error creating demo user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedDemoUser()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })