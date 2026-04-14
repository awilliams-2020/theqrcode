-- Add signupRequestedPlan column to User table.
-- Stores the plan requested at signup (e.g. 'starter', 'pro') so the resend
-- verification link can include it. Cleared after email verification.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "signupRequestedPlan" TEXT;
