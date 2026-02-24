import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, TrendingUp, AlertTriangle, ChevronRight, Home } from 'lucide-react';

const ResultSummary = () => {
    const navigate = useNavigate();

    // Mock Data
    const score = 8.5;
    const strengths = [
        "Clear understanding of React lifecycle methods and hooks.",
        "Good practical examples given for performance optimization (memoization, lazy loading).",
        "Confident delivery and good pacing when explaining complex technical concepts."
    ];
    const weaknesses = [
        "A bit hesitant when discussing backend integration patterns.",
        "Could have structured the response to the architecture question more chronologically."
    ];
    const improvements = [
        "Practice using the STAR method (Situation, Task, Action, Result) for behavioral questions.",
        "Review state management alternatives to Redux (like Zustand or Context API) for a broader perspective."
    ];

    return (
        <div className="max-w-4xl mx-auto py-8">

            {/* Header Area */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg mb-4">
                    <Award className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Interview Completed!</h1>
                <p className="text-slate-500">Here is a detailed breakdown of your performance.</p>
            </div>

            {/* Score Card */}
            <div className="bg-white rounded-3xl p-8 shadow-soft-lg border border-slate-100 mb-8 relative overflow-hidden">
                {/* Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">Overall Assessment</h2>
                        <p className="text-slate-600 max-w-md text-sm leading-relaxed">
                            Great job! You demonstrated strong foundational knowledge in frontend development. Your communication was clear, though structuring your answers could further enhance your impact.
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="56" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                                <circle
                                    cx="64" cy="64" r="56"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="12"
                                    strokeDasharray={2 * Math.PI * 56}
                                    strokeDashoffset={2 * Math.PI * 56 * (1 - (score / 10))}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-4xl font-black text-slate-900">{score}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ 10</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Feedback Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                {/* Strengths */}
                <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100">
                    <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Key Strengths
                    </h3>
                    <ul className="space-y-3">
                        {strengths.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span>
                                <span className="text-sm text-green-900 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
                    <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Areas to Review
                    </h3>
                    <ul className="space-y-3">
                        {weaknesses.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                <span className="text-sm text-red-900 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actionable Improvements (Full Width) */}
                <div className="md:col-span-2 bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" /> Actionable Advice
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {improvements.map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                                    {idx + 1}
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                >
                    <Home className="w-4 h-4" />
                    Back to Dashboard
                </button>
                <button
                    onClick={() => navigate('/interview')}
                    className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-soft flex items-center gap-2"
                >
                    Try Another Mock Interview
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

        </div>
    );
};

export default ResultSummary;
