-- Migration: Add trial fields to Subscription table
-- To apply: Run `npx prisma migrate dev --name add_trial_fields` when database is running

-- Add trialEndsAt column to Subscription table
ALTER TABLE "public"."Subscription" 
ADD COLUMN IF NOT EXISTS "trialEndsAt" TIMESTAMP(3);

-- Update the status comment to include 'trialing' status
COMMENT ON COLUMN "public"."Subscription"."status" IS 'Subscription status: active, canceled, past_due, or trialing';

-- Optional: Update existing free plan users to trialing status with 14-day trial
-- Uncomment if you want to give existing users a trial period
-- UPDATE "public"."Subscription" 
-- SET 
--   "status" = 'trialing',
--   "trialEndsAt" = NOW() + INTERVAL '14 days'
-- WHERE "plan" = 'free' AND "status" = 'active' AND "trialEndsAt" IS NULL;

