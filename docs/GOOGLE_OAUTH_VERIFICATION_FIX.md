# Google OAuth Verification Fix

## The Problem
You're getting "Error 403: access_denied" because your Google OAuth app is in testing mode and needs proper configuration.

## Solution Steps

### Step 1: Configure OAuth Consent Screen

1. **Go to Google Cloud Console**
   - Navigate to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project

2. **Go to OAuth Consent Screen**
   - APIs & Services → OAuth consent screen

3. **Configure App Information**
   - **App name**: The QR Code (or your preferred name)
   - **User support email**: Your support email
   - **Developer contact information**: Your email
   - **App domain**: 
     - Homepage URL: `https://theqrcode.io`
     - Privacy policy URL: `https://theqrcode.io/privacy`
     - Terms of service URL: `https://theqrcode.io/terms`

4. **Add Required Scopes**
   - Click "Add or Remove Scopes"
   - Add these scopes:
     ```
     https://www.googleapis.com/auth/userinfo.email
     https://www.googleapis.com/auth/userinfo.profile
     https://www.googleapis.com/auth/webmasters.readonly
     ```
   - Click "Update"

### Step 2: Add Test Users (For Development)

1. **In OAuth Consent Screen**
   - Scroll to "Test users"
   - Click "Add Users"
   - Add your email address
   - Add any other test users who need access

2. **Save Changes**
   - Click "Save and Continue"
   - Go through all the steps and save

### Step 3: Configure OAuth Credentials

1. **Go to Credentials**
   - APIs & Services → Credentials

2. **Edit Your OAuth 2.0 Client ID**
   - Click on your existing OAuth client
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/callback/google
     https://theqrcode.io/api/auth/callback/google
     ```
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://theqrcode.io
     ```

### Step 4: For Production (Optional)

If you want to make this available to all users (not just test users):

1. **Submit for Verification**
   - In OAuth Consent Screen, click "Publish App"
   - This will make it available to all users
   - **Note**: This may require Google's review process for sensitive scopes

2. **Alternative: Keep in Testing Mode**
   - Add all your users as test users
   - This is fine for most applications

### Step 5: Update Environment Variables

Make sure your environment variables are correct:

```env
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

### Step 6: Test the Fix

1. **Restart your application**
   ```bash
   docker restart theqrcode-dev
   ```

2. **Clear browser cache/cookies**
   - Clear all cookies for your domain
   - Or use incognito/private browsing

3. **Sign in again**
   - Go to your app
   - Sign out completely
   - Sign back in with Google
   - You should see the new permission request

## Troubleshooting

### Still Getting 403 Error?

1. **Check Test Users**
   - Make sure your email is in the test users list
   - Make sure you're signed in with the same Google account

2. **Check Scopes**
   - Verify the scopes are correctly added
   - Make sure you're using `webmasters.readonly` (not just `webmasters`)

3. **Check Redirect URIs**
   - Make sure both localhost and production URLs are added
   - Check for typos in the URLs

### "This app isn't verified" Warning

This is normal for apps in testing mode. You can:
- Click "Advanced" → "Go to [app name] (unsafe)"
- Or add your domain to the authorized domains list

### Token Still Invalid?

1. **Force re-authorization**
   - Sign out completely
   - Clear browser data
   - Sign back in

2. **Check token in database**
   - Use the debug endpoint: `/api/debug/google-token`
   - Check if the token has the correct scope

## Production Considerations

### For Production Deployment

1. **Domain Verification**
   - Verify your domain in Google Search Console
   - Add your domain to authorized domains

2. **App Verification (Optional)**
   - Submit your app for Google verification
   - This removes the "unverified app" warning
   - Required for sensitive scopes in production

3. **Security**
   - Keep your client secret secure
   - Use environment variables
   - Don't commit secrets to version control

## Quick Checklist

- [ ] OAuth consent screen configured
- [ ] Required scopes added
- [ ] Test users added (including your email)
- [ ] Redirect URIs configured correctly
- [ ] Environment variables set
- [ ] Application restarted
- [ ] Browser cache cleared
- [ ] Re-authorized with Google

## Testing

After completing these steps:

1. Go to `/admin` in your app
2. Click on "Search Console" tab
3. You should see your Search Console properties
4. No more 403 errors!

If you still have issues, check the debug endpoints:
- `/api/debug/google-token` - Check token status
- `/api/debug/search-console-test` - Test API access
