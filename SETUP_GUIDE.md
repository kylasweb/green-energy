# 🚀 Green Energy Platform - Setup & Testing Guide

## 📋 **STEP-BY-STEP SETUP PROCESS**

### **Step 1: Start the Application** ✅ COMPLETED
```bash
npm run dev
# Server running at: http://localhost:3000
```

### **Step 2: Initialize Admin User** 
**Manual Process via Browser:**

1. **Open Browser**: Navigate to `http://localhost:3000`
2. **Setup Admin**: Visit `http://localhost:3000/api/setup-admin` (POST request)
3. **Default Credentials**:
   - Email: `admin@greenenergy.com`
   - Password: `admin123`

**Alternative - API Call:**
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/setup-admin" -Method POST

# Or use Postman/Insomnia to POST to:
# http://localhost:3000/api/setup-admin
```

### **Step 3: Access Admin Dashboard**
1. Navigate to: `http://localhost:3000/admin`
2. Login with admin credentials
3. You should see the admin dashboard with UPI management

---

## 🧪 **TESTING CHECKLIST**

### **✅ Core Application Tests**
- [ ] **Homepage**: `http://localhost:3000` - Should show product catalog
- [ ] **Admin Login**: `http://localhost:3000/auth/signin` - Test admin login
- [ ] **Admin Dashboard**: `http://localhost:3000/admin` - Verify access after login
- [ ] **Health Check**: `http://localhost:3000/api/health` - Should return `{"message": "Good!"}`

### **💳 UPI System Tests**
- [ ] **UPI Settings**: `http://localhost:3000/admin/upi` - Configure payment gateways
- [ ] **VPA Management**: `http://localhost:3000/profile/upi` - User VPA management
- [ ] **Payment Initiation**: Test checkout flow with UPI payment
- [ ] **Webhook Handling**: Verify webhook endpoints work

### **🛍️ E-Commerce Tests**
- [ ] **Product Browsing**: Browse categories and products
- [ ] **Cart Functionality**: Add/remove items from cart
- [ ] **Checkout Process**: Complete order flow
- [ ] **Order Management**: View orders in admin and user profiles

---

## 🔧 **UPI GATEWAY CONFIGURATION**

### **Razorpay Test Setup** (Recommended First)

1. **Get Test Credentials**:
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Get Test API Key and Secret from Dashboard

2. **Configure in Admin Panel**:
   - Go to: `http://localhost:3000/admin/upi`
   - Add new UPI setting:
     - Provider: `razorpay`
     - API Key: `rzp_test_xxxxxxxxxx`
     - API Secret: `your_test_secret`
     - Merchant ID: `your_merchant_id`
     - Webhook Secret: `your_webhook_secret`
     - Test Mode: `true`
     - Active: `true`

3. **Test Payment Flow**:
   - Add product to cart
   - Proceed to checkout
   - Select UPI payment
   - Use test VPA: `success@razorpay` (for success)
   - Use test VPA: `failure@razorpay` (for failure)

---

## 🔍 **TROUBLESHOOTING**

### **Common Issues & Solutions**

**1. Database Connection Error**
```bash
# Regenerate Prisma client
npx prisma generate
npx prisma db push
```

**2. Admin User Already Exists**
- Expected behavior if admin was already created
- Use existing credentials to login

**3. UPI Payment Fails**
- Check gateway credentials in admin panel
- Verify webhook URLs are accessible
- Check test mode is enabled for development

**4. Authentication Issues**
- Check NEXTAUTH_SECRET in .env.local
- Clear browser cookies/localStorage
- Restart development server

---

## 🌐 **API ENDPOINTS REFERENCE**

### **Public APIs**
- `GET /api/health` - Health check
- `GET /api/products` - List products
- `GET /api/categories` - List categories
- `POST /api/auth/register` - User registration
- `POST /api/checkout` - Create order

### **Admin APIs** (Require Authentication)
- `GET/POST/PUT/DELETE /api/admin/upi/settings` - UPI gateway management
- `GET /api/admin/upi/transactions` - Transaction history
- `GET /api/admin/upi/analytics` - Payment analytics
- `POST /api/admin/upi/transactions/[id]/refund` - Process refunds

### **Payment APIs**
- `POST /api/payments/upi/initiate` - Start UPI payment
- `GET /api/payments/upi/status/[orderId]` - Check payment status
- `POST /api/payments/upi/webhook` - Handle payment webhooks

---

## 📊 **EXPECTED OUTCOMES**

### **After Successful Setup:**
1. ✅ **Admin Dashboard** - Fully functional with all management features
2. ✅ **UPI System** - Complete payment gateway integration working
3. ✅ **E-Commerce** - Product browsing, cart, and checkout functional
4. ✅ **Database** - All transactions and data properly stored
5. ✅ **Security** - Encrypted credentials and secure authentication

### **Production Readiness Indicators:**
- [ ] All test payments process successfully
- [ ] Webhook endpoints respond correctly
- [ ] Admin can manage products, orders, and UPI settings
- [ ] Customer can complete full purchase journey
- [ ] All sensitive data is encrypted in database

---

## 🎯 **NEXT PHASE: PRODUCTION DEPLOYMENT**

1. **Environment Setup**:
   - Configure production database
   - Set up production payment gateway accounts
   - Configure SSL certificates for webhooks

2. **Security Hardening**:
   - Change default admin credentials
   - Set strong encryption keys
   - Configure CORS and rate limiting

3. **Deployment**:
   - Build for production: `npm run build`
   - Deploy to hosting platform (Vercel, Netlify, etc.)
   - Configure environment variables on host

---

**Status**: Ready for manual testing and UPI gateway configuration 🚀