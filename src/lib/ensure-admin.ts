import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

async function createOrUpdateAdminUser() {
    try {
        const adminEmail = "admin@greenenergy.com"
        const adminPassword = "admin123"
        const hashedPassword = await bcrypt.hash(adminPassword, 12)

        console.log("Checking if admin user exists...")

        // First, check if user exists
        const existingUser = await db.user.findUnique({
            where: { email: adminEmail }
        })

        if (existingUser) {
            console.log("Admin user already exists:", {
                id: existingUser.id,
                email: existingUser.email,
                role: existingUser.role,
                isActive: existingUser.isActive
            })

            // Update the password to make sure it's correct
            const updatedUser = await db.user.update({
                where: { email: adminEmail },
                data: {
                    password: hashedPassword,
                    isActive: true,
                    role: "SUPER_ADMIN"
                }
            })

            console.log("Admin user updated successfully")
            return updatedUser
        }

        // Create new admin user
        const adminUser = await db.user.create({
            data: {
                email: adminEmail,
                name: "Admin User",
                password: hashedPassword,
                role: "SUPER_ADMIN",
                phone: "+91 98765 43210",
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
            role: adminUser.role
        })

        return adminUser
    } catch (error) {
        console.error("Error managing admin user:", error)
        throw error
    }
}

createOrUpdateAdminUser()
    .then(() => {
        console.log("Admin user management completed")
        process.exit(0)
    })
    .catch((error) => {
        console.error("Admin user management failed:", error)
        process.exit(1)
    })