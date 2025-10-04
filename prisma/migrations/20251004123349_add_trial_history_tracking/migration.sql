-- CreateTable
CREATE TABLE "public"."TrialHistory" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ipAddress" TEXT,
    "deviceFingerprint" TEXT,
    "userId" TEXT,
    "trialStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trialEndedAt" TIMESTAMP(3),
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrialHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrialHistory_email_idx" ON "public"."TrialHistory"("email");

-- CreateIndex
CREATE INDEX "TrialHistory_ipAddress_idx" ON "public"."TrialHistory"("ipAddress");

-- CreateIndex
CREATE INDEX "TrialHistory_deviceFingerprint_idx" ON "public"."TrialHistory"("deviceFingerprint");
