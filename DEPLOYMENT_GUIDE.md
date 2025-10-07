# 🚀 Deployment Guide: Netlify & Vercel

## 🎯 **Platform Comparison**

| Feature                  | Vercel               | Netlify          |
| ------------------------ | -------------------- | ---------------- |
| **Next.js Support**      | ✅ Native            | ✅ Good          |
| **Serverless Functions** | ✅ Excellent         | ✅ Good          |
| **Database Support**     | ✅ Edge Runtime      | ✅ Functions     |
| **Build Performance**    | ⭐⭐⭐⭐⭐           | ⭐⭐⭐⭐         |
| **Pricing (Free Tier)**  | Generous             | Generous         |
| **Recommendation**       | **Best for Next.js** | Good Alternative |

---

## 🌟 **RECOMMENDED: Vercel Deployment**

### **Why Vercel?**

- Built by Next.js creators
- Optimized for Next.js applications
- Excellent serverless function support
- Built-in Edge Runtime for databases
- Superior performance for React apps

---

## 🚀 **VERCEL DEPLOYMENT GUIDE**

### **Step 1: Database Setup**

**Option A: Neon PostgreSQL (Recommended)**

```bash
# 1. Sign up at https://neon.tech (Free tier available)
# 2. Create a new project
# 3. Get connection string from dashboard
# Format: postgresql://username:password@host/dbname?sslmode=require
```

**Option B: Supabase PostgreSQL**

```bash
# 1. Sign up at https://supabase.com
# 2. Create new project
# 3. Get connection string from Settings > Database
```

### **Step 2: Update Prisma Schema for Production**

Update `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

### **Step 3: Environment Variables Setup**

Create `.env.production` for production values:

```bash
# Production Database (Neon/Supabase)
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="your-super-secure-production-secret-key-32-chars+"

# Admin Configuration
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="secure-production-password-123!"

# Encryption Key (Generate new for production)
ENCRYPTION_KEY="production-32-byte-encryption-key!!"

# Production Settings
NODE_ENV="production"
```

### **Step 4: Deploy to Vercel**

**Method 1: Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Project name: green-energy
# - Build command: npm run build
# - Output directory: .next
```

**Method 2: GitHub Integration**

1. Push code to GitHub (already done ✅)
2. Go to [vercel.com](https://vercel.com)
3. "New Project" → Import from GitHub
4. Select `kylasweb/green-energy` repository
5. Configure environment variables
6. Deploy!

### **Step 5: Configure Environment Variables in Vercel**

In Vercel dashboard:

```
Settings → Environment Variables → Add:

DATABASE_URL = postgresql://your-neon-connection-string
NEXTAUTH_URL = https://your-app.vercel.app
NEXTAUTH_SECRET = your-production-secret
ADMIN_EMAIL = admin@yourdomain.com
ADMIN_PASSWORD = your-secure-password
ENCRYPTION_KEY = your-32-byte-production-key
NODE_ENV = production
```

### **Step 6: Database Migration**

After deployment, run database setup:

```bash
# Install Prisma CLI if needed
npm install -g prisma

# Generate Prisma client for PostgreSQL
npx prisma generate

# Push schema to production database
npx prisma db push --accept-data-loss

# Seed production admin user
node scripts/seed-admin-cjs.js

# Seed sample products (optional)
node scripts/seed-products.js
```

---

## 🔷 **NETLIFY DEPLOYMENT GUIDE**

### **Step 1: Build Configuration**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  node_bundler = "esbuild"
```

### **Step 2: Deploy to Netlify**

**Method 1: Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Method 2: GitHub Integration**

1. Go to [netlify.com](https://netlify.com)
2. "New site from Git" → GitHub
3. Select repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

---

## 🔧 **PRE-DEPLOYMENT CHECKLIST**

### **✅ Code Preparation**

- [ ] Update database provider to PostgreSQL
- [ ] Create production environment variables
- [ ] Test build locally: `npm run build`
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Generate secure production secrets

### **✅ Database Setup**

- [ ] Create production database (Neon/Supabase)
- [ ] Update DATABASE_URL in deployment platform
- [ ] Run database migrations
- [ ] Seed admin user and sample data

### **✅ Security Configuration**

- [ ] Change default admin password
- [ ] Generate new NEXTAUTH_SECRET
- [ ] Update ENCRYPTION_KEY for production
- [ ] Configure CORS for webhooks

### **✅ UPI Gateway Configuration**

- [ ] Set up production Razorpay account
- [ ] Configure webhook URLs with HTTPS
- [ ] Test payment flow in production
- [ ] Update webhook endpoints in gateway dashboard

---

## 🎯 **POST-DEPLOYMENT TASKS**

### **1. Verify Deployment**

```bash
# Test key endpoints
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/products
```

### **2. Setup Admin User**

```bash
# Initialize admin in production
curl -X POST https://your-app.vercel.app/api/setup-admin
```

### **3. Configure Payment Gateways**

- Login to admin dashboard
- Add production UPI gateway credentials
- Test payment flow with real transactions

### **4. Performance Optimization**

- Enable caching in Vercel/Netlify
- Configure CDN for static assets
- Set up monitoring and analytics

---

## 🚨 **COMMON DEPLOYMENT ISSUES & SOLUTIONS**

### **Issue 1: Database Connection Errors**

```bash
# Solution: Check connection string format
# PostgreSQL: postgresql://username:password@host:port/database?sslmode=require
# Ensure SSL is enabled for production databases
```

### **Issue 2: Environment Variables Not Loading**

```bash
# Solution: Verify variables are set in platform dashboard
# Redeploy after adding new environment variables
```

### **Issue 3: Build Failures**

```bash
# Solution: Check Node.js version compatibility
# Ensure all dependencies are in package.json
# Test build locally before deploying
```

### **Issue 4: Prisma Client Issues**

```bash
# Solution: Regenerate client for production
npx prisma generate
npm run build
```

---

## 📊 **RECOMMENDED DEPLOYMENT FLOW**

### **🥇 Option 1: Vercel + Neon (Easiest)**

1. **Database**: Neon PostgreSQL (Free tier)
2. **Hosting**: Vercel (Optimized for Next.js)
3. **Domain**: Custom domain via Vercel
4. **Monitoring**: Vercel Analytics

### **🥈 Option 2: Netlify + Supabase**

1. **Database**: Supabase PostgreSQL
2. **Hosting**: Netlify
3. **Domain**: Custom domain via Netlify
4. **Functions**: Netlify Functions

---

## 🎉 **SUCCESS METRICS**

After successful deployment, you should have:

- ✅ **Live application** accessible via HTTPS
- ✅ **Admin dashboard** working with production data
- ✅ **Payment gateways** configured for real transactions
- ✅ **Database** properly connected and populated
- ✅ **Security** hardened for production use

**🚀 Ready to go live with your Green Energy e-commerce platform!**
