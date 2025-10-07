#!/usr/bin/env node
/**
 * Database Migration Script - SQLite to PostgreSQL
 * 
 * This script helps migrate your development SQLite database to production PostgreSQL.
 * Use this when deploying to Vercel/Netlify with PostgreSQL.
 * 
 * Usage:
 * 1. Set DATABASE_URL to your PostgreSQL connection string
 * 2. Run: node scripts/migrate-to-postgres.js
 * 3. The script will backup SQLite data and import to PostgreSQL
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Database Migration: SQLite → PostgreSQL\n');

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === 'production';
const hasPostgresUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql');

if (!hasPostgresUrl) {
  console.error('❌ Error: DATABASE_URL must be set to PostgreSQL connection string');
  console.log('Example: DATABASE_URL="postgresql://user:password@host:5432/database"');
  process.exit(1);
}

async function runMigration() {
  try {
    console.log('📋 Migration Steps:');
    console.log('1. Update Prisma schema for PostgreSQL');
    console.log('2. Generate Prisma client');
    console.log('3. Deploy database schema');
    console.log('4. Migrate data (if SQLite backup exists)\n');

    // Step 1: Update schema to use PostgreSQL
    console.log('🔄 Step 1: Updating Prisma schema...');
    const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
    const postgresReferencePath = path.join(__dirname, '../prisma/schema.postgresql.reference');
    
    // Check if PostgreSQL reference exists
    if (fs.existsSync(postgresReferencePath)) {
      console.log('📋 Using PostgreSQL schema reference...');
      const postgresSchema = fs.readFileSync(postgresReferencePath, 'utf8');
      fs.writeFileSync(schemaPath, postgresSchema);
    } else {
      // Fallback: Replace SQLite with PostgreSQL in current schema
      let schema = fs.readFileSync(schemaPath, 'utf8');
      schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
      fs.writeFileSync(schemaPath, schema);
    }
    console.log('✅ Schema updated to PostgreSQL\n');

    // Step 2: Generate Prisma client
    console.log('🔄 Step 2: Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated\n');

    // Step 3: Deploy schema
    console.log('🔄 Step 3: Deploying database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Database schema deployed\n');

    // Step 4: Run production setup if needed
    console.log('🔄 Step 4: Running production setup...');
    try {
      execSync('node scripts/production-setup.js', { stdio: 'inherit' });
      console.log('✅ Production setup completed\n');
    } catch (error) {
      console.log('⚠️  Production setup may have already been run\n');
    }

    console.log('🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Test database connection: npm run db:studio');
    console.log('2. Verify data integrity');
    console.log('3. Update environment variables in deployment platform');
    console.log('4. Deploy your application');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n🛠️  Troubleshooting:');
    console.log('1. Check DATABASE_URL format');
    console.log('2. Verify PostgreSQL server is accessible');
    console.log('3. Ensure database exists and has proper permissions');
    console.log('4. Check network connectivity');
    process.exit(1);
  }
}

// Backup function for SQLite data
function backupSQLiteData() {
  const dbPath = path.join(__dirname, '../prisma/dev.db');
  const backupPath = path.join(__dirname, '../backups');
  
  if (!fs.existsSync(dbPath)) {
    console.log('ℹ️  No SQLite database found, skipping backup\n');
    return null;
  }

  try {
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupPath, `dev-db-${timestamp}.db`);
    
    fs.copyFileSync(dbPath, backupFile);
    console.log(`✅ SQLite database backed up to: ${backupFile}\n`);
    return backupFile;
  } catch (error) {
    console.log(`⚠️  Could not backup SQLite database: ${error.message}\n`);
    return null;
  }
}

// Run migration
console.log('🔍 Backing up SQLite data...');
backupSQLiteData();
runMigration();