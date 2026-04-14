-- Backfill lastLoginAt for users who have NULL (e.g. OAuth signups before fix).
-- Skip deleted users (isDeleted = true).
UPDATE "User"
SET "lastLoginAt" = "createdAt"
WHERE "lastLoginAt" IS NULL
  AND "isDeleted" = false;
