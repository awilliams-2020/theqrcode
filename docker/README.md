# Docker Configuration

## Container Setup

### Entrypoint Script

The `entrypoint.sh` script runs when the container starts and performs:
1. Database migrations via Prisma
2. Prisma client generation
3. Starts the Next.js application

## Cron Jobs

**⚠️ Important:** Cron jobs are managed by the **HOST SYSTEM**, not inside the container.

### Why Host-Based Cron?

- **Reliability**: Container restarts would kill cron jobs
- **Consistency**: Jobs run even if container is restarting
- **Monitoring**: Easier to check logs on host system
- **Simplicity**: No duplicate jobs

### Current Cron Schedule (Host)

Jobs are configured on the host machine to call the external API endpoints:

```bash
# Daily tasks at 9:00 AM UTC - Trial reminders, campaigns, cleanup
0 9 * * * curl -s -X GET https://theqrcode.io/api/cron/daily -H 'Authorization: Bearer ${CRON_SECRET}' >> /home/awilliams/logs/theqrcode-daily.log 2>&1

# Weekly tasks every Monday at 10:00 AM UTC - Re-engagement emails
0 10 * * 1 curl -s -X GET https://theqrcode.io/api/cron/weekly -H 'Authorization: Bearer ${CRON_SECRET}' >> /home/awilliams/logs/theqrcode-weekly.log 2>&1

# Monthly tasks on 1st at 10:00 AM UTC - Usage insights
0 10 1 * * curl -s -X GET https://theqrcode.io/api/cron/monthly -H 'Authorization: Bearer ${CRON_SECRET}' >> /home/awilliams/logs/theqrcode-monthly.log 2>&1
```

### View Host Crontab

```bash
crontab -l | grep theqrcode
```

### Cron Job Endpoints

- `/api/cron/daily` - Trial reminders, expired trial downgrades, scheduled campaigns, analytics summaries
- `/api/cron/weekly` - Re-engagement emails for inactive users
- `/api/cron/monthly` - Monthly usage insights

### Logs

Cron job execution logs are stored on the host:
- `/home/awilliams/logs/theqrcode-daily.log`
- `/home/awilliams/logs/theqrcode-weekly.log`
- `/home/awilliams/logs/theqrcode-monthly.log`

## Environment Variables

Required for the container to function:
- `DATABASE_URL` - PostgreSQL connection string
- `CRON_SECRET` - Used by host cron to authenticate API calls
- SMTP configuration for email sending
- Stripe API keys

See `.env.local` for full list of environment variables.

