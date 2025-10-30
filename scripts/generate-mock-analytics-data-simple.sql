-- Mock Analytics Data Generator for theqrcode-dev
-- This script generates realistic scan data to trigger various analytics notifications

-- Clear existing scans to start fresh
DELETE FROM "Scan";

-- Insert mock scan data that will trigger various analytics notifications
-- We'll create data over the past 7 days with different patterns

-- 1. HISTORICAL DATA (Past 6 days) - Normal baseline activity
-- This creates a baseline for spike detection (about 30 scans per day)

INSERT INTO "Scan" (id, "qrCodeId", "ipAddress", "userAgent", country, city, device, os, browser, referrer, "scannedAt")
SELECT 
    'hist_' || (row_number() OVER ())::text,
    CASE (random() * 4)::int
        WHEN 0 THEN 'cmhcltuuj0001ok4y1uqxo3v5' -- URL
        WHEN 1 THEN 'cmhclyyqa0007ok4y10gf9l99' -- Home WiFi
        WHEN 2 THEN 'cmhcn3b9d0001ph4y0v623yep' -- Contact
        WHEN 3 THEN 'cmhcn3wjl0003ph4y228cofrm' -- Plain text
        ELSE 'cmhcn47wg0005ph4y7w8c7lp6' -- Email
    END,
    '192.168.1.' || (random() * 255)::int,
    CASE (random() * 3)::int
        WHEN 0 THEN 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
        WHEN 1 THEN 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        ELSE 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    END,
    CASE (random() * 8)::int
        WHEN 0 THEN 'United States'
        WHEN 1 THEN 'Canada'
        WHEN 2 THEN 'United Kingdom'
        WHEN 3 THEN 'Germany'
        WHEN 4 THEN 'France'
        WHEN 5 THEN 'Australia'
        WHEN 6 THEN 'Japan'
        ELSE 'Brazil'
    END,
    CASE (random() * 8)::int
        WHEN 0 THEN 'New York'
        WHEN 1 THEN 'Toronto'
        WHEN 2 THEN 'London'
        WHEN 3 THEN 'Berlin'
        WHEN 4 THEN 'Paris'
        WHEN 5 THEN 'Sydney'
        WHEN 6 THEN 'Tokyo'
        ELSE 'São Paulo'
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'mobile'
        WHEN 1 THEN 'desktop'
        ELSE 'tablet'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'iOS'
        WHEN 1 THEN 'Android'
        WHEN 2 THEN 'Windows'
        ELSE 'macOS'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'Safari'
        WHEN 1 THEN 'Chrome'
        WHEN 2 THEN 'Firefox'
        ELSE 'Edge'
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'https://google.com'
        WHEN 1 THEN 'https://facebook.com'
        ELSE NULL
    END,
    NOW() - INTERVAL '6 days' + (random() * INTERVAL '6 days')
FROM generate_series(1, 180);

-- 2. TODAY'S NORMAL ACTIVITY (Morning and afternoon)
-- This creates normal daily activity

INSERT INTO "Scan" (id, "qrCodeId", "ipAddress", "userAgent", country, city, device, os, browser, referrer, "scannedAt")
SELECT 
    'today_' || (row_number() OVER ())::text,
    CASE (random() * 4)::int
        WHEN 0 THEN 'cmhcltuuj0001ok4y1uqxo3v5' -- URL
        WHEN 1 THEN 'cmhclyyqa0007ok4y10gf9l99' -- Home WiFi
        WHEN 2 THEN 'cmhcn3b9d0001ph4y0v623yep' -- Contact
        WHEN 3 THEN 'cmhcn3wjl0003ph4y228cofrm' -- Plain text
        ELSE 'cmhcn47wg0005ph4y7w8c7lp6' -- Email
    END,
    '192.168.1.' || (random() * 255)::int,
    CASE (random() * 3)::int
        WHEN 0 THEN 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
        WHEN 1 THEN 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        ELSE 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    END,
    'United States',
    CASE (random() * 4)::int
        WHEN 0 THEN 'New York'
        WHEN 1 THEN 'Los Angeles'
        WHEN 2 THEN 'Chicago'
        ELSE 'Miami'
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'mobile'
        WHEN 1 THEN 'desktop'
        ELSE 'tablet'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'iOS'
        WHEN 1 THEN 'Android'
        WHEN 2 THEN 'Windows'
        ELSE 'macOS'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'Safari'
        WHEN 1 THEN 'Chrome'
        WHEN 2 THEN 'Firefox'
        ELSE 'Edge'
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'https://google.com'
        WHEN 1 THEN 'https://facebook.com'
        ELSE NULL
    END,
    NOW() - INTERVAL '8 hours' + (random() * INTERVAL '8 hours')
FROM generate_series(1, 40);

-- 3. TRAFFIC SPIKE DATA (Last 2 hours) - This will trigger analytics_spike notifications
-- Create a massive spike in the last 2 hours to trigger spike detection

INSERT INTO "Scan" (id, "qrCodeId", "ipAddress", "userAgent", country, city, device, os, browser, referrer, "scannedAt")
SELECT 
    'spike_' || (row_number() OVER ())::text,
    'cmhcltuuj0001ok4y1uqxo3v5', -- Focus on URL QR code for the spike
    '192.168.1.' || (random() * 255)::int,
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    'United States',
    'New York',
    'mobile',
    'iOS',
    'Safari',
    'https://instagram.com',
    NOW() - INTERVAL '2 hours' + (random() * INTERVAL '2 hours')
FROM generate_series(1, 80);

-- 4. HIGH VELOCITY SCANNING (Last 30 minutes) - This will trigger high-speed alerts
-- Create very recent high-velocity scans

INSERT INTO "Scan" (id, "qrCodeId", "ipAddress", "userAgent", country, city, device, os, browser, referrer, "scannedAt")
SELECT 
    'velocity_' || (row_number() OVER ())::text,
    'cmhclyyqa0007ok4y10gf9l99', -- Home WiFi QR code
    '192.168.1.' || (random() * 255)::int,
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    'United States',
    'Los Angeles',
    'mobile',
    'iOS',
    'Safari',
    'https://facebook.com',
    NOW() - INTERVAL '30 minutes' + (random() * INTERVAL '30 minutes')
FROM generate_series(1, 35);

-- 5. NEW LOCATION SCANS (Very recent) - This will trigger analytics_location notifications
-- Add scans from countries that haven't been seen before

INSERT INTO "Scan" (id, "qrCodeId", "ipAddress", "userAgent", country, city, device, os, browser, referrer, "scannedAt")
VALUES
    ('new_loc_1', 'cmhcltuuj0001ok4y1uqxo3v5', '203.0.113.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', 'South Korea', 'Seoul', 'mobile', 'iOS', 'Safari', 'https://google.com', NOW() - INTERVAL '5 minutes'),
    ('new_loc_2', 'cmhcltuuj0001ok4y1uqxo3v5', '203.0.113.2', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', 'South Korea', 'Seoul', 'mobile', 'iOS', 'Safari', 'https://google.com', NOW() - INTERVAL '4 minutes'),
    ('new_loc_3', 'cmhcn3b9d0001ph4y0v623yep', '203.0.113.3', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', 'India', 'Mumbai', 'mobile', 'Android', 'Chrome', 'https://facebook.com', NOW() - INTERVAL '3 minutes'),
    ('new_loc_4', 'cmhcn3b9d0001ph4y0v623yep', '203.0.113.4', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', 'India', 'Mumbai', 'mobile', 'Android', 'Chrome', 'https://facebook.com', NOW() - INTERVAL '2 minutes'),
    ('new_loc_5', 'cmhcn3wjl0003ph4y228cofrm', '203.0.113.5', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', 'Mexico', 'Mexico City', 'mobile', 'iOS', 'Safari', 'https://instagram.com', NOW() - INTERVAL '1 minute');

-- 6. DEVICE TREND DATA - Create strong mobile trend (80%+ mobile)
-- This will trigger analytics_trend notifications

INSERT INTO "Scan" (id, "qrCodeId", "ipAddress", "userAgent", country, city, device, os, browser, referrer, "scannedAt")
SELECT 
    'mobile_' || (row_number() OVER ())::text,
    CASE (random() * 4)::int
        WHEN 0 THEN 'cmhcltuuj0001ok4y1uqxo3v5'
        WHEN 1 THEN 'cmhclyyqa0007ok4y10gf9l99'
        WHEN 2 THEN 'cmhcn3b9d0001ph4y0v623yep'
        WHEN 3 THEN 'cmhcn3wjl0003ph4y228cofrm'
        ELSE 'cmhcn47wg0005ph4y7w8c7lp6'
    END,
    '192.168.1.' || (random() * 255)::int,
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    'United States',
    CASE (random() * 4)::int
        WHEN 0 THEN 'New York'
        WHEN 1 THEN 'Los Angeles'
        WHEN 2 THEN 'Chicago'
        ELSE 'Miami'
    END,
    'mobile', -- Force mobile for trend
    'iOS',
    'Safari',
    'https://instagram.com',
    NOW() - INTERVAL '4 hours' + (random() * INTERVAL '4 hours')
FROM generate_series(1, 45);

-- 7. PERFORMANCE RECORD DATA - Create a new hourly record
-- This will trigger analytics_record notifications

INSERT INTO "Scan" (id, "qrCodeId", "ipAddress", "userAgent", country, city, device, os, browser, referrer, "scannedAt")
SELECT 
    'record_' || (row_number() OVER ())::text,
    'cmhcltuuj0001ok4y1uqxo3v5', -- Focus on URL QR code for the record
    '192.168.1.' || (random() * 255)::int,
    CASE (random() * 3)::int
        WHEN 0 THEN 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
        WHEN 1 THEN 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
        ELSE 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    END,
    'United States',
    'New York',
    CASE (random() * 3)::int
        WHEN 0 THEN 'mobile'
        WHEN 1 THEN 'desktop'
        ELSE 'tablet'
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'iOS'
        WHEN 1 THEN 'Android'
        ELSE 'Windows'
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'Safari'
        WHEN 1 THEN 'Chrome'
        ELSE 'Firefox'
    END,
    'https://twitter.com',
    NOW() - INTERVAL '1 hour' + (random() * INTERVAL '1 hour')
FROM generate_series(1, 40);

-- 8. RECENT SCANS (Last 10 minutes) - For real-time display
-- These will show up in the live activity feed

INSERT INTO "Scan" (id, "qrCodeId", "ipAddress", "userAgent", country, city, device, os, browser, referrer, "scannedAt")
SELECT 
    'recent_' || (row_number() OVER ())::text,
    CASE (random() * 4)::int
        WHEN 0 THEN 'cmhcltuuj0001ok4y1uqxo3v5'
        WHEN 1 THEN 'cmhclyyqa0007ok4y10gf9l99'
        WHEN 2 THEN 'cmhcn3b9d0001ph4y0v623yep'
        WHEN 3 THEN 'cmhcn3wjl0003ph4y228cofrm'
        ELSE 'cmhcn47wg0005ph4y7w8c7lp6'
    END,
    '192.168.1.' || (random() * 255)::int,
    CASE (random() * 3)::int
        WHEN 0 THEN 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
        WHEN 1 THEN 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
        ELSE 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    END,
    CASE (random() * 6)::int
        WHEN 0 THEN 'United States'
        WHEN 1 THEN 'Canada'
        WHEN 2 THEN 'United Kingdom'
        WHEN 3 THEN 'Germany'
        WHEN 4 THEN 'France'
        ELSE 'Australia'
    END,
    CASE (random() * 6)::int
        WHEN 0 THEN 'New York'
        WHEN 1 THEN 'Toronto'
        WHEN 2 THEN 'London'
        WHEN 3 THEN 'Berlin'
        WHEN 4 THEN 'Paris'
        ELSE 'Sydney'
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'mobile'
        WHEN 1 THEN 'desktop'
        ELSE 'tablet'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'iOS'
        WHEN 1 THEN 'Android'
        WHEN 2 THEN 'Windows'
        ELSE 'macOS'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'Safari'
        WHEN 1 THEN 'Chrome'
        WHEN 2 THEN 'Firefox'
        ELSE 'Edge'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'https://google.com'
        WHEN 1 THEN 'https://facebook.com'
        WHEN 2 THEN 'https://instagram.com'
        ELSE 'https://twitter.com'
    END,
    NOW() - INTERVAL '10 minutes' + (random() * INTERVAL '10 minutes')
FROM generate_series(1, 15);

-- 9. Create some additional scans from the past hour to ensure we have enough data for hourly summaries
INSERT INTO "Scan" (id, "qrCodeId", "ipAddress", "userAgent", country, city, device, os, browser, referrer, "scannedAt")
SELECT 
    'hourly_' || (row_number() OVER ())::text,
    CASE (random() * 4)::int
        WHEN 0 THEN 'cmhcltuuj0001ok4y1uqxo3v5'
        WHEN 1 THEN 'cmhclyyqa0007ok4y10gf9l99'
        WHEN 2 THEN 'cmhcn3b9d0001ph4y0v623yep'
        WHEN 3 THEN 'cmhcn3wjl0003ph4y228cofrm'
        ELSE 'cmhcn47wg0005ph4y7w8c7lp6'
    END,
    '192.168.1.' || (random() * 255)::int,
    CASE (random() * 3)::int
        WHEN 0 THEN 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
        WHEN 1 THEN 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
        ELSE 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    END,
    CASE (random() * 8)::int
        WHEN 0 THEN 'United States'
        WHEN 1 THEN 'Canada'
        WHEN 2 THEN 'United Kingdom'
        WHEN 3 THEN 'Germany'
        WHEN 4 THEN 'France'
        WHEN 5 THEN 'Australia'
        WHEN 6 THEN 'Japan'
        ELSE 'Brazil'
    END,
    CASE (random() * 8)::int
        WHEN 0 THEN 'New York'
        WHEN 1 THEN 'Toronto'
        WHEN 2 THEN 'London'
        WHEN 3 THEN 'Berlin'
        WHEN 4 THEN 'Paris'
        WHEN 5 THEN 'Sydney'
        WHEN 6 THEN 'Tokyo'
        ELSE 'São Paulo'
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'mobile'
        WHEN 1 THEN 'desktop'
        ELSE 'tablet'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'iOS'
        WHEN 1 THEN 'Android'
        WHEN 2 THEN 'Windows'
        ELSE 'macOS'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'Safari'
        WHEN 1 THEN 'Chrome'
        WHEN 2 THEN 'Firefox'
        ELSE 'Edge'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'https://google.com'
        WHEN 1 THEN 'https://facebook.com'
        WHEN 2 THEN 'https://instagram.com'
        ELSE 'https://twitter.com'
    END,
    NOW() - INTERVAL '1 hour' + (random() * INTERVAL '1 hour')
FROM generate_series(1, 35);

-- Summary of what this script creates:
-- 1. 180 historical scans (past 6 days) - baseline for spike detection
-- 2. 40 normal daily scans (past 8 hours)
-- 3. 80 spike scans (past 2 hours) - triggers analytics_spike
-- 4. 35 high-velocity scans (past 30 minutes) - triggers high-speed alerts
-- 5. 5 new location scans (very recent) - triggers analytics_location
-- 6. 45 mobile trend scans (past 4 hours) - triggers analytics_trend
-- 7. 40 performance record scans (past 1 hour) - triggers analytics_record
-- 8. 15 recent scans (past 10 minutes) - for live activity feed
-- 9. 35 additional hourly scans - for hourly summaries

-- Total: ~475 scans that should trigger multiple analytics notifications

-- Display summary
SELECT 
    'Total scans created: ' || COUNT(*) as summary
FROM "Scan";

SELECT 
    'Scans by QR Code:' as info,
    qr.name,
    COUNT(s.id) as scan_count
FROM "Scan" s
JOIN "QrCode" qr ON s."qrCodeId" = qr.id
GROUP BY qr.id, qr.name
ORDER BY scan_count DESC;

SELECT 
    'Scans by Country:' as info,
    country,
    COUNT(*) as scan_count
FROM "Scan"
WHERE country IS NOT NULL
GROUP BY country
ORDER BY scan_count DESC;

SELECT 
    'Scans by Device:' as info,
    device,
    COUNT(*) as scan_count
FROM "Scan"
WHERE device IS NOT NULL
GROUP BY device
ORDER BY scan_count DESC;
