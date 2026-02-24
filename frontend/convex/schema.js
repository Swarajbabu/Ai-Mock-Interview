import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        email: v.string(),
        password: v.optional(v.string()), // Might be omitted for Google users
        isGoogleUser: v.boolean(),
        fullName: v.optional(v.string()),
        phone: v.optional(v.string()),
        bio: v.optional(v.string()),
        profilePic: v.optional(v.string()), // Added for Google Profile Picture
        createdAt: v.number(),
    }).index("by_email", ["email"]),

    otps: defineTable({
        email: v.string(),
        otp: v.string(),
        createdAt: v.number(),
    }).index("by_email", ["email"]),

    interviews: defineTable({
        userId: v.id("users"),
        title: v.string(),
        company: v.optional(v.string()),
        score: v.number(),
        createdAt: v.number(),
    }).index("by_user", ["userId"]),
});
