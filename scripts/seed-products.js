const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

async function seedSampleData() {
  try {
    console.log('🌱 Seeding sample data...')
    
    // Create categories
    const batteryCategory = await db.category.upsert({
      where: { slug: 'batteries' },
      update: {},
      create: {
        name: 'Batteries',
        slug: 'batteries',
        description: 'High-quality automotive and inverter batteries',
        isActive: true,
        sortOrder: 1
      }
    })
    
    const inverterCategory = await db.category.upsert({
      where: { slug: 'inverters' },
      update: {},
      create: {
        name: 'Inverters',
        slug: 'inverters',
        description: 'Power inverters for home and office use',
        isActive: true,
        sortOrder: 2
      }
    })
    
    const solarCategory = await db.category.upsert({
      where: { slug: 'solar-solutions' },
      update: {},
      create: {
        name: 'Solar Solutions',
        slug: 'solar-solutions',
        description: 'Complete solar energy solutions',
        isActive: true,
        sortOrder: 3
      }
    })
    
    // Create brands
    const amaronBrand = await db.brand.upsert({
      where: { slug: 'amaron' },
      update: {},
      create: {
        name: 'Amaron',
        slug: 'amaron',
        description: 'Leading battery manufacturer',
        isActive: true
      }
    })
    
    const luminousBrand = await db.brand.upsert({
      where: { slug: 'luminous' },
      update: {},
      create: {
        name: 'Luminous',
        slug: 'luminous',
        description: 'Power backup solutions',
        isActive: true
      }
    })
    
    const exideBrand = await db.brand.upsert({
      where: { slug: 'exide' },
      update: {},
      create: {
        name: 'Exide',
        slug: 'exide',
        description: 'Trusted battery solutions',
        isActive: true
      }
    })
    
    // Create sample products
    const products = [
      {
        name: 'Amaron 2.5L Battery',
        slug: 'amaron-2-5l-battery',
        description: 'Reliable two-wheeler battery offering durability and smooth performance. Perfect for motorcycles and scooters with advanced AGM technology.',
        shortDesc: 'Reliable two-wheeler battery with advanced AGM technology',
        sku: 'AMR-2.5L-001',
        price: 758.00,
        mrp: 899.00,
        cost: 650.00,
        categoryId: batteryCategory.id,
        brandId: amaronBrand.id,
        stockQuantity: 25,
        lowStockThreshold: 5,
        weight: 2.5,
        dimensions: { length: 150, width: 87, height: 110, unit: 'mm' },
        isActive: true,
        isFeatured: true,
        tags: ['motorcycle', 'scooter', 'AGM', 'maintenance-free']
      },
      {
        name: 'Luminous 850VA Inverter',
        slug: 'luminous-850va-inverter',
        description: 'High-efficiency home inverter with pure sine wave output. Suitable for running essential appliances during power cuts.',
        shortDesc: 'Pure sine wave home inverter - 850VA capacity',
        sku: 'LUM-850VA-001',
        price: 4250.00,
        mrp: 4999.00,
        cost: 3800.00,
        categoryId: inverterCategory.id,
        brandId: luminousBrand.id,
        stockQuantity: 15,
        lowStockThreshold: 3,
        weight: 8.5,
        dimensions: { length: 320, width: 180, height: 220, unit: 'mm' },
        isActive: true,
        isFeatured: true,
        tags: ['pure-sine-wave', 'home-inverter', 'power-backup']
      },
      {
        name: 'Exide 150Ah Tall Tubular Battery',
        slug: 'exide-150ah-tall-tubular-battery',
        description: 'High-capacity inverter battery with superior performance and longer backup time. Suitable for heavy-duty applications.',
        shortDesc: 'Heavy-duty 150Ah tubular battery for long backup',
        sku: 'EXI-150AH-001',
        price: 12500.00,
        mrp: 14999.00,
        cost: 11200.00,
        categoryId: batteryCategory.id,
        brandId: exideBrand.id,
        stockQuantity: 8,
        lowStockThreshold: 2,
        weight: 45.0,
        dimensions: { length: 500, width: 190, height: 410, unit: 'mm' },
        isActive: true,
        isFeatured: true,
        tags: ['tubular', 'high-capacity', 'deep-cycle']
      },
      {
        name: 'Luminous Solar Panel 150W',
        slug: 'luminous-solar-panel-150w',
        description: 'Monocrystalline solar panel with high efficiency and weather resistance. Perfect for residential solar installations.',
        shortDesc: 'High-efficiency 150W monocrystalline solar panel',
        sku: 'LUM-SOLAR-150W',
        price: 6500.00,
        mrp: 7500.00,
        cost: 5800.00,
        categoryId: solarCategory.id,
        brandId: luminousBrand.id,
        stockQuantity: 20,
        lowStockThreshold: 5,
        weight: 12.0,
        dimensions: { length: 1480, width: 670, height: 35, unit: 'mm' },
        isActive: true,
        isFeatured: true,
        tags: ['monocrystalline', 'solar-panel', 'renewable-energy']
      }
    ]
    
    for (const product of products) {
      await db.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product
      })
    }
    
    console.log('✅ Sample data seeded successfully!')
    console.log(`Created ${products.length} products across 3 categories and 3 brands`)
    
  } catch (error) {
    console.error('❌ Error seeding sample data:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  seedSampleData()
}

module.exports = { seedSampleData }