import { db } from "@/lib/db"
import { createAdminUser } from "@/lib/create-admin"
import bcrypt from "bcryptjs"

interface SeedData {
    categories: Array<{
        name: string
        slug: string
        description: string
        image?: string
    }>
    brands: Array<{
        name: string
        slug: string
        description?: string
        logo?: string
    }>
    products: Array<{
        name: string
        slug: string
        description: string
        shortDesc: string
        price: number
        mrp: number
        images: string[]
        categorySlug: string
        brandSlug: string
        stockQuantity: number
        sku: string
        specifications?: any
        features?: string[]
        dimensions?: any
        weight?: number
        isActive: boolean
        isFeatured: boolean
    }>
}

const seedData: SeedData = {
    categories: [
        {
            name: "Batteries",
            slug: "batteries",
            description: "High-quality automotive and inverter batteries for reliable power solutions",
            image: "/placeholder-product.jpg"
        },
        {
            name: "Inverters",
            slug: "inverters",
            description: "Power inverters for home and commercial use during power outages",
            image: "/placeholder-product.jpg"
        },
        {
            name: "Solar Panels",
            slug: "solar-panels",
            description: "Eco-friendly solar panels for sustainable energy generation",
            image: "/placeholder-product.jpg"
        },
        {
            name: "UPS Systems",
            slug: "ups-systems",
            description: "Uninterruptible Power Supply systems for continuous power backup",
            image: "/placeholder-product.jpg"
        },
        {
            name: "Generators",
            slug: "generators",
            description: "Reliable power generators for backup electricity needs",
            image: "/placeholder-product.jpg"
        }
    ],
    brands: [
        {
            name: "Amaron",
            slug: "amaron",
            description: "Leading manufacturer of maintenance-free automotive batteries",
            logo: "/placeholder-product.svg"
        },
        {
            name: "Luminous",
            slug: "luminous",
            description: "Pioneer in power backup solutions and home electrical products",
            logo: "/placeholder-product.svg"
        },
        {
            name: "Exide",
            slug: "exide",
            description: "Trusted name in automotive and industrial battery solutions",
            logo: "/placeholder-product.svg"
        },
        {
            name: "Tata Green Batteries",
            slug: "tata-green",
            description: "Sustainable and eco-friendly battery solutions",
            logo: "/placeholder-product.svg"
        },
        {
            name: "Microtek",
            slug: "microtek",
            description: "Advanced UPS and power management solutions",
            logo: "/placeholder-product.svg"
        }
    ],
    products: [
        // Amaron Batteries
        {
            name: "Amaron Hi-Life Pro 850",
            slug: "amaron-hi-life-pro-850",
            description: "Premium maintenance-free automotive battery with advanced technology for superior performance and longer life. Features high cranking power, vibration resistance, and leak-proof design.",
            shortDesc: "Premium automotive battery with 42-month warranty",
            price: 8500,
            mrp: 9500,
            images: ["/placeholder-product.jpg"],
            categorySlug: "batteries",
            brandSlug: "amaron",
            stockQuantity: 45,
            sku: "AMR-850-PRO",
            specifications: {
                capacity: "85Ah",
                voltage: "12V",
                warranty: "42 months",
                dimensions: "315x175x190mm"
            },
            features: ["Maintenance-free", "High cranking power", "Vibration resistant", "Leak-proof"],
            dimensions: { length: 315, width: 175, height: 190, unit: "mm" },
            weight: 24.5,
            isActive: true,
            isFeatured: true
        },
        {
            name: "Amaron Fresh FR500",
            slug: "amaron-fresh-fr500",
            description: "Reliable inverter battery designed for home power backup solutions. Long-lasting performance with minimal maintenance requirements.",
            shortDesc: "Tubular inverter battery for home backup",
            price: 12000,
            mrp: 13500,
            images: ["/placeholder-product.jpg"],
            categorySlug: "batteries",
            brandSlug: "amaron",
            stockQuantity: 32,
            sku: "AMR-FR500",
            specifications: {
                capacity: "150Ah",
                voltage: "12V",
                type: "Tubular",
                warranty: "36 months"
            },
            features: ["Long backup time", "Low maintenance", "Deep discharge recovery"],
            weight: 52.0,
            isActive: true,
            isFeatured: false
        },

        // Luminous Products
        {
            name: "Luminous Zelio+ 1100 Inverter",
            slug: "luminous-zelio-1100",
            description: "Advanced sine wave inverter with intelligent battery management and LED display. Perfect for homes and small offices with multiple appliances.",
            shortDesc: "Pure sine wave inverter with digital display",
            price: 15500,
            mrp: 17000,
            images: ["/placeholder-product.jpg"],
            categorySlug: "inverters",
            brandSlug: "luminous",
            stockQuantity: 28,
            sku: "LUM-ZELIO-1100",
            specifications: {
                capacity: "1100VA/12V",
                waveform: "Pure Sine Wave",
                efficiency: "85%",
                warranty: "24 months"
            },
            features: ["Digital display", "Intelligent battery management", "Short circuit protection"],
            weight: 12.8,
            isActive: true,
            isFeatured: true
        },
        {
            name: "Luminous Red Charge RC18000ST",
            slug: "luminous-red-charge-rc18000st",
            description: "High-capacity tubular battery with superior charge acceptance and longer life cycle. Ideal for heavy-duty applications.",
            shortDesc: "Tall tubular battery for extended backup",
            price: 18500,
            mrp: 20000,
            images: ["/placeholder-product.jpg"],
            categorySlug: "batteries",
            brandSlug: "luminous",
            stockQuantity: 22,
            sku: "LUM-RC18000ST",
            specifications: {
                capacity: "180Ah",
                voltage: "12V",
                type: "Tall Tubular",
                warranty: "48 months"
            },
            features: ["High charge acceptance", "Long life cycle", "Deep discharge recovery"],
            weight: 62.5,
            isActive: true,
            isFeatured: true
        },

        // Exide Products
        {
            name: "Exide EPZS 1500",
            slug: "exide-epzs-1500",
            description: "Industrial grade deep cycle battery designed for renewable energy applications and power backup systems.",
            shortDesc: "Industrial deep cycle battery for solar applications",
            price: 22000,
            mrp: 24500,
            images: ["/placeholder-product.jpg"],
            categorySlug: "batteries",
            brandSlug: "exide",
            stockQuantity: 15,
            sku: "EXD-EPZS-1500",
            specifications: {
                capacity: "150Ah",
                voltage: "12V",
                type: "Deep Cycle",
                cycles: "1500+ cycles"
            },
            features: ["Deep cycle design", "Solar compatible", "Long service life"],
            weight: 58.2,
            isActive: true,
            isFeatured: false
        },

        // Solar Panels
        {
            name: "Tata Solar Panel 540W Mono",
            slug: "tata-solar-540w-mono",
            description: "High-efficiency monocrystalline solar panel with superior performance and durability. Perfect for residential and commercial installations.",
            shortDesc: "540W monocrystalline solar panel",
            price: 18500,
            mrp: 20000,
            images: ["/placeholder-product.jpg"],
            categorySlug: "solar-panels",
            brandSlug: "tata-green",
            stockQuantity: 40,
            sku: "TATA-SOLAR-540W",
            specifications: {
                power: "540W",
                efficiency: "21.2%",
                voltage: "49.5V",
                current: "10.91A",
                warranty: "25 years"
            },
            features: ["High efficiency", "Weather resistant", "25-year warranty"],
            dimensions: { length: 2278, width: 1134, height: 35, unit: "mm" },
            weight: 28.5,
            isActive: true,
            isFeatured: true
        },

        // UPS Systems
        {
            name: "Microtek UPS EB 1700VA",
            slug: "microtek-ups-eb-1700va",
            description: "Online UPS with advanced microprocessor control and pure sine wave output. Ideal for sensitive electronic equipment.",
            shortDesc: "Online UPS with pure sine wave output",
            price: 25500,
            mrp: 28000,
            images: ["/placeholder-product.jpg"],
            categorySlug: "ups-systems",
            brandSlug: "microtek",
            stockQuantity: 18,
            sku: "MTK-UPS-EB1700",
            specifications: {
                capacity: "1700VA/1360W",
                technology: "Online Double Conversion",
                waveform: "Pure Sine Wave",
                efficiency: "90%"
            },
            features: ["Online technology", "LCD display", "Intelligent battery management"],
            weight: 22.0,
            isActive: true,
            isFeatured: false
        }
    ]
}

export async function seedDatabase() {
    try {
        console.log("🌱 Starting database seeding...")

        // Create admin user first
        console.log("👤 Creating admin user...")
        const adminEmail = "admin@greenenergy.com"
        const adminPassword = "admin123"
        const hashedPassword = await bcrypt.hash(adminPassword, 12)

        const adminUser = await db.user.upsert({
            where: { email: adminEmail },
            update: {
                name: "Admin User",
                role: "ADMIN",
                phone: "+91 98765 43213",
                address: "123 Admin Street",
                city: "Mumbai",
                state: "Maharashtra",
                country: "India",
                zipCode: "400001",
                isActive: true,
            },
            create: {
                email: adminEmail,
                name: "Admin User",
                password: hashedPassword,
                role: "ADMIN",
                phone: "+91 98765 43213",
                address: "123 Admin Street",
                city: "Mumbai",
                state: "Maharashtra",
                country: "India",
                zipCode: "400001",
                isActive: true,
            }
        })
        console.log(`  ✓ Admin user: ${adminUser.name} (${adminUser.email})`)

        // Create categories
        console.log("📂 Creating categories...")
        const categoryMap = new Map()
        for (const categoryData of seedData.categories) {
            const category = await db.category.upsert({
                where: { slug: categoryData.slug },
                update: categoryData,
                create: categoryData
            })
            categoryMap.set(categoryData.slug, category.id)
            console.log(`  ✓ Created category: ${category.name}`)
        }

        // Create brands
        console.log("🏷️ Creating brands...")
        const brandMap = new Map()
        for (const brandData of seedData.brands) {
            const brand = await db.brand.upsert({
                where: { slug: brandData.slug },
                update: brandData,
                create: brandData
            })
            brandMap.set(brandData.slug, brand.id)
            console.log(`  ✓ Created brand: ${brand.name}`)
        }

        // Create products
        console.log("📦 Creating products...")
        for (const productData of seedData.products) {
            const { categorySlug, brandSlug, ...productFields } = productData

            const product = await db.product.upsert({
                where: { slug: productData.slug },
                update: {
                    ...productFields,
                    categoryId: categoryMap.get(categorySlug),
                    brandId: brandMap.get(brandSlug)
                },
                create: {
                    ...productFields,
                    categoryId: categoryMap.get(categorySlug),
                    brandId: brandMap.get(brandSlug)
                }
            })
            console.log(`  ✓ Created product: ${product.name}`)
        }

        // Create some sample customers
        console.log("👥 Creating sample customers...")
        const customers = [
            {
                email: "customer1@example.com",
                name: "Rajesh Kumar",
                password: await bcrypt.hash("password123", 12),
                phone: "+91 98765 43210",
                address: "123 MG Road",
                city: "Bangalore",
                state: "Karnataka",
                country: "India",
                zipCode: "560001",
                role: "CUSTOMER" as const
            },
            {
                email: "customer2@example.com",
                name: "Priya Sharma",
                password: await bcrypt.hash("password123", 12),
                phone: "+91 98765 43211",
                address: "456 Park Street",
                city: "Delhi",
                state: "Delhi",
                country: "India",
                zipCode: "110001",
                role: "CUSTOMER" as const
            }
        ]

        for (const customerData of customers) {
            await db.user.upsert({
                where: { email: customerData.email },
                update: customerData,
                create: customerData
            })
            console.log(`  ✓ Created customer: ${customerData.name}`)
        }

        console.log("✅ Database seeding completed successfully!")
        console.log("\n📊 Summary:")
        console.log(`  • Categories: ${seedData.categories.length}`)
        console.log(`  • Brands: ${seedData.brands.length}`)
        console.log(`  • Products: ${seedData.products.length}`)
        console.log(`  • Customers: ${customers.length}`)
        console.log(`  • Admin users: 1`)

        console.log("\n🔐 Admin Credentials:")
        console.log("  Email: admin@greenenergy.com")
        console.log("  Password: admin123")

    } catch (error) {
        console.error("❌ Error seeding database:", error)
        throw error
    }
}

// Export for use in other files
export { seedData }

// Run if called directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log("Database seeding completed")
            process.exit(0)
        })
        .catch((error) => {
            console.error("Database seeding failed:", error)
            process.exit(1)
        })
}