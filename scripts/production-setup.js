#!/usr/bin/env node

/**
 * Production Database Setup Script
 * Run this after deploying to production to initialize database
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting production database setup...\n');

async function runCommand(command, description) {
  try {
    console.log(`📋 ${description}...`);
    const output = execSync(command, { 
      cwd: process.cwd(),
      stdio: 'inherit',
      encoding: 'utf8' 
    });
    console.log(`✅ ${description} completed\n`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} failed:`);
    console.error(error.message);
    process.exit(1);
  }
}

async function setupProduction() {
  try {
    // Check if we're in production environment
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️  Warning: NODE_ENV is not set to production');
      console.log('Current NODE_ENV:', process.env.NODE_ENV || 'undefined');
    }

    // Check database connection
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set');
      console.log('Please configure DATABASE_URL in your deployment platform');
      process.exit(1);
    }

    console.log('🗄️  Database URL configured:', process.env.DATABASE_URL.substring(0, 20) + '...');

    // Generate Prisma client
    await runCommand('npx prisma generate', 'Generating Prisma client');

    // Push database schema
    await runCommand('npx prisma db push --accept-data-loss', 'Pushing database schema');

    // Check if admin user exists, if not create one
    console.log('👤 Checking admin user...');
    try {
      const { PrismaClient } = require('@prisma/client');
      const db = new PrismaClient();
      
      const adminUser = await db.user.findFirst({
        where: { role: 'SUPER_ADMIN' }
      });

      if (!adminUser) {
        console.log('📋 Creating admin user...');
        await runCommand('node scripts/seed-admin-cjs.js', 'Creating admin user');
      } else {
        console.log('✅ Admin user already exists:', adminUser.email);
      }

      await db.$disconnect();
    } catch (error) {
      console.log('📋 Creating admin user via script...');
      await runCommand('node scripts/seed-admin-cjs.js', 'Creating admin user');
    }

    // Optionally seed sample data
    if (process.env.SEED_SAMPLE_DATA === 'true') {
      await runCommand('node scripts/seed-products.js', 'Seeding sample products');
    } else {
      console.log('⏭️  Skipping sample data (set SEED_SAMPLE_DATA=true to include)');
    }

    console.log('🎉 Production database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Visit your app URL to verify it works');
    console.log('2. Login to admin dashboard with your credentials');
    console.log('3. Configure UPI payment gateways');
    console.log('4. Test the complete payment flow\n');

  } catch (error) {
    console.error('❌ Production setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setupProduction();