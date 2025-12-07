// Convex auth configuration for Clerk
// The domain should match the hostname of your Clerk Frontend API URL
// Based on your environment: https://intent-scorpion-94.clerk.accounts.dev
export default {
  providers: [
    {
      // Use just the hostname (domain) without protocol
      domain: "intent-scorpion-94.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};

