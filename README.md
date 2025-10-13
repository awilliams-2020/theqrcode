# TheQRCode.io

QR code generation platform with analytics, subscriptions, and API access.

**Live:** https://theqrcode.io

## Features

- Dynamic QR codes with real-time scan analytics
- Multiple types: URL, WiFi, Contact, Email, Text
- Tiered plans (Free, Starter, Pro, Business)
- RESTful API for programmatic access
- Stripe payments + Google OAuth
- Email automation (welcome, trials, insights)
- Docker-based cron jobs

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

## Stack

Next.js 15 • PostgreSQL • Prisma • Docker • Stripe • NextAuth

---

📝 See [TODO.md](TODO.md) for roadmap
