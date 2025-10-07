import { db } from '../src/lib/db.js'
import bcrypt from 'bcryptjs'

async function seedAdmin() {
  try {
    console.log('🌱 Seeding admin user...')
    
    // Check if admin already exists
    const existingAdmin = await db.user.findFirst({
      where: {
        role: 'SUPER_ADMIN'
      }
    })
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', {
        email: existingAdmin.email,
        name: existingAdmin.name,
        role: existingAdmin.role
      })
      return existingAdmin
    }
    
    // Create admin user
    const adminEmail = "admin@greenenergy.com"
    const adminPassword = "admin123"
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    const adminUser = await db.user.create({
      data: {
        email: adminEmail,
        name: "Admin User",
        password: hashedPassword,
        role: "SUPER_ADMIN",
        phone: "+91 98765 43213",
        address: "123 Admin Street",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        zipCode: "400001",
        isActive: true,
      },
    })

    console.log('✅ Admin user created successfully:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    })
    
    return adminUser
  } catch (error) {
    console.error('❌ Error seeding admin:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAdmin()
}

export { seedAdmin }