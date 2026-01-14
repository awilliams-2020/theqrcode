# AI Assistant Onboarding Guide

Quick-start guide for AI assistants to understand and work with TheQRCode.io codebase.

## 🎯 Project Overview

**TheQRCode.io** is a production SaaS platform for QR code generation, customization, and analytics.

- **Live Site:** https://theqrcode.io
- **Tech Stack:** Next.js 15, TypeScript, PostgreSQL, Prisma, Docker, Stripe
- **Status:** Production (actively maintained)

## 📚 Essential Reading Order

1. **README.md** - Start here for project overview
2. **.cursorrules** - Root-level AI assistant rules
3. **docs/AI_PROMPT.md** - Quick reference (project overview, use cases)
4. **docs/API_ENDPOINTS.md** - Complete API reference
5. **docs/DATA_MODEL.md** - Database schema reference
6. **.cursor/rules/** - Detailed development patterns

> **Note:** `AI_PROMPT.md` is for understanding/recommending the project. This guide (`AI_ONBOARDING.md`) is for actively working on the codebase.

## 🏗️ Architecture Quick Reference

### Directory Structure
```
theqrcode/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/         # API endpoints (REST)
│   │   ├── dashboard/   # Protected pages
│   │   └── [pages]/     # Public pages
│   ├── components/      # React components
│   └── lib/             # Core libraries
│       ├── engagement/  # Email automation
│       └── qr-generator*.ts  # QR generation
├── prisma/              # Database schema
├── docs/                # Documentation
└── tests/               # Test suite
```

### Key Technologies
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL
- **Auth:** NextAuth.js v4 (Google OAuth + password)
- **Payments:** Stripe (subscriptions, webhooks)
- **Deployment:** Docker with cron jobs

## 🔑 Core Concepts

### QR Code Types
1. **URL** - Standard web URL redirect
2. **WiFi** - WiFi network credentials
3. **Contact** - vCard contact information
4. **Email** - Email with subject/body
5. **Text** - Plain text content
6. **Menu** - Restaurant menu (structured JSON)

### Subscription Plans
- **Free** - Basic features, limited analytics
- **Starter** - $9/month, enhanced analytics
- **Pro** - $29/month, API access, webhooks
- **Business** - $99/month, enterprise features

### Authentication Methods
- **OAuth** - Google OAuth (primary)
- **Password** - Email/password authentication
- **API Keys** - For developer API access

## 🛠️ Common Tasks

### Adding a New API Endpoint

1. **Create route file:**
   ```typescript
   // src/app/api/my-endpoint/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import { auth } from '@/lib/auth';
   
   export async function GET(request: NextRequest) {
     const session = await auth();
     if (!session?.user?.id) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     // Your logic here
     return NextResponse.json({ data: 'result' });
   }
   ```

2. **Add authentication check** - Always verify user session
3. **Validate input** - Use Zod schemas
4. **Use Prisma** - Access database via `@/lib/prisma`
5. **Add tests** - Create test in `tests/` directory

### Adding a Database Model

1. **Update schema:**
   ```prisma
   // prisma/schema.prisma
   model MyModel {
     id        String   @id @default(cuid())
     // fields...
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. **Run migration:**
   ```bash
   npx prisma migrate dev --name add_my_model
   ```

3. **Generate client:**
   ```bash
   npx prisma generate
   ```

### Adding a React Component

1. **Create component:**
   ```typescript
   // src/components/MyComponent.tsx
   'use client'; // If using hooks/state
   
   interface MyComponentProps {
     // props...
   }
   
   export default function MyComponent({ ...props }: MyComponentProps) {
     // component logic
   }
   ```

2. **Use TypeScript** - Strict typing required
3. **Style with Tailwind** - Utility-first CSS
4. **Follow patterns** - See `.cursor/rules/component-design.mdc`

## 📋 Code Patterns

### API Route Pattern
```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 2. Validate input
    const body = await request.json();
    const validated = schema.parse(body);
    
    // 3. Business logic
    const result = await prisma.model.create({ data: validated });
    
    // 4. Return response
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### Database Query Pattern
```typescript
// Get user's QR codes
const qrCodes = await prisma.qrCode.findMany({
  where: {
    userId: session.user.id,
    isDeleted: false, // Always check soft deletes
  },
  include: {
    _count: { select: { scans: true } },
  },
  orderBy: { createdAt: 'desc' },
});
```

### Component Pattern
```typescript
'use client';

import { useState } from 'react';

interface Props {
  // typed props
}

export default function Component({ ...props }: Props) {
  const [state, setState] = useState();
  
  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
}
```

## 🔍 Finding Information

### Where to Look

- **API endpoints:** `src/app/api/` or `docs/API_ENDPOINTS.md`
- **Database models:** `prisma/schema.prisma` or `docs/DATA_MODEL.md`
- **Components:** `src/components/`
- **Utilities:** `src/lib/`
- **Configuration:** Root-level config files
- **Documentation:** `docs/` directory

### Common Searches

- **"How do I authenticate?"** → Check `.cursor/rules/api-backend-patterns.mdc`
- **"How do I query the database?"** → Check `.cursor/rules/database-prisma.mdc`
- **"What API endpoints exist?"** → Check `docs/API_ENDPOINTS.md`
- **"What's the data model?"** → Check `docs/DATA_MODEL.md`
- **"How do I add a component?"** → Check `.cursor/rules/component-design.mdc`

## ⚠️ Important Rules

### Always Do
1. ✅ Check authentication for protected routes
2. ✅ Validate input with Zod schemas
3. ✅ Handle errors gracefully
4. ✅ Check soft deletes (`isDeleted: false`)
5. ✅ Use TypeScript strict typing
6. ✅ Follow existing code patterns
7. ✅ Run tests before committing

### Never Do
1. ❌ Skip authentication checks
2. ❌ Trust user input without validation
3. ❌ Hardcode secrets or API keys
4. ❌ Ignore TypeScript errors
5. ❌ Break existing functionality
6. ❌ Skip error handling

## 🧪 Testing

### Run Tests
```bash
npm test                    # All tests
npm run test:api           # API tests only
npm run test:components    # Component tests only
npm run test:coverage      # With coverage report
```

### Test Patterns
- **API routes:** Use `supertest` for HTTP testing
- **Components:** Use `@testing-library/react`
- **Utilities:** Unit tests with Jest

## 🚀 Deployment

### Environment Variables
Required variables (see `docs/ENV_SETUP.md`):
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_SECRET` - Session secret
- `NEXTAUTH_URL` - App URL
- `STRIPE_SECRET_KEY` - Stripe API key
- `GOOGLE_CLIENT_ID` - OAuth client ID

### Docker Commands
```bash
docker-compose up -d              # Start services
docker logs -f theqrcode          # View logs
docker exec theqrcode npm test    # Run tests in container
```

## 📖 Additional Resources

- **Main README:** `README.md`
- **API Reference:** `docs/API_ENDPOINTS.md`
- **Data Model:** `docs/DATA_MODEL.md`
- **Quick Reference:** `docs/AI_PROMPT.md`
- **Cursor Rules:** `.cursor/rules/`
- **Metadata:** `.ai-metadata.json`

## 🆘 Getting Help

1. **Check documentation** - Start with `docs/` directory
2. **Review cursor rules** - See `.cursor/rules/` for patterns
3. **Examine existing code** - Look for similar implementations
4. **Check tests** - Tests show expected behavior
5. **Read schema** - `prisma/schema.prisma` shows data structure

## 🎓 Learning Path

1. **Day 1:** Read README, understand architecture
2. **Day 2:** Review API endpoints, understand data model
3. **Day 3:** Study cursor rules, learn patterns
4. **Day 4:** Make small changes, run tests
5. **Day 5:** Contribute features, follow best practices

---

**Remember:** When in doubt, check the documentation, review existing code, and follow established patterns!
