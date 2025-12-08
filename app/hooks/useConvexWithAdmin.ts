"use client";

import { useQuery as useConvexQuery, useMutation as useConvexMutation, FunctionArgs, FunctionReference } from "convex/react";
import { useAdmin } from "../contexts/AdminContext";

/**
 * Wrapper around useQuery that automatically includes admin password if admin is logged in
 */
export function useQuery<Query extends FunctionReference<"query">>(
    query: Query,
    args?: FunctionArgs<Query> | "skip"
) {
    const { adminPassword, isAdmin } = useAdmin();
    
    // If args is "skip", pass it through
    if (args === "skip") {
        return useConvexQuery(query, args);
    }
    
    // Otherwise, add adminPassword if admin is logged in
    const argsWithAdmin = args 
        ? { ...args, adminPassword: isAdmin ? adminPassword : undefined }
        : isAdmin ? { adminPassword } : undefined;
    
    return useConvexQuery(query, argsWithAdmin);
}

/**
 * Wrapper around useMutation that automatically includes admin password if admin is logged in
 */
export function useMutation<Mutation extends FunctionReference<"mutation">>(
    mutation: Mutation
) {
    const { adminPassword, isAdmin } = useAdmin();
    const convexMutation = useConvexMutation(mutation);
    
    return async (args?: FunctionArgs<Mutation>) => {
        // If no args provided, check if mutation needs admin password
        if (!args) {
            // For mutations with no args, only add adminPassword if admin is logged in
            if (isAdmin && adminPassword) {
                return convexMutation({ adminPassword } as FunctionArgs<Mutation>);
            }
            return convexMutation(undefined as any);
        }
        
        const argsWithAdmin = {
            ...args,
            ...(isAdmin && adminPassword ? { adminPassword } : {}),
        };
        return convexMutation(argsWithAdmin);
    };
}

