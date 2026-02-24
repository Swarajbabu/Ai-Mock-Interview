import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, UserPlus, LogIn, BrainCircuit, Sparkles, Mic, ArrowRight } from 'lucide-react';
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
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    // Convex Hooks
    const createUser = useMutation(api.auth.createUser);
    const checkCredentials = useMutation(api.auth.checkCredentials);
    const verifyOtpToken = useMutation(api.auth.verifyOtpToken);
    const sendOtpAction = useAction(api.authActions.sendOtpAction);
    const verifyGoogleToken = useAction(api.authActions.verifyGoogleToken);

    const validatePassword = (pass) => {
        const minLength = pass.length > 8;
        const hasUpper = /[A-Z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

        if (!minLength) return "Password must be greater than 8 characters long.";
        if (!hasUpper) return "Password must contain at least one uppercase letter.";
        if (!hasNumber) return "Password must contain at least one number.";
        if (!hasSpecial) return "Password must contain at least one special character.";

        return null; // Valid
    };

    const handleCredentialsSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (mode === 'register') {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            const passwordError = validatePassword(password);
            if (passwordError) {
                setError(passwordError);
                return;
            }
        }

        setLoading(true);

        try {
            if (mode === 'register') {
                const fullPhoneNumber = `${countryCode}${phone}`;
                await createUser({
                    email,
                    password,
                    isGoogleUser: false,
                    fullName,
                    phone: fullPhoneNumber
                });
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
            // Convex error messages sometimes have prefixes
            const cleanMessage = err.message.replace(/^(Uncaught Error:|ConvexError:)\s*/, "").replace(/^\[.*?\]\s*/, "").trim();
            setError(cleanMessage || "Wrong OTP, try again");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError(null);
        try {
            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
            const response = await verifyGoogleToken({
                credential: credentialResponse.credential,
                clientId: clientId
            });
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
        <div className="min-h-screen bg-white flex text-slate-900 font-sans">
            {/* Left Side - Visual/Branding */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-[#0B0F19] overflow-hidden flex-col justify-between p-12 lg:p-16">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-[#0B0F19] z-0" />
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/20 blur-[100px]" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-600/20 blur-[100px]" />
                </div>

                <div className="relative z-10 flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/10">
                        <BrainCircuit className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">AI Interviewer</span>
                </div>

                <div className="relative z-10 max-w-lg my-auto pt-16 pb-12">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-6">
                        Master your next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">tech interview</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md">
                        Practice with our AI-powered mock interviews. Get real-time feedback, behavioral analysis, and technical evaluations to land your dream job.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05] backdrop-blur-md hover:bg-white/[0.08] transition-colors cursor-default">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4 shrink-0">
                                <Sparkles className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-sm">Smart Evaluation</h3>
                                <p className="text-slate-400 text-xs mt-0.5">Instant AI feedback</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05] backdrop-blur-md hover:bg-white/[0.08] transition-colors cursor-default">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mr-4 shrink-0">
                                <Mic className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-sm">Voice Analysis</h3>
                                <p className="text-slate-400 text-xs mt-0.5">Real conversation flow</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-slate-500 text-sm font-medium">
                    © {new Date().getFullYear()} AI Mock Interview System. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto min-h-screen">
                {/* Mobile header/branding */}
                <div className="lg:hidden absolute top-6 flex items-center justify-center space-x-2 w-full left-0">
                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <BrainCircuit className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-900 tracking-tight">AI Interviewer</span>
                </div>

                <div className={`w-full ${mode === 'register' ? 'max-w-[36rem]' : 'max-w-md'} transition-all duration-500 ease-in-out transform mt-12 lg:mt-0`}>

                    {/* Header */}
                    <div className="mb-8 text-center sm:text-left">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            {step === 1 ? (mode === 'login' ? 'Welcome back' : 'Create an account') : 'Check your email'}
                        </h2>
                        <p className="text-slate-500 mt-2.5 text-base">
                            {step === 1
                                ? (mode === 'login' ? 'Enter your details to access your dashboard.' : 'Start your journey to interview success today.')
                                : `We sent a 6-digit verification code to ${email}`}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start animate-in fade-in slide-in-from-top-2">
                            <ShieldCheck className="w-5 h-5 text-red-500 mr-2 shrink-0" />
                            <span className="pt-0.5">{error}</span>
                        </div>
                    )}

                    {step === 1 ? (
                        <>
                            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                                {mode === 'register' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
                                                    <UserPlus className="h-5 w-5" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 hover:bg-slate-100 focus:bg-white placeholder-slate-400 text-sm font-medium"
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-slate-700">Mobile Number</label>
                                            <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-slate-50 hover:bg-slate-100 focus-within:bg-white focus-within:hover:bg-white">
                                                <select
                                                    value={countryCode}
                                                    onChange={(e) => setCountryCode(e.target.value)}
                                                    className="bg-transparent text-slate-600 border-none py-3 pl-3 pr-8 focus:ring-0 text-sm border-r border-slate-200 font-medium cursor-pointer"
                                                >
                                                    <option value="+1">+1</option>
                                                    <option value="+44">+44</option>
                                                    <option value="+91">+91</option>
                                                    <option value="+61">+61</option>
                                                    <option value="+81">+81</option>
                                                    <option value="+49">+49</option>
                                                    <option value="+33">+33</option>
                                                </select>
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                                    className="block w-full px-4 py-3 border-none text-slate-900 focus:ring-0 bg-transparent placeholder-slate-400 text-sm font-medium outline-none"
                                                    placeholder="Phone Number"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 hover:bg-slate-100 focus:bg-white placeholder-slate-400 text-sm font-medium"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${mode === 'register' ? 'grid grid-cols-1 sm:grid-cols-2 gap-5' : 'space-y-1.5'}`}>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-semibold text-slate-700">Password</label>
                                            {mode === 'login' && (
                                                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">Forgot password?</a>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
                                                <Lock className="h-5 w-5" />
                                            </div>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 hover:bg-slate-100 focus:bg-white placeholder-slate-400 text-sm font-medium"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                        {mode === 'register' && (
                                            <p className="text-xs text-slate-500 mt-2 ml-1 font-medium">&gt;8 chars, 1 uppercase, 1 number, 1 special</p>
                                        )}
                                    </div>

                                    {mode === 'register' && (
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
                                                    <Lock className="h-5 w-5" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 hover:bg-slate-100 focus:bg-white placeholder-slate-400 text-sm font-medium"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none mt-6 animate-in fade-in slide-in-from-bottom-4 group"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Please wait...
                                        </div>
                                    ) : (
                                        <>
                                            {mode === 'login' ? 'Sign in to dashboard' : 'Create Account'}
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <div className="hover:scale-[1.02] transition-transform w-full sm:w-auto">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={() => setError('Google Sign-In was unsuccessful')}
                                            useOneTap
                                            shape="pill"
                                            theme="outline"
                                            size="large"
                                        />
                                    </div>
                                </div>
                            </div>

                            <p className="mt-8 text-center text-sm text-slate-600 font-medium">
                                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
                                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                                >
                                    {mode === 'login' ? 'Create an account' : 'Sign in instead'}
                                </button>
                            </p>
                        </>
                    ) : (
                        <form onSubmit={verifyOtp} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center mb-6">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
                                    <Mail className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Check your inbox</h3>
                                <p className="text-sm text-slate-600 font-medium">We sent a verification code to <span className="text-slate-900 font-bold">{email}</span>. Keep this tab open while you check your email.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-900 text-center mb-4">Verification Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="block w-full text-center tracking-[0.7em] text-3xl font-mono py-4 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 hover:bg-white focus:bg-white shadow-sm"
                                    placeholder="000000"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 6}
                                    className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                                >
                                    {loading ? 'Verifying...' : 'Verify Email Code'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent hover:border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-800 bg-transparent hover:bg-slate-50 transition-all font-medium"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
