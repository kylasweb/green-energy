#!/usr/bin/env node
/**
 * Environment Setup Script for Production Deployment
 * 
 * This script helps generate secure environment variables for production.
 * Use this before deploying to Vercel/Netlify.
 * 
 * Usage: node scripts/env-setup.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 Environment Setup for Production Deployment\n');

// Generate secure random strings
function generateSecureKey(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function generateJwtSecret() {
  return crypto.randomBytes(64).toString('base64');
}

function generateNextAuthSecret() {
  return crypto.randomBytes(32).toString('base64');
}

// Generate all required secrets
const secrets = {
  NEXTAUTH_SECRET: generateNextAuthSecret(),
  JWT_SECRET: generateJwtSecret(),
  ENCRYPTION_KEY: generateSecureKey(32),
  WEBHOOK_SECRET: generateSecureKey(24),
  SESSION_SECRET: generateSecureKey(32)
};

console.log('🎲 Generated Security Keys:');
console.log('================================\n');

// Create production environment template
const envTemplate = `# Production Environment Variables
# Copy these to your Vercel/Netlify environment settings

# Database (Required)
DATABASE_URL="postgresql://username:password@hostname:port/database"

# NextAuth Configuration (Required)
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="${secrets.NEXTAUTH_SECRET}"

# Security Keys (Required)
JWT_SECRET="${secrets.JWT_SECRET}"
ENCRYPTION_KEY="${secrets.ENCRYPTION_KEY}"
WEBHOOK_SECRET="${secrets.WEBHOOK_SECRET}"
SESSION_SECRET="${secrets.SESSION_SECRET}"

# Environment
NODE_ENV="production"

# UPI Gateway Settings (Optional - Configure as needed)
# Razorpay
RAZORPAY_KEY_ID="your_razorpay_key"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

# PayU
PAYU_MERCHANT_KEY="your_payu_key"
PAYU_MERCHANT_SALT="your_payu_salt"

# PhonePe
PHONEPE_MERCHANT_ID="your_phonepe_merchant_id"
PHONEPE_SALT_KEY="your_phonepe_salt_key"
PHONEPE_SALT_INDEX="your_phonepe_salt_index"

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Admin Configuration
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="${generateSecureKey(16)}"

# Application Settings
APP_NAME="Green Energy E-commerce"
APP_URL="https://yourdomain.com"
SUPPORT_EMAIL="support@yourdomain.com"

# Feature Flags
ENABLE_UPI_PAYMENTS="true"
ENABLE_EMAIL_NOTIFICATIONS="true"
ENABLE_WEBHOOK_LOGGING="true"

# Rate Limiting
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="900000"

# File Upload
MAX_FILE_SIZE="5242880"
ALLOWED_FILE_TYPES="jpg,jpeg,png,webp,svg"

# Cache Settings
REDIS_URL="redis://localhost:6379"
CACHE_TTL="3600"
`;

// Save to file
const envPath = path.join(__dirname, '../.env.production.generated');
fs.writeFileSync(envPath, envTemplate);

console.log(`✅ Environment template saved to: .env.production.generated\n`);

// Display summary
console.log('📋 Environment Setup Summary:');
console.log('=============================');
console.log('✅ NextAuth Secret generated');
console.log('✅ JWT Secret generated');
console.log('✅ Encryption Key generated');
console.log('✅ Webhook Secret generated');
console.log('✅ Session Secret generated');
console.log('✅ Admin Password generated\n');

console.log('🚀 Next Steps for Deployment:');
console.log('==============================');
console.log('1. Set up PostgreSQL database (recommended: Neon, Supabase, or Vercel Postgres)');
console.log('2. Copy environment variables to your hosting platform:');
console.log('   - Vercel: Project Settings → Environment Variables');
console.log('   - Netlify: Site Settings → Environment Variables');
console.log('3. Update DATABASE_URL with your PostgreSQL connection string');
console.log('4. Update NEXTAUTH_URL with your actual domain');
console.log('5. Configure UPI gateway credentials (optional)');
console.log('6. Deploy your application\n');

console.log('⚡ Quick Deploy Commands:');
console.log('========================');
console.log('# For Vercel');
console.log('npx vercel --prod');
console.log('');
console.log('# For Netlify');
console.log('npm run build && npx netlify deploy --prod\n');

console.log('🔒 Security Reminder:');
console.log('=====================');
console.log('- Never commit .env.production.generated to version control');
console.log('- Use secure environment variable management in production');
console.log('- Rotate secrets regularly');
console.log('- Enable 2FA on your hosting platform accounts\n');

// Platform-specific instructions
console.log('📱 Platform-Specific Setup:');
console.log('===========================\n');

console.log('🔵 Vercel Setup:');
console.log('1. Install Vercel CLI: npm i -g vercel');
console.log('2. Login: vercel login');
console.log('3. Deploy: vercel --prod');
console.log('4. Set environment variables in Vercel dashboard\n');

console.log('🟠 Netlify Setup:');
console.log('1. Install Netlify CLI: npm i -g netlify-cli');
console.log('2. Login: netlify login');
console.log('3. Build: npm run build');
console.log('4. Deploy: netlify deploy --prod --dir=.next\n');

console.log('🗄️  Database Setup (Choose one):');
console.log('=================================');
console.log('• Neon (Recommended): https://neon.tech');
console.log('• Supabase: https://supabase.com');
console.log('• Vercel Postgres: https://vercel.com/storage/postgres');
console.log('• Railway: https://railway.app');
console.log('• PlanetScale: https://planetscale.com\n');

console.log('🎯 Environment Variable Priority:');
console.log('==================================');
console.log('🔴 Critical (Must Set):');
console.log('  - DATABASE_URL');
console.log('  - NEXTAUTH_URL');
console.log('  - NEXTAUTH_SECRET');
console.log('  - JWT_SECRET');
console.log('  - ENCRYPTION_KEY\n');

console.log('🟡 Important (Should Set):');
console.log('  - ADMIN_EMAIL');
console.log('  - ADMIN_PASSWORD');
console.log('  - WEBHOOK_SECRET\n');

console.log('🟢 Optional (Configure as needed):');
console.log('  - UPI Gateway credentials');
console.log('  - Email configuration');
console.log('  - Redis URL\n');

console.log('All done! Your application is ready for production deployment. 🚀');