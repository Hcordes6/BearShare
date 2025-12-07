// Convex auth configuration for Clerk
// The domain should match the hostname of your Clerk Frontend API URL
// Extract just the hostname if a full URL is provided
function getClerkDomain(): string {
  const issuer = process.env.CLERK_FRONTEND_API_URL || process.env.CLERK_JWT_ISSUER;
  
  if (!issuer) {
    // Fallback to your domain
    return "intent-scorpion-94.clerk.accounts.dev";
  }
  
  // If it's a full URL, extract just the hostname
  if (issuer.startsWith("http://") || issuer.startsWith("https://")) {
    try {
      const url = new URL(issuer);
      return url.hostname;
    } catch {
      // If URL parsing fails, return as-is (might already be a domain)
      return issuer;
    }
  }
  
  // Already a domain
  return issuer;
}

export default {
  providers: [
    {
      domain: getClerkDomain(),
      applicationID: "convex",
    },
  ],
};

