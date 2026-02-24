import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Play, History, FileCheck } from 'lucide-react';

const HomeDashboard = () => {
    const [cvFile, setCvFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleStartInterview = () => {
        if (cvFile && jobDescription) {
            navigate('/interview');
        } else {
            alert("Please upload CV and provide Job Description to continue.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, Candidate!</h1>
                <p className="text-slate-500">Prepare for your next big role with AI-driven mock interviews.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Setup */}
                <div className="lg:col-span-2 space-y-6">

                    {/* CV Upload */}
                    <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-blue-500" />
                            1. Upload Your CV
                        </h2>

                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 transition-all hover:border-blue-400 hover:bg-blue-50/50 group">
                            <input
                                type="file"
                                id="cv-upload"
                                className="hidden"
                                accept=".pdf,.docx"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="cv-upload"
                                className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                            >
                                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-8 h-8" />
                                </div>
                                <span className="text-slate-700 font-medium mb-1">Click to upload or drag and drop</span>
                                <span className="text-slate-400 text-sm">PDF or DOCX (MAX. 5MB)</span>

                                {cvFile && (
                                    <div className="mt-4 px-4 py-2 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 border border-green-200">
                                        <FileText className="w-4 h-4" />
                                        <span className="text-sm font-medium">{cvFile.name} attached</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            2. Job Description
                        </h2>
                        <p className="text-sm text-slate-500 mb-3">Paste the job description you are targeting. Our AI will analyze it to ask relevant questions.</p>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="e.g. Seeking a Senior React Developer with 5 years of experience in building scalable web applications..."
                            className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow text-slate-700 bg-slate-50 focus:bg-white"
                        />
                    </div>

                    {/* Action Area */}
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleStartInterview}
                            disabled={!cvFile || !jobDescription}
                            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-white shadow-sm transition-all
                ${(cvFile && jobDescription)
                                    ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5'
                                    : 'bg-slate-300 cursor-not-allowed'}`}
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Start Mock Interview
                        </button>
                    </div>
                </div>

                {/* Right Column - History */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 h-full">
                        <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                            <History className="w-5 h-5 text-slate-500" />
                            Previous Interviews
                        </h2>

                        <div className="space-y-4">
                            {/* Mock History Item */}
                            <div className="p-4 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">Frontend Developer</h3>
                                        <p className="text-xs text-slate-500 mt-1">Tech Corp Inc.</p>
                                    </div>
                                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md">
                                        8.5/10
                                    </span>
                                </div>
                                <div className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-50 flex justify-between">
                                    <span>Oct 24, 2023</span>
                                    <span className="text-blue-500 font-medium group-hover:underline">View Report →</span>
                                </div>
                            </div>

                            <div className="p-4 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">Full-Stack Engineer</h3>
                                        <p className="text-xs text-slate-500 mt-1">StartupFlow</p>
                                    </div>
                                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-md">
                                        6.5/10
                                    </span>
                                </div>
                                <div className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-50 flex justify-between">
                                    <span>Oct 12, 2023</span>
                                    <span className="text-blue-500 font-medium group-hover:underline">View Report →</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                            View All History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeDashboard;
