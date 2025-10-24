# Negative Keywords Examples and Usage

## Quick Start Examples

### 1. Export All Negative Keywords to CSV
```bash
# Export all campaign negatives
node scripts/negative-keywords-manager.js export > negative-keywords-all.csv

# Export account-level negatives only
node scripts/negative-keywords-manager.js export account > account-negatives.csv
```

### 2. Export Specific Campaign Negatives
```bash
# Export brand protection campaign negatives
node scripts/negative-keywords-manager.js export brand-protection > brand-protection-negatives.csv

# Export only broad match negatives for business campaign
node scripts/negative-keywords-manager.js export business-enterprise broad > business-broad-negatives.csv
```

### 3. View Statistics
```bash
# Show all statistics
node scripts/negative-keywords-manager.js stats
```

### 4. List Campaign Negatives
```bash
# List all campaigns
node scripts/negative-keywords-manager.js list

# List specific campaign negatives
node scripts/negative-keywords-manager.js list brand-protection
```

### 5. Manage Negative Keywords
```bash
# Add new negative keyword
node scripts/negative-keywords-manager.js add brand-protection broad "competitor name"

# Remove negative keyword
node scripts/negative-keywords-manager.js remove brand-protection broad "old keyword"
```

## Google Ads Import Process

### Step 1: Export Negatives
```bash
# Export all negatives
node scripts/negative-keywords-manager.js export > all-negatives.csv
```

### Step 2: Import to Google Ads
1. Go to Google Ads → Keywords → Negative keywords
2. Click "Add negative keywords"
3. Choose "Upload a file"
4. Upload the CSV file
5. Review and apply

### Step 3: Verify Import
1. Check that negatives are applied correctly
2. Verify match types are correct
3. Confirm campaign assignments

## Campaign-Specific Implementation

### Brand Protection Campaign
```bash
# Export brand protection negatives
node scripts/negative-keywords-manager.js export brand-protection > brand-protection.csv
```

**Expected Output**:
```csv
Campaign,Ad Group,Match Type,Negative Keyword
brand-protection,,broad,qr code generator without registration
brand-protection,,broad,qr code generator offline
brand-protection,,broad,qr code generator download
brand-protection,,broad,qr code generator app
brand-protection,,broad,qr code generator mobile
brand-protection,,phrase,free qr code generator
brand-protection,,phrase,qr code generator free
brand-protection,,exact,qr-code-generator
brand-protection,,exact,qr-code-monkey
```

### High-Intent Generator Campaign
```bash
# Export high-intent negatives
node scripts/negative-keywords-manager.js export high-intent-generator > high-intent-negatives.csv
```

### Business/Enterprise Campaign
```bash
# Export business campaign negatives
node scripts/negative-keywords-manager.js export business-enterprise > business-negatives.csv
```

## Monitoring and Optimization

### Weekly Review Process
1. **Export current negatives**:
   ```bash
   node scripts/negative-keywords-manager.js export > current-negatives.csv
   ```

2. **Check statistics**:
   ```bash
   node scripts/negative-keywords-manager.js stats
   ```

3. **Add new negatives based on search terms report**:
   ```bash
   # Add new competitor
   node scripts/negative-keywords-manager.js add brand-protection exact "new-competitor"
   
   # Add new irrelevant term
   node scripts/negative-keywords-manager.js add high-intent-generator broad "irrelevant term"
   ```

### Monthly Optimization
1. **Review all campaigns**:
   ```bash
   # List all campaigns
   node scripts/negative-keywords-manager.js list
   
   # Check each campaign
   node scripts/negative-keywords-manager.js list brand-protection
   node scripts/negative-keywords-manager.js list high-intent-generator
   node scripts/negative-keywords-manager.js list business-enterprise
   ```

2. **Remove outdated negatives**:
   ```bash
   # Remove outdated competitor
   node scripts/negative-keywords-manager.js remove brand-protection exact "old-competitor"
   ```

## Advanced Usage

### Custom Campaign Setup
```bash
# Add new campaign
node scripts/negative-keywords-manager.js add new-campaign broad "first negative"
node scripts/negative-keywords-manager.js add new-campaign phrase "second negative"
node scripts/negative-keywords-manager.js add new-campaign exact "third negative"
```

### Bulk Operations
```bash
# Export specific match types
node scripts/negative-keywords-manager.js export brand-protection broad > brand-broad.csv
node scripts/negative-keywords-manager.js export brand-protection phrase > brand-phrase.csv
node scripts/negative-keywords-manager.js export brand-protection exact > brand-exact.csv
```

### Integration with Google Ads API
```bash
# Export for API integration
node scripts/negative-keywords-manager.js export > api-import.csv
# Process CSV with Google Ads API
```

## Troubleshooting

### Common Issues

1. **Script not found**:
   ```bash
   # Make sure you're in the project directory
   cd /home/awilliams/theqrcode
   node scripts/negative-keywords-manager.js stats
   ```

2. **Permission denied**:
   ```bash
   # Make script executable
   chmod +x scripts/negative-keywords-manager.js
   ```

3. **Campaign not found**:
   ```bash
   # List available campaigns
   node scripts/negative-keywords-manager.js list
   ```

### Validation

1. **Check CSV format**:
   ```bash
   # Export and verify format
   node scripts/negative-keywords-manager.js export > test.csv
   head -5 test.csv
   ```

2. **Verify statistics**:
   ```bash
   # Check stats make sense
   node scripts/negative-keywords-manager.js stats
   ```

## Best Practices

### 1. Start Small
- Begin with account-level negatives
- Add campaign-specific negatives gradually
- Monitor performance before adding more

### 2. Regular Review
- Weekly: Check search terms report
- Monthly: Review all negatives
- Quarterly: Comprehensive optimization

### 3. Documentation
- Keep track of why each negative was added
- Document performance impact
- Record changes and results

### 4. Testing
- Test new negatives on small budgets first
- Monitor impact on relevant traffic
- Be ready to remove if performance drops

## Performance Tracking

### Before Implementation
- Record baseline metrics
- Note current CTR, CPC, conversions
- Document impression share

### After Implementation
- Compare metrics after 1 week
- Check for improvements in CTR
- Monitor cost per conversion
- Verify impression share maintained

### Success Indicators
- CTR increases by 10-20%
- CPC decreases by 15-25%
- Quality score improves
- Conversions maintain or increase
