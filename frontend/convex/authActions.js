"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

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
        let email, name, picture;

        if (!clientId) {
            console.warn("Missing GOOGLE_CLIENT_ID in Convex Dashboard! Faking it for dev.");
            email = "mockuser@example.com";
            name = "Test Candidate Mode";
            picture = "https://api.dicebear.com/7.x/avataaars/svg?seed=mockcandidate&backgroundColor=b6e3f4";
        } else {
            const client = new OAuth2Client(clientId);
            const ticket = await client.verifyIdToken({
                idToken: args.credential,
                audience: clientId
            });

            const payload = ticket.getPayload();
            if (!payload) throw new Error("Invalid token payload");

            email = payload.email;
            name = payload.name;
            picture = payload.picture;
        }

        const userId = await ctx.runMutation(api.auth.createUser, {
            email: email,
            isGoogleUser: true,
            fullName: name,
            profilePic: picture
        });

        return { success: true, email, userId };
    }
});
