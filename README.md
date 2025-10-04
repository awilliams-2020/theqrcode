# QR Analytics SaaS

A modern, full-stack QR code generator with advanced analytics tracking. Built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

### Core Features
- **QR Code Generation**: Create QR codes for URLs, text, WiFi, contacts, and email
- **Custom Styling**: Customize colors, size, and frame styles
- **Analytics Tracking**: Track scans with detailed insights (location, device, timing)
- **Dynamic QR Codes**: Enable/disable analytics per QR code
- **User Management**: Secure authentication with NextAuth.js
- **Subscription Plans**: Free, Starter, Pro, and Business tiers

### Analytics Features
- Real-time scan tracking
- Device type detection (mobile, desktop, tablet)
- Browser and OS information
- Geographic location (with IP geolocation)
- Referrer tracking
- Time-based analytics

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payments**: Stripe (planned)
- **Deployment**: Vercel + Railway

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qr-analytics-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/qr_analytics"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🏗 Database Schema

### Users & Authentication
- **User**: User accounts with NextAuth.js integration
- **Account**: OAuth provider accounts
- **Session**: User sessions
- **Subscription**: User subscription plans and limits

### QR Codes & Analytics
- **QrCode**: QR code definitions with settings
- **Scan**: Individual scan events with analytics data

## 📊 Pricing Plans

| Plan | Price | QR Codes | Scans/Month | Features |
|------|-------|----------|-------------|----------|
| Free | $0 | 10 | 1,000 | Basic analytics |
| Starter | $15 | 100 | 10,000 | Advanced analytics, custom branding |
| Pro | $35 | 500 | 50,000 | API access, bulk generation |
| Business | $75 | Unlimited | Unlimited | White-label, team features |

## 🔧 API Endpoints

### QR Code Management
- `GET /api/qr-codes` - List user's QR codes
- `POST /api/qr-codes` - Create new QR code
- `GET /api/qr-codes/[id]` - Get QR code details
- `PUT /api/qr-codes/[id]` - Update QR code
- `DELETE /api/qr-codes/[id]` - Delete QR code

### Analytics Tracking
- `GET /api/track/[shortUrl]` - Track scan and redirect

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

## 🚀 Deployment

### Database Setup
1. Create a PostgreSQL database on Railway or Supabase
2. Update `DATABASE_URL` in your environment variables
3. Run migrations: `npx prisma migrate deploy`

### Frontend Deployment
1. Deploy to Vercel
2. Set environment variables in Vercel dashboard
3. Configure custom domain (optional)

## 📈 Business Model

### Revenue Streams
1. **Subscription Revenue**: Monthly/annual recurring revenue
2. **API Access**: Pay-per-use API for developers
3. **White-label Licensing**: Custom branding for enterprises

### Target Market
- Small businesses and restaurants
- Marketing agencies
- Event organizers
- Freelancers and consultants
- E-commerce stores

### Growth Strategy
1. **SEO Optimization**: Target QR code related keywords
2. **Content Marketing**: Blog posts about QR code best practices
3. **Social Media**: Showcase QR code use cases
4. **Partnerships**: Integrate with marketing tools
5. **Referral Program**: Incentivize user referrals

## 🔮 Future Features

### Phase 2
- [ ] Bulk QR code generation
- [ ] API access for developers
- [ ] Advanced analytics dashboard
- [ ] Export analytics data

### Phase 3
- [ ] White-label options
- [ ] Team collaboration features
- [ ] Custom domains for short URLs
- [ ] A/B testing for QR codes

### Phase 4
- [ ] Mobile app
- [ ] QR code templates library
- [ ] Integration marketplace
- [ ] Enterprise SSO

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support, email support@qr-analytics.com or create an issue in the repository.

---

**Built with ❤️ by [Your Name]**