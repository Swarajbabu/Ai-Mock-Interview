import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    }
});

export const updateProfile = mutation({
    args: {
        userId: v.id("users"),
        fullName: v.string(),
        phone: v.string(),
        bio: v.string(),
    },
    handler: async (ctx, args) => {
        const { userId, ...updates } = args;
        await ctx.db.patch(userId, updates);
        return { success: true };
    }
});
