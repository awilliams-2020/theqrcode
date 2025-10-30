-- Script to manually create analytics notifications based on the mock data
-- This simulates what the analytics notification system would create

-- First, let's check what notifications already exist
SELECT 'Existing notifications:' as info, COUNT(*) as count FROM "Notification" WHERE "userId" = 'cmhbbnryi0000qo4wyyy5o6tj';

-- Clear existing notifications to start fresh
DELETE FROM "Notification" WHERE "userId" = 'cmhbbnryi0000qo4wyyy5o6tj';

-- 1. Create analytics_spike notification based on recent high activity
-- The URL QR code has 153 scans total, with many in the last 2 hours
INSERT INTO "Notification" (id, "userId", type, title, message, priority, "isRead", "createdAt")
VALUES (
    'notif_spike_1',
    'cmhbbnryi0000qo4wyyy5o6tj',
    'analytics_spike',
    '🚀 Traffic Spike Detected!',
    'URL received 80 scans in the last 2 hours (300% above average). Great job!',
    'high',
    false,
    NOW() - INTERVAL '5 minutes'
);

-- 2. Create analytics_location notifications for new countries
INSERT INTO "Notification" (id, "userId", type, title, message, priority, "isRead", "createdAt")
VALUES 
    ('notif_location_1', 'cmhbbnryi0000qo4wyyy5o6tj', 'analytics_location', '🌍 New Location Detected!', 'URL was just scanned in Seoul, South Korea! That''s country #11 for this QR code.', 'normal', false, NOW() - INTERVAL '4 minutes'),
    ('notif_location_2', 'cmhbbnryi0000qo4wyyy5o6tj', 'analytics_location', '🌍 New Location Detected!', 'Contact was just scanned in Mumbai, India! That''s country #12 for this QR code.', 'normal', false, NOW() - INTERVAL '3 minutes'),
    ('notif_location_3', 'cmhbbnryi0000qo4wyyy5o6tj', 'analytics_location', '🌍 New Location Detected!', 'Plain text was just scanned in Mexico City, Mexico! That''s country #13 for this QR code.', 'normal', false, NOW() - INTERVAL '2 minutes');

-- 3. Create analytics_trend notification for mobile dominance
-- 224 mobile scans out of 475 total = 47% mobile, but let's create a trend notification anyway
INSERT INTO "Notification" (id, "userId", type, title, message, priority, "isRead", "createdAt")
VALUES (
    'notif_trend_1',
    'cmhbbnryi0000qo4wyyy5o6tj',
    'analytics_trend',
    '📊 Device Trend Insight',
    '📱 47% of your scans are from mobile devices! Your QR codes are perfect for on-the-go users.',
    'low',
    false,
    NOW() - INTERVAL '1 hour'
);

-- 4. Create analytics_summary notification for hourly activity
INSERT INTO "Notification" (id, "userId", type, title, message, priority, "isRead", "createdAt")
VALUES (
    'notif_summary_1',
    'cmhbbnryi0000qo4wyyy5o6tj',
    'analytics_summary',
    '⏱️ Hourly Analytics Summary',
    'You received 50 scans in the last hour from 8 countries. Top performer: URL (25 scans)',
    'normal',
    false,
    NOW() - INTERVAL '30 minutes'
);

-- 5. Create analytics_record notification for performance record
INSERT INTO "Notification" (id, "userId", type, title, message, priority, "isRead", "createdAt")
VALUES (
    'notif_record_1',
    'cmhbbnryi0000qo4wyyy5o6tj',
    'analytics_record',
    '🏆 New Performance Record!',
    'URL just hit a new record: 40 scans in the last hour! Your best performance yet.',
    'high',
    false,
    NOW() - INTERVAL '15 minutes'
);

-- 6. Create another analytics_spike for high-velocity scanning
INSERT INTO "Notification" (id, "userId", type, title, message, priority, "isRead", "createdAt")
VALUES (
    'notif_velocity_1',
    'cmhbbnryi0000qo4wyyy5o6tj',
    'analytics_spike',
    '⚡ High-Speed Scanning Detected!',
    '⚡ Incredible! 35+ scans in 5 minutes!',
    'urgent',
    false,
    NOW() - INTERVAL '10 minutes'
);

-- 7. Create daily analytics digest
INSERT INTO "Notification" (id, "userId", type, title, message, priority, "isRead", "createdAt")
VALUES (
    'notif_daily_1',
    'cmhbbnryi0000qo4wyyy5o6tj',
    'analytics_summary',
    '📊 Daily Analytics Digest',
    '📈 475 scans today from 11 countries. 200% increase from yesterday.',
    'normal',
    false,
    NOW() - INTERVAL '2 hours'
);

-- 8. Create another location notification for variety
INSERT INTO "Notification" (id, "userId", type, title, message, priority, "isRead", "createdAt")
VALUES (
    'notif_location_4',
    'cmhbbnryi0000qo4wyyy5o6tj',
    'analytics_location',
    '🌍 New Location Detected!',
    'Home WiFi was just scanned in Tokyo, Japan! That''s country #14 for this QR code.',
    'normal',
    false,
    NOW() - INTERVAL '45 minutes'
);

-- 9. Create another performance record for a different QR code
INSERT INTO "Notification" (id, "userId", type, title, message, priority, "isRead", "createdAt")
VALUES (
    'notif_record_2',
    'cmhbbnryi0000qo4wyyy5o6tj',
    'analytics_record',
    '🏆 New Performance Record!',
    'Home WiFi just hit a new record: 30 scans in the last hour! Your best performance yet.',
    'high',
    false,
    NOW() - INTERVAL '1 hour'
);

-- 10. Create a device trend for desktop users
INSERT INTO "Notification" (id, "userId", type, title, message, priority, "isRead", "createdAt")
VALUES (
    'notif_trend_2',
    'cmhbbnryi0000qo4wyyy5o6tj',
    'analytics_trend',
    '📊 Device Trend Insight',
    '💻 19% of your scans are from desktop devices! Consider optimizing for larger screens.',
    'low',
    false,
    NOW() - INTERVAL '3 hours'
);

-- Display the created notifications
SELECT 
    'Created notifications:' as info,
    type,
    title,
    priority,
    "isRead",
    "createdAt"
FROM "Notification" 
WHERE "userId" = 'cmhbbnryi0000qo4wyyy5o6tj'
ORDER BY "createdAt" DESC;

-- Summary
SELECT 
    'Total analytics notifications:' as info,
    COUNT(*) as count
FROM "Notification" 
WHERE "userId" = 'cmhbbnryi0000qo4wyyy5o6tj'
AND type IN ('analytics_spike', 'analytics_location', 'analytics_trend', 'analytics_summary', 'analytics_record');

SELECT 
    'Notifications by type:' as info,
    type,
    COUNT(*) as count
FROM "Notification" 
WHERE "userId" = 'cmhbbnryi0000qo4wyyy5o6tj'
AND type IN ('analytics_spike', 'analytics_location', 'analytics_trend', 'analytics_summary', 'analytics_record')
GROUP BY type
ORDER BY count DESC;
