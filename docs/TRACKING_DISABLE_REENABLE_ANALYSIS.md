# Tracking Disable/Re-enable Workflow Analysis

## Issue Summary

**Question:** When a user creates a dynamic QR code, it gets scanned, then tracking is disabled and re-enabled, will this generate a new shortcode orphaning tracking associated with the original shortcode?

**Answer:** ~~**YES** - This will generate a new shortcode, orphaning the original shortcode URL.~~ **FIXED** - The shortcode is now preserved when tracking is disabled and re-enabled.

## Workflow Analysis

### Step 1: User Creates Dynamic QR Code
**Location:** `src/app/api/qr-codes/route.ts` (lines 130-138)

When a dynamic QR code is created (`isDynamic: true`):
- A unique shortcode is generated via `URLShortener.generateShortUrl(qrCodeId)`
- Example: `shortUrl = "https://theqrcode.io/r/ABC123"`
- The `shortUrl` is stored in the database

### Step 2: QR Code Gets Scanned
**Location:** `src/app/api/track/[shortCode]/route.ts` (line 172)

When a QR code is scanned:
- The track endpoint looks up the QR code by `shortUrl`: `where: { shortUrl }`
- Scans are recorded in the `Scan` table with `qrCodeId` (not shortCode)
- Scans remain linked to the QR code via `qrCodeId` foreign key

### Step 3: User Disables Tracking
**Location:** `src/app/api/qr-codes/[id]/route.ts` (lines 71-77)

When tracking is disabled (`isDynamic: false`):
```typescript
// Handle short URL for dynamic QR codes
// Preserve existing shortUrl when disabling/re-enabling tracking to prevent orphaned shortcodes
let shortUrl = qrCode.shortUrl
if (isDynamic && !shortUrl) {
  // Generate short URL only if dynamic tracking is enabled and no shortUrl exists
  shortUrl = await URLShortener.generateShortUrl(id)
}
// Note: We preserve shortUrl even when isDynamic is false to maintain shortcode continuity
```
- The `shortUrl` field is **preserved** in the database (not set to null)
- The shortcode URL remains valid and functional
- Scans are not recorded when `isDynamic` is false (see POST endpoint check)

### Step 4: User Re-enables Tracking
**Location:** `src/app/api/qr-codes/[id]/route.ts` (lines 73-75)

When tracking is re-enabled (`isDynamic: true`):
```typescript
if (isDynamic && !shortUrl) {
  // Generate short URL only if dynamic tracking is enabled and no shortUrl exists
  shortUrl = await URLShortener.generateShortUrl(id)
}
```
- Since `shortUrl` is preserved, the **original** shortcode is reused
- Example: Original `shortUrl = "https://theqrcode.io/r/ABC123"` is maintained
- The shortcode is **NOT orphaned** - it continues to work

## Impact Analysis

### What Gets Orphaned
1. **Old Shortcode URL** (`/r/ABC123`):
   - Returns 404 "QR Code Not Found" when accessed
   - No longer resolves to the QR code content
   - Physical QR codes printed with this URL become broken

2. **Scan Tracking Data**:
   - ✅ **NOT orphaned** - Scans remain linked via `qrCodeId`
   - Scans are still associated with the QR code record
   - Analytics data is preserved

### Database Schema Reference
**Location:** `prisma/schema.prisma`

```prisma
model QrCode {
  id        String    @id @default(cuid())
  shortUrl  String?   @unique  // Can be null when tracking disabled
  isDynamic Boolean   @default(false)
  scans     Scan[]    // Linked via qrCodeId, not shortCode
}

model Scan {
  id        String   @id @default(cuid())
  qrCodeId  String   // Foreign key to QrCode.id
  qrCode    QrCode   @relation(fields: [qrCodeId], references: [id])
}
```

## Code Locations

### Key Files
1. **QR Code Creation:** `src/app/api/qr-codes/route.ts` (lines 130-138)
2. **QR Code Update:** `src/app/api/qr-codes/[id]/route.ts` (lines 72-79)
3. **Shortcode Generation:** `src/lib/url-shortener.ts` (lines 14-30)
4. **Track Endpoint:** `src/app/api/track/[shortCode]/route.ts` (line 172)

## Recommendations

### Option 1: Preserve Shortcode on Re-enable (Recommended)
Modify the update logic to preserve the existing shortcode if it was previously set:

```typescript
// In src/app/api/qr-codes/[id]/route.ts
let shortUrl = qrCode.shortUrl
if (isDynamic && !shortUrl) {
  // Only generate new short URL if one never existed
  shortUrl = await URLShortener.generateShortUrl(id)
} else if (!isDynamic && shortUrl) {
  // Optionally: Keep shortUrl but mark as inactive
  // OR: Set to null to disable tracking
  shortUrl = null
}
```

**Problem:** This doesn't solve the issue - we need to track if a shortcode was previously generated.

### Option 2: Track Shortcode History
Add a field to track the original shortcode:

```prisma
model QrCode {
  shortUrl      String?   @unique
  originalShortUrl String?  // Preserve original shortcode
}
```

Then on re-enable:
```typescript
if (isDynamic && !shortUrl) {
  // Restore original shortcode if it exists
  shortUrl = qrCode.originalShortUrl || await URLShortener.generateShortUrl(id)
  if (!qrCode.originalShortUrl) {
    // Store as original on first generation
    originalShortUrl = shortUrl
  }
}
```

### Option 3: Never Null Shortcode (Best Solution)
Once a shortcode is generated for a dynamic QR code, never set it to null:

```typescript
// In src/app/api/qr-codes/[id]/route.ts
let shortUrl = qrCode.shortUrl
if (isDynamic && !shortUrl) {
  // Generate short URL for newly enabled dynamic QR codes
  shortUrl = await URLShortener.generateShortUrl(id)
}
// Don't set shortUrl to null when disabling - keep it for future re-enable
// Instead, track tracking state separately in settings
```

This requires adding a separate tracking enabled/disabled flag in settings rather than relying solely on `isDynamic`.

## Implementation Fix

### Changes Made

1. **Preserve Shortcode on Disable** (`src/app/api/qr-codes/[id]/route.ts`):
   - Removed logic that set `shortUrl` to `null` when disabling tracking
   - Shortcode is now preserved even when `isDynamic` is false

2. **Respect Tracking State** (`src/app/api/track/[shortCode]/route.ts`):
   - Added check in POST endpoint to skip scan recording when `isDynamic` is false
   - Shortcode URL still works and redirects, but scans are not recorded

### Current Behavior Summary (After Fix)

✅ **Scans are preserved** - Linked via `qrCodeId`, not shortcode  
✅ **Shortcode URL is preserved** - Original shortcode continues to work  
✅ **Physical QR codes continue working** - Printed QR codes remain functional  
✅ **Tracking respects isDynamic flag** - Scans only recorded when tracking is enabled

## Testing Scenario

To verify the fix:

1. Create a dynamic QR code → Note the shortcode (e.g., `ABC123`)
2. Scan the QR code → Verify scan is recorded
3. Disable tracking (`isDynamic: false`) → Verify `shortUrl` is **preserved** (not null)
4. Scan the QR code again → Verify scan is **NOT recorded** (tracking disabled)
5. Access shortcode `/r/ABC123` → Should still redirect to content (not 404)
6. Re-enable tracking (`isDynamic: true`) → Verify **same** shortcode is used (`ABC123`)
7. Scan the QR code again → Verify scan is now recorded
8. Check scans → Should show scans from before disable, gap during disable, and scans after re-enable

