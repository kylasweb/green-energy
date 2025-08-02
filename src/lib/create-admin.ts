import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

async function createAdminUser() {
  try {
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

    console.log("Admin user created successfully:", {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    })

    return adminUser
  } catch (error) {
    console.error("Error creating admin user:", error)
    throw error
  }
}

// Export for use in other files
export { createAdminUser }

// Run if called directly
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log("Admin user creation completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Admin user creation failed:", error)
      process.exit(1)
    })
}