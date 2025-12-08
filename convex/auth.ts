/**
 * Helper functions for authentication that support both Clerk and Admin users
 */

export const ADMIN_USER_ID = "admin";

/**
 * Get the user ID from either Clerk authentication or admin password
 * Returns null if neither is valid
 */
export async function getUserId(
    ctx: { auth: { getUserIdentity: () => Promise<any> } },
    adminPassword?: string
): Promise<string | null> {
    // First try Clerk authentication
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
        return identity.subject;
    }

    // If no Clerk auth, check admin password
    if (adminPassword) {
        const correctPassword = process.env.ADMIN_PASSWORD || "admin123";
        if (adminPassword === correctPassword) {
            return ADMIN_USER_ID;
        }
    }

    return null;
}

/**
 * Check if a user ID is the admin user
 */
export function isAdminUser(userId: string | null): boolean {
    return userId === ADMIN_USER_ID;
}

