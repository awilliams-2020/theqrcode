-- CreateTable
CREATE TABLE "public"."UptimeCheck" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "responseTime" INTEGER,
    "statusCode" INTEGER,
    "errorMessage" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UptimeCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DowntimeIncident" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "cause" TEXT,
    "affectedPaths" TEXT[],
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "DowntimeIncident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UptimeCheck_checkedAt_idx" ON "public"."UptimeCheck"("checkedAt");

-- CreateIndex
CREATE INDEX "UptimeCheck_status_checkedAt_idx" ON "public"."UptimeCheck"("status", "checkedAt");

-- CreateIndex
CREATE INDEX "DowntimeIncident_startedAt_idx" ON "public"."DowntimeIncident"("startedAt");

-- CreateIndex
CREATE INDEX "DowntimeIncident_resolved_startedAt_idx" ON "public"."DowntimeIncident"("resolved", "startedAt");
