"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { getToken, isLoaded, userId } = useAuth();

  if (!isLoaded) {
    // Return provider without token config while loading
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
  }

  return (
    <ConvexProvider
      client={convex}
      tokenConfig={{
        actor: async () => {
          if (!userId) {
            console.log("[ConvexClientProvider] No userId, returning null");
            return null;
          }
          
          try {
            console.log("[ConvexClientProvider] Attempting to get Clerk token...");
            // Try to get token with "convex" template first (recommended)
            // This requires setting up a JWT template named "convex" in Clerk dashboard
            let token = await getToken({ template: "convex" });
            
            if (token) {
              console.log("[ConvexClientProvider] Successfully got token with 'convex' template");
              return token;
            }
            
            console.log("[ConvexClientProvider] No token from 'convex' template, trying default...");
            // Fallback: try to get default token
            token = await getToken();
            
            if (token) {
              console.log("[ConvexClientProvider] Successfully got default token");
              return token;
            }
            
            console.warn("[ConvexClientProvider] No Clerk token available for Convex");
            return null;
          } catch (error) {
            console.error("[ConvexClientProvider] Error getting Clerk token for Convex:", error);
            // Try fallback one more time
            try {
              const defaultToken = await getToken();
              if (defaultToken) {
                console.log("[ConvexClientProvider] Got token on fallback attempt");
              }
              return defaultToken ?? null;
            } catch (fallbackError) {
              console.error("[ConvexClientProvider] Fallback token retrieval also failed:", fallbackError);
              return null;
            }
          }
        },
      }}
    >
      {children}
    </ConvexProvider>
  );
}
