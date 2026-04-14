# TheQRCode.io – Documentation

Concise index of project documentation.

## Quick start

- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** – Deploy, cron, env, commands
- **[DOCKER_CRON_SETUP.md](DOCKER_CRON_SETUP.md)** – Docker + cron setup and troubleshooting
- **[QUICK_SETUP_GUIDE.md](QUICK_SETUP_GUIDE.md)** – 5-minute integration guide
- **[ENV_SETUP.md](ENV_SETUP.md)** – Environment variables

## Core systems

- **[ENGAGEMENT_SYSTEM.md](ENGAGEMENT_SYSTEM.md)** – Email automation, notifications, announcements, feedback
- **[NOTIFICATION_SYSTEM_ARCHITECTURE.md](NOTIFICATION_SYSTEM_ARCHITECTURE.md)** – Notification system design
- **[ANALYTICS_NOTIFICATIONS.md](ANALYTICS_NOTIFICATIONS.md)** – Analytics and notification behavior
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** – Deployment steps

## Analytics & marketing

- **[MATOMO.md](MATOMO.md)** – Matomo setup, tracking API, landing pages
- **[GOOGLE_ADS.md](GOOGLE_ADS.md)** – Google Ads conversion tracking and keywords
- **[SEO.md](SEO.md)** – SEO setup, strategy, components
- **[BLOG_SEO_UPDATE_GUIDE.md](BLOG_SEO_UPDATE_GUIDE.md)** – Adding blog posts with SEO
- **[SEARCH_CONSOLE_AUTOMATION.md](SEARCH_CONSOLE_AUTOMATION.md)** – Search Console automation

## Integrations

- **[ZAPIER.md](ZAPIER.md)** – Zapier integration and approval
- **[Nocode_Integrations.md](Nocode_Integrations.md)** – No-code platforms (Bubble, Make, etc.)
- **[API_ENDPOINTS.md](API_ENDPOINTS.md)** – API reference
- **[PUBLIC_API_AI_ASSISTANTS.md](PUBLIC_API_AI_ASSISTANTS.md)** – Public QR API for AI tools
- **[INTEGRATION_MAP.md](INTEGRATION_MAP.md)** – Integration overview

## Auth & product

- **[PASSWORD_AUTHENTICATION.md](PASSWORD_AUTHENTICATION.md)** – Password auth
- **[OTP_AUTHENTICATION.md](OTP_AUTHENTICATION.md)** – OTP auth
- **[GITHUB_OAUTH_SETUP.md](GITHUB_OAUTH_SETUP.md)** – GitHub OAuth
- **[TRIAL_DOWNGRADE_SYSTEM.md](TRIAL_DOWNGRADE_SYSTEM.md)** – Trial and downgrade behavior
- **[DATA_MODEL.md](DATA_MODEL.md)** – Database schema
- **[BUSINESS_METRICS.md](BUSINESS_METRICS.md)** – Business metrics

## Features & reference

- **[MENU_BUILDER_FEATURE.md](MENU_BUILDER_FEATURE.md)** – Menu builder
- **[QR_STYLING_SYSTEM.md](QR_STYLING_SYSTEM.md)** – QR styling
- **[CHANGELOG_QR_INPUTS.md](CHANGELOG_QR_INPUTS.md)** – QR input changelog
- **[SIMPLE_SUBDOMAIN_SETUP.md](SIMPLE_SUBDOMAIN_SETUP.md)** – Subdomain setup

## Security & AI

- **[XSS_SECURITY.md](XSS_SECURITY.md)** – XSS/escaping in redirects
- **[XSS_TEST_GUIDE.md](XSS_TEST_GUIDE.md)** – XSS test guide
- **[AI_PROMPT.md](AI_PROMPT.md)** – Project summary for AI agents
- **[AI_ONBOARDING.md](AI_ONBOARDING.md)** – Onboarding for AI assistants

---

## Common tasks

**Deploy**
```bash
cd /home/awilliams && ./theqrcode/setup-cron.sh
```

**Test cron**
```bash
docker exec theqrcode curl http://localhost:3000/api/cron/daily \
  -H "Authorization: Bearer $(docker exec theqrcode printenv CRON_SECRET)"
```

**Logs**
```bash
docker logs -f theqrcode
docker exec theqrcode tail -f /var/log/cron.log
```

**Email templates** – Edit `src/lib/engagement/email-templates.ts` (see ENGAGEMENT_SYSTEM.md).
