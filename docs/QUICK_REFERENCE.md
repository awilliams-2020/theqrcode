# Quick Reference Card

## 🚀 One-Command Deploy

```bash
cd /home/awilliams
./theqrcode/setup-cron.sh
```

---

## 📁 File Locations

| What | Where |
|------|-------|
| **Documentation** | `docs/` |
| **Cron Config** | `docker/crontab` |
| **Startup Script** | `docker/entrypoint.sh` |
| **Email Templates** | `src/lib/engagement/email-templates.ts` |
| **Automation Logic** | `src/lib/engagement/` |
| **Cron API Routes** | `src/app/api/cron/` |
| **UI Components** | `src/components/NotificationBell.tsx` etc. |

---

## 🔧 Essential Commands

### Container Management
```bash
# Start services
docker-compose up -d theqrcode

# Restart
docker-compose restart theqrcode

# View logs
docker logs -f theqrcode

# Enter container
docker exec -it theqrcode sh
```

### Cron Operations
```bash
# View cron schedule
docker exec theqrcode crontab -l

# Check cron is running
docker exec theqrcode ps aux | grep cron

# View cron logs
docker exec theqrcode tail -f /var/log/cron.log

# Test daily cron
docker exec theqrcode curl http://localhost:3000/api/cron/daily \
  -H "Authorization: Bearer $(docker exec theqrcode printenv CRON_SECRET)"
```

### Database
```bash
# Connect to database
docker exec -it postgres psql -U postgres -d theqrcode

# Check email logs
docker exec -it postgres psql -U postgres -d theqrcode -c \
  "SELECT * FROM \"EmailLog\" ORDER BY \"sentAt\" DESC LIMIT 10;"

# Count total emails sent
docker exec -it postgres psql -U postgres -d theqrcode -c \
  "SELECT COUNT(*) FROM \"EmailLog\";"
```

### Migrations
```bash
cd /home/awilliams/theqrcode

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

---

## 🔐 Environment Variables

Generate CRON_SECRET:
```bash
openssl rand -base64 32
```

Required in `docker-compose.yml`:
- `CRON_SECRET` - For cron authentication
- `SMTP_*` - Email configuration
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_*` - Authentication
- `STRIPE_*` - Payment processing

---

## 📅 Cron Schedule

| Job | Time (UTC) | Cron Expression | Purpose |
|-----|------------|-----------------|---------|
| Daily | 9:00 AM | `0 9 * * *` | Trial reminders, campaigns |
| Weekly | Monday 10 AM | `0 10 * * 1` | Re-engagement emails |
| Monthly | 1st 10 AM | `0 10 1 * *` | Usage insights |

---

## 🧪 Test Commands

### Test All Cron Endpoints
```bash
CRON_SECRET=$(docker exec theqrcode printenv CRON_SECRET)

# Daily
curl http://localhost:3000/api/cron/daily \
  -H "Authorization: Bearer $CRON_SECRET"

# Weekly
curl http://localhost:3000/api/cron/weekly \
  -H "Authorization: Bearer $CRON_SECRET"

# Monthly
curl http://localhost:3000/api/cron/monthly \
  -H "Authorization: Bearer $CRON_SECRET"
```

### Test Email
```bash
docker exec theqrcode nc -zv mail.redbudway.com 465
```

---

## 📊 Monitoring Queries

### Email Statistics
```sql
SELECT 
  DATE("sentAt") as date,
  "emailType",
  COUNT(*) as sent,
  COUNT(CASE WHEN "openedAt" IS NOT NULL THEN 1 END) as opened
FROM "EmailLog"
WHERE "sentAt" > NOW() - INTERVAL '7 days'
GROUP BY DATE("sentAt"), "emailType"
ORDER BY date DESC;
```

### Users with Trial Ending Soon
```sql
SELECT 
  u.email,
  s."trialEndsAt",
  EXTRACT(DAY FROM s."trialEndsAt" - NOW()) as days_left
FROM "User" u
JOIN "Subscription" s ON u.id = s."userId"
WHERE s."trialEndsAt" BETWEEN NOW() AND NOW() + INTERVAL '3 days';
```

### Inactive Users
```sql
SELECT 
  email,
  "updatedAt",
  EXTRACT(DAY FROM NOW() - "updatedAt") as days_inactive
FROM "User"
WHERE "updatedAt" < NOW() - INTERVAL '30 days'
AND "isDeleted" = false;
```

---

## 🐛 Troubleshooting

### Cron Not Running
```bash
# Check if cron daemon is running
docker exec theqrcode ps aux | grep cron

# Manually start cron
docker exec theqrcode crond -b -l 2

# Check logs
docker logs theqrcode | grep -i cron
```

### Emails Not Sending
```bash
# Test SMTP connection
docker exec theqrcode nc -zv mail.redbudway.com 465

# Check failed emails
docker exec -it postgres psql -U postgres -d theqrcode -c \
  "SELECT * FROM \"EmailLog\" WHERE status = 'failed';"

# Check SMTP credentials
docker exec theqrcode printenv | grep SMTP
```

### Container Won't Start
```bash
# Check build logs
docker-compose build theqrcode

# Check container logs
docker logs theqrcode

# Check file permissions
ls -la theqrcode/docker/
```

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| [README.md](README.md) | Documentation index |
| [DOCKER_CRON_QUICKSTART.md](DOCKER_CRON_QUICKSTART.md) | 5-minute setup |
| [DOCKER_CRON_SETUP.md](DOCKER_CRON_SETUP.md) | Complete guide |
| [DOCKER_CRON_COMPLETE.md](DOCKER_CRON_COMPLETE.md) | Full summary |
| [ENGAGEMENT_SYSTEM.md](ENGAGEMENT_SYSTEM.md) | System reference |
| [AUTOMATION_INTEGRATION.md](AUTOMATION_INTEGRATION.md) | Integration guide |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Deploy steps |

---

## 🔗 Quick Links

- **Production:** https://theqrcode.io
- **Dev:** https://dev.theqrcode.io
- **DB UI:** https://db.theqrcode.io
- **Project Root:** `/home/awilliams/theqrcode`
- **Docs:** `/home/awilliams/theqrcode/docs`

---

## 🎯 Common Tasks

**Deploy changes:**
```bash
docker-compose build theqrcode
docker-compose up -d theqrcode
```

**View real-time logs:**
```bash
docker logs -f theqrcode
```

**Restart after config change:**
```bash
docker-compose restart theqrcode
```

**Generate new CRON_SECRET:**
```bash
openssl rand -base64 32
# Update in docker-compose.yml
docker-compose up -d theqrcode
```

---

**Last Updated:** October 10, 2025  
**Status:** ✅ Production Ready

