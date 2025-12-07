# Clerk + Convex Authentication Setup

If you're getting "Must be logged in" errors even when logged in, you need to configure Convex to validate Clerk tokens.

## Required Setup Steps:

### 1. Create JWT Template in Clerk Dashboard

1. Go to your Clerk Dashboard: https://dashboard.clerk.com
2. Navigate to **JWT Templates** in the sidebar
3. Click **New template**
4. Name it exactly: `convex` (lowercase)
5. Click **Create template**
6. The template will be automatically configured with the right claims

### 2. Configure Convex Environment Variables

You need to set environment variables in your Convex deployment:

1. Go to your Convex Dashboard: https://dashboard.convex.dev
2. Navigate to your project
3. Go to **Settings** → **Environment Variables**
4. Add these environment variables:
   
   **Required:**
   - **Key**: `CLERK_JWT_ISSUER`
   - **Value**: Your Clerk Frontend API URL (e.g., `https://intent-scorpion-94.clerk.accounts.dev`)
   
   **Also add:**
   - **Key**: `CLERK_SECRET_KEY`
   - **Value**: Your Clerk Secret Key (starts with `sk_test_` or `sk_live_`)
   
   **Note**: Both CLERK_JWT_ISSUER and CLERK_SECRET_KEY are needed for Convex to validate Clerk tokens.

### 3. Create auth.config.ts File

The `convex/auth.config.ts` file has been created automatically. This file tells Convex to use Clerk for authentication.

If it doesn't exist, create `convex/auth.config.ts` with:
```typescript
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER || process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```

### 4. Restart Convex Dev Server

After setting environment variables, restart your Convex dev server:

```bash
npm run dev
```

### Alternative: Use Default Token (Simpler Setup)

If you don't want to set up a JWT template, you can configure Convex to use Clerk's default token. However, this requires additional Convex configuration.

## Troubleshooting

- **Token not being passed**: Check browser console for errors when calling Convex functions
- **Token invalid**: Verify CLERK_JWT_ISSUER or CLERK_SIGNING_KEY is correctly set in Convex
- **Still getting errors**: Make sure the JWT template name is exactly `convex` (case-sensitive)

## Testing

After setup, you should see that `ctx.auth.getUserIdentity()` returns a valid identity object in your Convex functions.

