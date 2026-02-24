import { mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

// 1. Create a user (or return existing if Google)
export const createUser = mutation({
    args: { email: v.string(), password: v.optional(v.string()), isGoogleUser: v.boolean() },
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

// --- ACTIONS (Can execute external Node modules) ---

// Send an email OTP
export const sendOtpAction = action({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Store in the DB via mutation
        await ctx.runMutation(api.auth.storeOtp, { email: args.email, otp: otpCode });

        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (emailUser && emailPass) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: emailUser,
                    pass: emailPass
                }
            });

            await transporter.sendMail({
                from: emailUser,
                to: args.email,
                subject: 'Mock Interview Login OTP',
                text: `Your authentication code is: ${otpCode}. It will expire in 5 minutes.`
            });
            return { success: true };
        } else {
            console.warn(`[Mock Email] Variables not set. OTP for ${args.email} is ${otpCode}`);
            return { success: true, warning: 'Email credentials not set', mockOtp: otpCode };
        }
    }
});

// Verify Google Token string from the frontend
export const verifyGoogleToken = action({
    args: { credential: v.string() },
    handler: async (ctx, args) => {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId) {
            // We just warn and fake verify for local testing if env var isn't set yet
            console.warn("Missing GOOGLE_CLIENT_ID in Convex Dashboard! Faking it for dev.");
            return { success: true, email: "mockuser@example.com" };
        }

        const client = new OAuth2Client(clientId);
        const ticket = await client.verifyIdToken({
            idToken: args.credential,
            audience: clientId
        });

        const payload = ticket.getPayload();
        if (!payload) throw new Error("Invalid token payload");

        const email = payload.email;

        await ctx.runMutation(api.auth.createUser, {
            email: email,
            isGoogleUser: true
        });

        return { success: true, email };
    }
});
