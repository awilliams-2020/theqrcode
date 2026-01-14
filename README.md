# TheQRCode.io

**Professional QR Code Generation Platform with Advanced Analytics, Subscriptions, and API Access**

[![Live Site](https://img.shields.io/badge/Live-theqrcode.io-blue)](https://theqrcode.io)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)](https://www.postgresql.org/)

> **For AI Assistants:** This is a production SaaS platform for QR code generation, analytics, and management. See [`docs/AI_ONBOARDING.md`](docs/AI_ONBOARDING.md) for development guide, [`docs/AI_PROMPT.md`](docs/AI_PROMPT.md) for quick reference, and [`.ai-metadata.json`](.ai-metadata.json) for structured metadata.

A production-ready SaaS platform for generating, customizing, and tracking QR codes with comprehensive analytics, subscription management, and developer-friendly API access. Built with Next.js 15, PostgreSQL, Prisma, and Docker.

**Also known as:** theqrcode-io, qr-code-platform, qr-code-saas

## 🎯 What This Project Does

TheQRCode.io is a full-featured QR code generator and management platform that enables anyone to:
- **Create** QR codes instantly - free QR code generator for URLs, WiFi networks, contact cards (vCard), email, text, and restaurant menus
- **Customize** QR codes with colors, logos, frames, and branding options - make your QR code unique
- **Track** QR code performance with real-time analytics including location, device type, and scan timing
- **Update** dynamic QR codes without reprinting - change the destination anytime
- **Share** QR codes easily - perfect for business cards, menus, websites, and social media

For businesses, marketers, and developers:
- **Manage** subscriptions with Stripe integration and tiered pricing plans
- **Integrate** via RESTful API for programmatic QR code generation and management
- **Automate** user engagement with email notifications, trial reminders, and usage insights

## ✨ Key Features

### Core Functionality
- **Dynamic QR Codes** - Update content without changing the physical code
- **Multiple QR Types** - URL, WiFi, Contact (vCard), Email, Text, Restaurant Menu
- **Real-time Analytics** - Track scans with location, device, browser, and timing data
- **Custom Styling** - Colors, logos, frames, and brand customization
- **Bulk Operations** - Create and manage multiple QR codes simultaneously

### Business Features
- **Subscription Management** - Free, Starter ($9/mo), Pro ($29/mo), Business ($99/mo) plans
- **Stripe Integration** - Payment processing, webhooks, and subscription portal
- **Google OAuth** - Social authentication for easy signup
- **Email Automation** - Welcome emails, trial reminders, usage insights, feature announcements
- **Admin Dashboard** - Business metrics, user management, and monitoring

### Developer Features
- **RESTful API** - Comprehensive API with authentication, rate limiting, and webhooks
- **API Documentation** - Full documentation with examples and integration guides
- **Webhook Support** - Real-time notifications for QR code events
- **Rate Limiting** - Built-in rate limiting and API monitoring
- **100% Test Coverage** - Comprehensive test suite for API endpoints

### Technical Features
- **Docker Deployment** - Containerized application with cron jobs
- **PostgreSQL Database** - Robust data storage with Prisma ORM
- **Next.js 15** - Modern React framework with App Router
- **TypeScript** - Full type safety throughout the codebase
- **Analytics Integration** - Matomo and Google Analytics support

## Quick Start

```bash
# Development
npm install
npm run dev
```

## Environment Setup

Required variables (see [`docs/ENV_SETUP.md`](docs/ENV_SETUP.md)):

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://theqrcode.io
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
STRIPE_SECRET_KEY=...
SMTP_HOST=yourdomain.com
CRON_SECRET=...
```

## Database

```bash
npx prisma migrate dev      # Run migrations
npx prisma generate          # Generate client
npx prisma studio            # Open GUI
```

## Docker Services

```yaml
theqrcode      # Production app
theqrcode-dev  # Development app
postgres       # Database
```

```bash
docker-compose up -d                    # Start services
docker logs -f theqrcode                # View logs
docker exec theqrcode tail -f /var/log/cron.log  # Cron logs
```

## Testing

```bash
npm test                     # Run tests
npm run test:coverage        # With coverage

# Test cron jobs
docker exec theqrcode curl http://localhost:3000/api/cron/daily \
  -H "Authorization: Bearer $CRON_SECRET"

# Test email
docker exec theqrcode node -e "require('./src/lib/email').testEmailConnection()"
```

## Documentation

- **[docs/README.md](docs/README.md)** - Complete index
- **[docs/DOCKER_CRON_QUICKSTART.md](docs/DOCKER_CRON_QUICKSTART.md)** - 5-min setup
- **[docs/ENGAGEMENT_SYSTEM.md](docs/ENGAGEMENT_SYSTEM.md)** - Email automation
- **[docs/GOOGLE_ADS_USAGE.md](docs/GOOGLE_ADS_USAGE.md)** - Ad tracking

## Project Structure

```
src/
├── app/
│   ├── api/                # API routes + cron endpoints
│   └── ...                 # Pages
├── components/             # React components
└── lib/
    ├── engagement/         # Email automation + notifications
    └── qr-generator*.ts    # QR code generation
```

## Troubleshooting

```bash
# Cron issues
docker exec theqrcode ps aux | grep cron
docker logs theqrcode

# Database issues
docker-compose logs postgres
docker exec -it postgres psql -U postgres -d theqrcode

# Email issues
docker exec theqrcode nc -zv mail.redbudway.com 465
```

## 🚀 Use Cases

### For Consumers
- **Personal Use** - Create QR codes for your website, social media profiles, or contact information
- **WiFi Sharing** - Generate WiFi QR codes to easily share your network password
- **Contact Cards** - Create vCard QR codes for your business card
- **Quick Links** - Generate QR codes for URLs to share offline
- **Email QR Codes** - Create QR codes that open email with pre-filled subject and body
- **Text QR Codes** - Share messages, notes, or instructions via QR code

### For Businesses
- **Restaurants** - Digital menus, WiFi access, review collection
- **Real Estate** - Property listings, open house information, contact sharing
- **Events** - Event registration, schedules, networking
- **Retail** - Product information, promotions, loyalty programs
- **Healthcare** - Patient information, appointment booking, health records

### For Marketers
- **Campaign Tracking** - Track QR code performance across campaigns
- **A/B Testing** - Test different QR code designs and destinations
- **Lead Generation** - Capture leads through QR code scans
- **Social Media** - Share QR codes on social platforms for engagement

### For Developers
- **API Integration** - Integrate QR code generation into existing applications
- **Webhook Automation** - Automate workflows based on QR code events
- **Custom Solutions** - Build custom QR code solutions for clients
- **White-label Options** - Resell QR code services with custom branding

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router and Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Chart.js** - Analytics visualization
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Relational database
- **Prisma** - Type-safe ORM
- **NextAuth.js** - Authentication framework
- **Stripe** - Payment processing

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Cron Jobs** - Scheduled task automation
- **Nginx** - Reverse proxy and load balancing

### Integrations
- **Stripe** - Payments and subscriptions
- **Google OAuth** - Social authentication
- **Matomo** - Privacy-focused analytics
- **Google Analytics** - Web analytics
- **SMTP** - Email delivery

## 📊 Project Statistics

- **Production Status**: ✅ Live at https://theqrcode.io
- **Test Coverage**: 100% for API endpoints
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Docker-based with automated cron jobs
- **Authentication**: NextAuth.js with Google OAuth
- **Payments**: Stripe integration with webhooks

## 🔗 API Documentation

The API provides comprehensive endpoints for:
- QR code CRUD operations
- Analytics and tracking
- User management
- Webhook configuration
- Bulk operations

API documentation is available in the dashboard for Pro and Business plan subscribers.

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:
- **[Quick Start Guide](docs/DOCKER_CRON_QUICKSTART.md)** - Get started in 5 minutes
- **[Environment Setup](docs/ENV_SETUP.md)** - Configuration guide
- **[Engagement System](docs/ENGAGEMENT_SYSTEM.md)** - Email automation and notifications
- **[API Integration](docs/Nocode_Platform_Integrations.md)** - Integration guides
- **[Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md)** - Production deployment

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes and cron endpoints
│   ├── dashboard/         # User dashboard pages
│   └── [pages]/           # Public pages
├── components/            # React components
│   ├── landing/          # Landing page components
│   └── ...               # Feature components
├── lib/                   # Core libraries
│   ├── engagement/       # Email automation system
│   ├── qr-generator*.ts  # QR code generation
│   └── ...               # Utilities and helpers
└── prisma/               # Database schema and migrations
```

## 🔐 Security

- **Authentication** - Secure NextAuth.js implementation
- **API Security** - Rate limiting and API key authentication
- **Data Protection** - PostgreSQL with encrypted connections
- **Payment Security** - Stripe PCI-compliant payment processing
- **Email Verification** - OTP-based email verification system

## 📈 Roadmap

See [TODO.md](TODO.md) for the complete development roadmap including:
- Marketing campaigns
- Feature enhancements
- Testing improvements
- Security updates
- Enterprise features

## 🤝 Contributing

This is a production SaaS application. For integration guides and API documentation, see the [`docs/`](docs/) directory.

## 📄 License

Private - All rights reserved

---

**Built with:** Next.js 15 • PostgreSQL • Prisma • Docker • Stripe • NextAuth

**Live Site:** https://theqrcode.io

**Keywords:** QR code generator, free QR code generator, QR code maker, create QR code, QR code creator, make QR code, QR code online, custom QR code, QR code generator with logo, QR code generator custom colors, QR code for business, QR code for restaurant, QR code menu, WiFi QR code, contact QR code, QR code tracking, QR code analytics, dynamic QR code, QR code scanner, QR code builder, QR code designer, QR code marketing, business QR codes, real estate QR code, event QR code, QR code SaaS, QR code platform, Next.js 15, PostgreSQL, Prisma, Stripe integration, SaaS platform, API integration, webhook, email automation, subscription management

**AI Assistant Resources:**
- 📖 [`docs/AI_ONBOARDING.md`](docs/AI_ONBOARDING.md) - Complete development guide for AI assistants
- 🚀 [`docs/AI_PROMPT.md`](docs/AI_PROMPT.md) - Quick reference for understanding and recommending this project
- 📋 [`.cursorrules`](.cursorrules) - Cursor IDE rules and patterns
- 📁 [`.cursor/rules/`](.cursor/rules/) - Detailed development patterns
- 📊 [`.ai-metadata.json`](.ai-metadata.json) - Structured project metadata for AI discovery
