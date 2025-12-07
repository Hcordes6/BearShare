import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Test function to check if authentication is working
 */
export const testAuth = query({
    returns: v.object({
        hasIdentity: v.boolean(),
        identity: v.union(
            v.object({
                subject: v.string(),
                issuer: v.string(),
                name: v.optional(v.string()),
                email: v.optional(v.string()),
            }),
            v.null()
        ),
    }),
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        return {
            hasIdentity: identity !== null,
            identity: identity
                ? {
                      subject: identity.subject,
                      issuer: identity.issuer,
                      name: identity.name ?? undefined,
                      email: identity.email ?? undefined,
                  }
                : null,
        };
    },
});

