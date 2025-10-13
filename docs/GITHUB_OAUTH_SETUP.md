# GitHub OAuth Setup Guide

This guide will help you set up GitHub OAuth for your application.

## Step 1: Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on **"New OAuth App"** (or **"New GitHub App"** for more features)
3. Fill in the application details:
   - **Application name**: Your App Name (or your preferred name)
   - **Homepage URL**: `https://yourdomain.com` (or `http://localhost:3000` for development)
   - **Application description**: (Optional) QR Code Analytics Platform
   - **Authorization callback URL**: 
     - Production: `https://yourdomain.com/api/auth/callback/github`
     - Development: `http://localhost:3000/api/auth/callback/github`
4. Click **"Register application"**

## Step 2: Get Your Credentials

After creating the app:

1. You'll see your **Client ID** - copy this
2. Click **"Generate a new client secret"**
3. Copy the **Client Secret** (you won't be able to see it again!)

## Step 3: Add Credentials to Environment Variables

Add these to your `.env` or `.env.local` file:

```bash
GITHUB_CLIENT_ID="your-client-id-here"
GITHUB_CLIENT_SECRET="your-client-secret-here"
```

## Step 4: Test the Integration

1. Restart your development server
2. Navigate to `/auth/signin` or `/auth/signup`
3. You should see both "Continue with Google" and "Continue with GitHub" buttons
4. Click "Continue with GitHub" to test the flow

## Callback URLs for Different Environments

### Development
```
http://localhost:3000/api/auth/callback/github
```

### Production
```
https://yourdomain.com/api/auth/callback/github
```

### Staging
```
https://staging.yourdomain.com/api/auth/callback/github
```

## Multiple Callback URLs

If you need to support multiple environments:

1. In GitHub, you can only register one callback URL per OAuth app
2. Create separate OAuth apps for each environment:
   - **Your App (Development)**
   - **Your App (Staging)**
   - **Your App (Production)**
3. Use different environment variables for each environment

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the callback URL in GitHub exactly matches your application URL
- Check that you're using the correct protocol (http vs https)
- Ensure there are no trailing slashes

### "Invalid client" error
- Verify your `GITHUB_CLIENT_ID` is correct
- Check that your `GITHUB_CLIENT_SECRET` is correct
- Make sure you've restarted your server after adding the credentials

### Users can't access their email
By default, GitHub OAuth provides the user's primary email. If you need additional email permissions:
1. In your GitHub OAuth app settings, request the `user:email` scope
2. Update the provider config in `src/lib/auth.ts`:
```typescript
GitHubProvider({
  clientId: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  profile(profile) {
    return {
      id: profile.id.toString(),
      name: profile.name || profile.login,
      email: profile.email,
      image: profile.avatar_url,
    }
  }
}),
```

## Security Best Practices

1. **Never commit secrets** - Add `.env` to your `.gitignore`
2. **Use different credentials** for each environment
3. **Rotate secrets regularly** - Generate new client secrets periodically
4. **Restrict OAuth scope** - Only request the permissions you need
5. **Monitor usage** - Check your GitHub OAuth app's traffic regularly

## What's Been Implemented

✅ GitHub OAuth provider added to NextAuth config  
✅ GitHub sign-in button on sign-in page  
✅ GitHub sign-up button on sign-up page  
✅ GitHub icon and branding  
✅ Same flow as Google OAuth (trial handling, subscription setup, etc.)  

## Next Steps

- Set up production callback URLs before deploying
- Test the complete sign-up flow with a GitHub account
- Consider adding more OAuth providers (Microsoft, Facebook, etc.)
- Monitor sign-up analytics to see which provider users prefer

