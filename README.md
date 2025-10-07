# 🌱 Green Energy - E-Commerce Platform

A comprehensive e-commerce platform specializing in green energy products with advanced UPI payment gateway integration and modern web technologies.

## ✨ Key Features

### 💳 Advanced Payment System

- **🏦 Multi-Gateway UPI Integration** - Razorpay, PayU, PhonePe, GPay support
- **� Secure Payment Processing** - AES-256 encrypted credential storage
- **💰 Transaction Management** - Real-time status tracking, refunds, analytics
- **👤 VPA Management** - User virtual payment address management
- **📊 Payment Analytics** - Comprehensive transaction reporting

### 🛍️ E-Commerce Features

- **🛒 Shopping Cart** - Persistent cart with context management
- **📦 Product Catalog** - Categories, brands, detailed product pages
- **👥 User Management** - Authentication, profiles, order history
- **📋 Order Management** - Complete order lifecycle management
- **💼 Admin Dashboard** - Product management, user administration

### 🎯 Core Technology Stack

- **⚡ Next.js 15** - React framework with App Router
- **� TypeScript 5** - Full type safety across the application
- **� Tailwind CSS** - Modern, responsive UI design
- **🗄️ Prisma ORM** - Type-safe database operations
- **🔐 NextAuth.js** - Secure authentication system

### 🧩 UI Components & Styling

- **🧩 shadcn/ui** - Professional component library
- **🎯 Lucide React** - Consistent iconography
- **� Responsive Design** - Mobile-first approach
- **🌙 Dark Mode Support** - Theme switching capability

## � UPI Payment Gateway System

### Gateway Integration

```typescript
// Supported Payment Gateways
- Razorpay (Primary)
- PayU Money
- PhonePe
- Google Pay
- Mock Gateway (Development)
```

### Security Features

- **🔒 Encrypted Credentials** - All sensitive data encrypted with AES-256
- **🛡️ Role-Based Access** - Admin-only gateway management
- **✅ Transaction Validation** - Real-time payment verification
- **� Webhook Security** - Secure webhook handling with signature verification

### Admin UPI Management

- **⚙️ Gateway Configuration** - Easy setup and management of payment providers
- **💳 VPA Administration** - Manage user virtual payment addresses
- **� Transaction Dashboard** - Real-time payment monitoring
- **🔄 Refund Processing** - Automated refund capabilities

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/kylasweb/green-energy.git
cd green-energy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Configure your database and payment gateway credentials

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to access the Green Energy platform.

## ⚙️ Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="file:./db/custom.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Admin Credentials
ADMIN_EMAIL="admin@greenenergy.com"
ADMIN_PASSWORD="your-admin-password"

# Payment Gateway Credentials (Configure in Admin Panel)
# Razorpay, PayU, PhonePe credentials managed through UI
```

## 🔐 Admin Access

1. **First-time Setup**: Visit `/api/setup-admin` to create the initial admin account
2. **Admin Dashboard**: Access admin features at `/admin`
3. **UPI Management**: Configure payment gateways in Admin > UPI Settings

### Default Admin Features

- **Product Management** - Add, edit, delete products and categories
- **Order Management** - View and process customer orders
- **User Management** - Manage customer accounts
- **UPI Gateway Setup** - Configure multiple payment providers
- **Transaction Analytics** - View payment reports and analytics

## 📁 Project Structure

```
├── prisma/              # Database schema and migrations
├── public/              # Static assets (images, icons)
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── admin/       # Admin dashboard pages
│   │   ├── api/         # API routes
│   │   │   ├── admin/   # Admin API endpoints
│   │   │   │   └── upi/ # UPI gateway management
│   │   │   ├── auth/    # Authentication endpoints
│   │   │   ├── payments/# Payment processing APIs
│   │   │   │   └── upi/ # UPI payment endpoints
│   │   │   └── products/# Product management APIs
│   │   ├── auth/        # Authentication pages
│   │   ├── cart/        # Shopping cart
│   │   ├── checkout/    # Checkout process
│   │   ├── orders/      # Order management
│   │   └── products/    # Product catalog
│   ├── components/      # Reusable components
│   │   ├── admin/       # Admin-specific components
│   │   ├── layout/      # Layout components
│   │   └── ui/          # shadcn/ui components
│   ├── contexts/        # React contexts (Cart, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and services
│   │   ├── gateways/    # Payment gateway integrations
│   │   ├── auth.ts      # Authentication logic
│   │   ├── db.ts        # Database connection
│   │   └── upi-service.ts # UPI payment service
│   └── types/           # TypeScript type definitions
└── db/                  # SQLite database files
```

## �️ E-Commerce Features

### 🏪 Customer Features

- **Product Browsing** - Category-wise product listing with search
- **Shopping Cart** - Persistent cart with quantity management
- **User Accounts** - Registration, login, profile management
- **Order Tracking** - Real-time order status updates
- **Payment Options** - Multiple UPI gateways for secure payments

### 👨‍💼 Admin Features

- **Dashboard** - Overview of sales, orders, and analytics
- **Product Management** - CRUD operations for products and categories
- **Order Management** - Process and update order statuses
- **User Management** - View and manage customer accounts
- **UPI Gateway Setup** - Configure and manage payment providers

### � Payment Gateway Management

- **Multi-Provider Support** - Razorpay, PayU, PhonePe, GPay
- **Secure Configuration** - Encrypted storage of API credentials
- **Transaction Monitoring** - Real-time payment status tracking
- **Automated Refunds** - Streamlined refund processing
- **Webhook Handling** - Secure payment confirmation processing

### 🔐 Security & Performance

- **Data Encryption** - AES-256 encryption for sensitive data
- **Role-Based Access** - Admin and customer role separation
- **Type Safety** - Full TypeScript implementation
- **Optimized Builds** - Production-ready performance optimization

## 🛠️ Development Workflow

### Adding New Payment Gateways

1. Create gateway implementation in `src/lib/gateways/`
2. Update UPI service to include new provider
3. Add gateway configuration in admin panel
4. Test payment flow with sandbox credentials

### Database Updates

```bash
# After modifying prisma/schema.prisma
npx prisma generate
npx prisma db push

# For production migrations
npx prisma migrate deploy
```

### API Routes Structure

- **`/api/admin/upi/settings`** - CRUD operations for UPI gateway settings
- **`/api/payments/upi/initiate`** - Start payment process
- **`/api/payments/upi/status`** - Check payment status
- **`/api/payments/upi/webhook`** - Handle gateway webhooks

## 🚀 Deployment

### Environment Setup

1. Configure production database URL
2. Set up payment gateway production credentials
3. Configure NextAuth secret and URL
4. Set admin credentials for initial setup

### Build & Deploy

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Built with modern web technologies for scalable e-commerce
- Comprehensive UPI payment gateway integration
- Security-first approach with encrypted data handling
- Production-ready architecture with TypeScript

---

**Green Energy Platform** - Powering sustainable e-commerce with advanced payment solutions 🌱⚡
