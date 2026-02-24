import { mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. Create a user (or return existing if Google)
export const createUser = mutation({
    args: {
        email: v.string(),
        password: v.optional(v.string()),
        isGoogleUser: v.boolean(),
        fullName: v.optional(v.string()),
        profilePic: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existingUser && !args.isGoogleUser) {
            throw new Error("User already exists");
        }

        if (!existingUser) {
            return await ctx.db.insert("users", {
                email: args.email,
                password: args.password,
                isGoogleUser: args.isGoogleUser,
                fullName: args.fullName,
                profilePic: args.profilePic,
                createdAt: Date.now(),
            });
        }
        return existingUser._id;
    },
});

// 2. Validate email/password
export const checkCredentials = mutation({
    args: { email: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (!user || user.isGoogleUser || user.password !== args.password) {
            throw new Error("Invalid email or password");
        }
        return user._id;
    }
});

// 3. Store the OTP securely
export const storeOtp = mutation({
    args: { email: v.string(), otp: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("otps")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existing) {
            await ctx.db.delete(existing._id);
        }

        await ctx.db.insert("otps", {
            email: args.email,
            otp: args.otp,
            createdAt: Date.now()
        });
    }
});

// 4. Verify OTP and return user ID
export const verifyOtpToken = mutation({
    args: { email: v.string(), otp: v.string() },
    handler: async (ctx, args) => {
        const record = await ctx.db
            .query("otps")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (!record || record.otp !== args.otp) {
            throw new Error("Incorrect or expired OTP");
        }

        // Ensure not expired (e.g. 5 minutes = 300000 ms)
        if (Date.now() - record.createdAt > 300000) {
            await ctx.db.delete(record._id);
            throw new Error("OTP expired");
        }

        await ctx.db.delete(record._id);

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        return user ? user._id : null;
    }
});
