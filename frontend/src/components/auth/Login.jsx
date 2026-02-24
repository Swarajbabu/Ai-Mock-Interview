import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

const Login = () => {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [step, setStep] = useState(1); // 1 = Credentials, 2 = OTP
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Convex Hooks
    const createUser = useMutation(api.auth.createUser);
    const checkCredentials = useMutation(api.auth.checkCredentials);
    const verifyOtpToken = useMutation(api.auth.verifyOtpToken);
    const sendOtpAction = useAction(api.authActions.sendOtpAction);
    const verifyGoogleToken = useAction(api.authActions.verifyGoogleToken);

    const handleCredentialsSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (mode === 'register') {
                await createUser({ email, password, isGoogleUser: false });
            } else {
                await checkCredentials({ email, password });
            }

            // If we reach here, credentials are valid or user is created. Send OTP Action.
            const otpResponse = await sendOtpAction({ email });

            if (otpResponse.warning) {
                console.warn("OTP Warning: ", otpResponse.warning, "- Using Mock OTP:", otpResponse.mockOtp);
            }

            setStep(2); // Move to OTP verification

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const userId = await verifyOtpToken({ email, otp });
            if (!userId) {
                throw new Error('Authentication failed');
            }

            // Store token (normally session storage or proper HTTP cookie, but for mock usage we will use localStorage)
            localStorage.setItem('userId', userId);
            navigate('/dashboard');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError(null);
        try {
            const response = await verifyGoogleToken({ credential: credentialResponse.credential });
            if (!response.success) throw new Error('Google auth failed');

            if (response.userId) {
                localStorage.setItem('userId', response.userId);
            } else {
                localStorage.setItem('userEmail', response.email); // Dev fallback
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-soft-lg border border-slate-100 p-8">

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {step === 1 ? (mode === 'login' ? 'Welcome Back' : 'Create Account') : 'Check Your Email'}
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm">
                        {step === 1
                            ? (mode === 'login' ? 'Enter your credentials to access your account' : 'Sign up to start your mock interviews')
                            : `We sent a 6-digit code to ${email}`}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <>
                        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300"
                            >
                                {loading ? 'Please wait...' : (mode === 'login' ? 'Sign in' : 'Create Account')}
                            </button>
                        </form>

                        <div className="mt-6 flex items-center justify-between">
                            <span className="border-b border-slate-200 w-1/5"></span>
                            <span className="text-xs text-slate-400 uppercase font-medium">Or continue with</span>
                            <span className="border-b border-slate-200 w-1/5"></span>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google Sign-In was unsuccessful')}
                                useOneTap
                            />
                        </div>

                        <p className="mt-8 text-center text-sm text-slate-600">
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
                                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                {mode === 'login' ? 'Register here' : 'Login here'}
                            </button>
                        </p>
                    </>
                ) : (
                    <form onSubmit={verifyOtp} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 text-center">Verification Code</label>
                            <input
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="block w-full text-center tracking-[0.5em] text-2xl font-mono py-3 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                                placeholder="000000"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300"
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full flex justify-center py-2.5 px-4 border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors mt-3"
                        >
                            Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
