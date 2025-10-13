-- Add isAdmin column to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- Optional: Set a specific user as admin by email
-- UPDATE "User" SET "isAdmin" = true WHERE email = 'your-email@example.com';

