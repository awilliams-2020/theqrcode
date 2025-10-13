# Docker + Cron Setup Guide

## ✅ What's Been Configured

Your TheQRCode.io application now runs cron jobs inside the Docker container using Linux crontab.

---

## 📁 Files Created

### 1. **docker/crontab** - Cron Schedule
Defines when each automation task runs:
- **Daily at 9 AM**: Trial reminders, campaigns, cleanup
- **Monday at 10 AM**: Re-engagement emails  
- **1st of month at 10 AM**: Usage insights

### 2. **docker/entrypoint.sh** - Container Startup Script
Handles:
- Cron daemon installation and setup
- Environment variable export
- Database migrations
- Prisma client generation
- Starting Next.js and cron together

### 3. **Dockerfile** - Updated with Cron Support
Added:
- dcron package installation
- curl for HTTP requests
- gettext for environment variable substitution
- Custom entrypoint script

### 4. **docker-compose.yml** - Added CRON_SECRET
New environment variable for securing cron endpoints.

---

## 🚀 Setup Instructions

### Step 1: Generate CRON_SECRET
```bash
openssl rand -base64 32
```

Example output: `xK9mP2vL8nQ4rT6wY1zA3bC5dE7fG9hJ0iK2lM4nO6pQ8rS0tU2vW4xY6zA8bC0d=`

### Step 2: Update docker-compose.yml

Replace `CHANGE_THIS_TO_YOUR_GENERATED_SECRET` with your generated secret:

```yaml
# In docker-compose.yml, find the theqrcode service:
environment:
  # ... other environment variables ...
  - CRON_SECRET=xK9mP2vL8nQ4rT6wY1zA3bC5dE7fG9hJ0iK2lM4nO6pQ8rS0tU2vW4xY6zA8bC0d=
```

Do the same for `theqrcode-dev` service.

### Step 3: Create Docker Directory

```bash
cd /home/awilliams/theqrcode
mkdir -p docker
```

The files are already created:
- ✅ `docker/crontab`
- ✅ `docker/entrypoint.sh`

### Step 4: Rebuild and Deploy

```bash
cd /home/awilliams

# Stop the current containers
docker-compose stop theqrcode theqrcode-dev

# Rebuild with new Dockerfile
docker-compose build theqrcode theqrcode-dev

# Start the containers
docker-compose up -d theqrcode theqrcode-dev
```

### Step 5: Verify Cron is Running

```bash
# Check container logs
docker logs theqrcode

# You should see:
# ✓ Cron jobs installed
# ✓ Cron daemon started
# Starting Next.js application...
```

Check cron is active:
```bash
# Enter the container
docker exec -it theqrcode sh

# View crontab
crontab -l

# Check cron process
ps aux | grep cron

# Exit container
exit
```

---

## 🧪 Testing

### Test Cron Manually

```bash
# Test daily cron
docker exec theqrcode curl -X GET http://localhost:3000/api/cron/daily \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Test weekly cron
docker exec theqrcode curl -X GET http://localhost:3000/api/cron/weekly \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Test monthly cron
docker exec theqrcode curl -X GET http://localhost:3000/api/cron/monthly \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### View Cron Logs

```bash
# View cron execution logs
docker exec theqrcode tail -f /var/log/cron.log

# Or view all container logs
docker logs -f theqrcode
```

### Check Email Logs in Database

```bash
# Connect to postgres
docker exec -it postgres psql -U postgres -d theqrcode

# Check email logs
SELECT 
  "emailType",
  subject,
  status,
  "sentAt"
FROM "EmailLog"
ORDER BY "sentAt" DESC
LIMIT 10;

# Exit
\q
```

---

## 📅 Cron Schedule

| Job | Schedule | Time (UTC) | What It Does |
|-----|----------|------------|--------------|
| Daily | `0 9 * * *` | 9:00 AM | Trial reminders, campaigns, cleanup |
| Weekly | `0 10 * * 1` | Monday 10:00 AM | Re-engagement emails |
| Monthly | `0 10 1 * *` | 1st at 10:00 AM | Usage insights |

### How It Works

1. **Cron daemon starts** when container starts
2. **At scheduled time**, cron executes curl command
3. **Curl makes HTTP request** to internal localhost:3000
4. **API endpoint receives request** and runs automation
5. **Results logged** to `/var/log/cron.log`

---

## 🔧 Customization

### Change Cron Schedule

Edit `docker/crontab`:
```bash
# Change daily from 9 AM to 12 PM (noon)
0 12 * * * curl -X GET http://localhost:3000/api/cron/daily -H "Authorization: Bearer ${CRON_SECRET}" >> /var/log/cron.log 2>&1
```

After changes:
```bash
# Rebuild container
docker-compose build theqrcode
docker-compose up -d theqrcode
```

### Add Custom Cron Job

Edit `docker/crontab`:
```bash
# Add custom job every 2 hours
0 */2 * * * curl -X GET http://localhost:3000/api/cron/custom -H "Authorization: Bearer ${CRON_SECRET}" >> /var/log/cron.log 2>&1
```

### View Real-time Logs

```bash
# Watch cron execution logs
docker exec theqrcode tail -f /var/log/cron.log

# Watch all container logs
docker logs -f theqrcode
```

---

## 🔒 Security

### How It's Secured

1. **CRON_SECRET** - Required in Authorization header
2. **Internal only** - Cron calls localhost (not exposed)
3. **Container isolation** - Runs inside Docker network
4. **Environment variables** - Secrets not in code

### Update CRON_SECRET

If you need to change the secret:

```bash
# Generate new secret
NEW_SECRET=$(openssl rand -base64 32)

# Update docker-compose.yml
# Then restart container
docker-compose up -d theqrcode
```

---

## 🐛 Troubleshooting

### Cron Jobs Not Running

**Check if cron daemon is running:**
```bash
docker exec theqrcode ps aux | grep cron
# Should show: crond process
```

**Check crontab is installed:**
```bash
docker exec theqrcode crontab -l
# Should show your cron jobs
```

**Check logs for errors:**
```bash
docker exec theqrcode cat /var/log/cron.log
```

### Emails Not Sending

**Test SMTP manually:**
```bash
# Enter container
docker exec -it theqrcode sh

# Test connection
nc -zv mail.redbudway.com 465

# Exit
exit
```

**Check email logs:**
```bash
docker exec -it postgres psql -U postgres -d theqrcode -c \
  "SELECT * FROM \"EmailLog\" WHERE status = 'failed' ORDER BY \"sentAt\" DESC LIMIT 5;"
```

### Cron Secret Not Working

**Verify secret is set:**
```bash
docker exec theqrcode printenv | grep CRON_SECRET
```

**Test endpoint with correct secret:**
```bash
docker exec theqrcode curl -v -X GET http://localhost:3000/api/cron/daily \
  -H "Authorization: Bearer $(docker exec theqrcode printenv CRON_SECRET)"
```

### Container Won't Start

**Check logs:**
```bash
docker logs theqrcode
```

**Common issues:**
- Missing `docker/` directory
- Incorrect file permissions on entrypoint.sh
- Syntax error in crontab

**Fix permissions:**
```bash
cd /home/awilliams/theqrcode
chmod +x docker/entrypoint.sh
chmod 0644 docker/crontab
```

---

## 📊 Monitoring

### Check Cron Execution

```bash
# View recent cron runs
docker exec theqrcode tail -20 /var/log/cron.log

# Count successful runs today
docker exec theqrcode grep "$(date +%Y-%m-%d)" /var/log/cron.log | wc -l
```

### Database Monitoring

```bash
# Email statistics
docker exec -it postgres psql -U postgres -d theqrcode -c "
  SELECT 
    DATE(\"sentAt\") as date,
    \"emailType\",
    COUNT(*) as count
  FROM \"EmailLog\"
  WHERE \"sentAt\" > NOW() - INTERVAL '7 days'
  GROUP BY DATE(\"sentAt\"), \"emailType\"
  ORDER BY date DESC;
"
```

### Set Up Alerts

Add to your monitoring system:
```bash
# Check if cron ran in last 25 hours
LAST_RUN=$(docker exec theqrcode stat -c %Y /var/log/cron.log)
NOW=$(date +%s)
DIFF=$((NOW - LAST_RUN))

if [ $DIFF -gt 90000 ]; then
  echo "WARNING: Cron hasn't run in over 25 hours!"
fi
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Container starts successfully
- [ ] Cron daemon is running (`ps aux | grep cron`)
- [ ] Crontab is installed (`crontab -l`)
- [ ] CRON_SECRET is set (`printenv | grep CRON`)
- [ ] Can call cron endpoints manually
- [ ] Logs show cron execution
- [ ] Welcome email sends on signup
- [ ] Database EmailLog entries created

---

## 🎯 What Happens Automatically

### On Container Start:
1. Installs cron daemon
2. Exports environment variables for cron
3. Installs crontab from `docker/crontab`
4. Starts cron daemon in background
5. Runs database migrations
6. Generates Prisma client
7. Starts Next.js application

### At Scheduled Times:
1. Cron daemon triggers curl command
2. Curl calls internal API endpoint
3. API verifies CRON_SECRET
4. Runs automation tasks
5. Logs results to `/var/log/cron.log`
6. Emails sent via SMTP
7. Database updated with EmailLog entries

---

## 📚 Related Files

- **Dockerfile**: Container build configuration
- **docker/entrypoint.sh**: Startup script
- **docker/crontab**: Cron schedule
- **docker-compose.yml**: Service configuration
- **src/app/api/cron/**: API endpoints
- **src/lib/engagement/**: Automation logic

---

## 🚀 Quick Reference Commands

```bash
# View cron logs
docker exec theqrcode tail -f /var/log/cron.log

# Test daily cron
docker exec theqrcode curl http://localhost:3000/api/cron/daily \
  -H "Authorization: Bearer $(docker exec theqrcode printenv CRON_SECRET)"

# Check cron is running
docker exec theqrcode ps aux | grep cron

# View crontab
docker exec theqrcode crontab -l

# Restart container
docker-compose restart theqrcode

# View container logs
docker logs -f theqrcode

# Check database emails
docker exec -it postgres psql -U postgres -d theqrcode -c \
  "SELECT COUNT(*) FROM \"EmailLog\";"
```

---

**Status:** ✅ Docker + Cron Setup Complete  
**Container:** theqrcode (production) + theqrcode-dev (development)  
**Cron Jobs:** 3 (daily, weekly, monthly)  
**Security:** CRON_SECRET required for all endpoints

Your automation is now running inside Docker with cron! 🎉

