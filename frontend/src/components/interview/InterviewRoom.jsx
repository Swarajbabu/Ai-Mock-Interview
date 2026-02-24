import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, Square, Code, Play } from 'lucide-react';

const InterviewRoom = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAnswering, setIsAnswering] = useState(false);
    const [timer, setTimer] = useState(0);
    const navigate = useNavigate();
    const videoRef = useRef(null);

    // Mock Question
    const currentQuestion = "Can you describe a time when you had to optimize a React application's performance? What strategies did you use?";

    // Mock Timer
    useEffect(() => {
        let interval;
        if (isAnswering) {
            interval = setInterval(() => setTimer(prev => prev + 1), 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isAnswering]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleEndInterview = () => {
        if (window.confirm("Are you sure you want to end the application?")) {
            navigate('/evaluation');
        }
    };

    return (
        <div className="h-screen bg-slate-900 overflow-hidden flex flex-col font-sans">
            {/* Top Header */}
            <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md z-10 w-full relative shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded text-white font-bold text-sm">
                        AI
                    </div>
                    <span className="text-white font-medium">Frontend Developer Interview</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm font-mono bg-slate-800 px-3 py-1 rounded-md">
                        Q 1 / 5
                    </span>
                    <button
                        onClick={handleEndInterview}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        End Interview
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row relative z-0 h-[calc(100vh-4rem-6rem)]">

                {/* Left Split - AI Interviewer & Question */}
                <div className="w-full md:w-1/2 h-full border-r border-slate-800 flex flex-col relative bg-slate-900">

                    {/* Question Banner */}
                    <div className="absolute top-6 left-6 right-6 z-20 bg-slate-800/80 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            Current Question
                        </h3>
                        <p className="text-white text-lg leading-relaxed">
                            {currentQuestion}
                        </p>
                    </div>

                    {/* AI Avatar Area (Mock WebGL / Waveform) */}
                    <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900">
                        {/* Decorative Background Elements */}
                        <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

                        {/* Center Avatar Hexagon */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000 animate-pulse"></div>
                            <div className="relative w-48 h-48 bg-slate-800 rounded-full border-2 border-indigo-500/30 flex items-center justify-center shadow-2xl overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=1e293b" alt="AI Interviewer" className="w-full h-full object-cover p-4" />
                            </div>
                        </div>

                        {/* AI Speaking Indicator */}
                        {!isAnswering && (
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1 items-end h-8">
                                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <div key={i} className={`w-1.5 bg-indigo-500 rounded-full animate-pulse`} style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 100}ms` }}></div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Split - User Webcam */}
                <div className="w-full md:w-1/2 h-full bg-slate-950 relative flex items-center justify-center p-6">

                    {/* Webcam Mock Frame */}
                    <div className={`w-full max-w-2xl aspect-video rounded-2xl overflow-hidden border-2 transition-colors duration-300 relative ${isAnswering ? 'border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.15)] bg-slate-800' : 'border-slate-800 bg-slate-900'}`}>

                        {/* User Camera Mock */}
                        {isVideoOn ? (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center -scale-x-100 relative">
                                {/* Fake user placeholder */}
                                <div className="w-32 h-32 rounded-full border border-slate-600 bg-slate-700 flex items-center justify-center opacity-30">
                                    <span className="text-slate-400">Preview</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center flex-col gap-4">
                                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                                    <VideoOff className="w-8 h-8" />
                                </div>
                                <span className="text-slate-500 font-medium">Camera is disabled</span>
                            </div>
                        )}

                        {/* Status Overlays */}
                        <div className="absolute bottom-4 left-4 flex gap-2">
                            <div className="px-3 py-1.5 bg-black/60 backdrop-blur rounded-lg text-white text-sm font-medium flex items-center gap-2">
                                {isMuted ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 text-green-400" />}
                                You
                            </div>
                        </div>

                        {/* Recording Indicator */}
                        {isAnswering && (
                            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur rounded-lg text-white text-sm font-medium flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                Recording {formatTime(timer)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Controls Bar */}
            <footer className="h-24 bg-slate-900 border-t border-slate-800 flex items-center justify-center px-6 gap-4 shrink-0 relative z-20 w-full">

                {/* Device Controls */}
                <div className="flex gap-3 absolute left-6 border-r border-slate-800 pr-6">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isMuted ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => setIsVideoOn(!isVideoOn)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${!isVideoOn ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>
                </div>

                {/* Primary Action */}
                <button
                    onClick={() => {
                        if (isAnswering) {
                            setIsAnswering(false);
                            setTimer(0);
                            // Next question logic...
                        } else {
                            setIsAnswering(true);
                        }
                    }}
                    className={`flex items-center gap-3 px-8 py-4 rounded-full font-semibold outline-none transition-all hover:scale-105 active:scale-95 shadow-xl ${isAnswering ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-red-500/20' : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-600/20'}`}
                >
                    {isAnswering ? (
                        <>
                            <Square className="w-5 h-5 fill-current" />
                            Stop Answer
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 fill-current" />
                            Start Answer
                        </>
                    )}
                </button>

                {/* Skip/Next */}
                <div className="absolute right-6">
                    <button className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors border border-slate-700">
                        Skip Question
                    </button>
                </div>

            </footer>
        </div>
    );
};

export default InterviewRoom;
