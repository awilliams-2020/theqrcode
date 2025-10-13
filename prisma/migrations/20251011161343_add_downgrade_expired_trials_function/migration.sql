-- Create an index on trialEndsAt for faster expired trial queries
CREATE INDEX IF NOT EXISTS "Subscription_trialEndsAt_status_idx" 
ON "Subscription" ("trialEndsAt", "status") 
WHERE "trialEndsAt" IS NOT NULL;
