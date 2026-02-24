import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, Square, Code, Play, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

const InterviewRoom = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAnswering, setIsAnswering] = useState(false);
    const [timer, setTimer] = useState(0);
    const [mediaStream, setMediaStream] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const navigate = useNavigate();
    const videoRef = useRef(null);

    // Media Access
    useEffect(() => {
        let stream = null;
        const getMedia = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setMediaStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing media devices.", err);
                setIsVideoOn(false);
            }
        };
        getMedia();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Handle Mute/Video Toggles
    useEffect(() => {
        if (mediaStream) {
            mediaStream.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
            mediaStream.getVideoTracks().forEach(track => {
                track.enabled = isVideoOn;
            });
        }
    }, [isMuted, isVideoOn, mediaStream]);

    // Update videoRef when mediaStream is available and isVideoOn is true
    useEffect(() => {
        if (isVideoOn && videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream;
        }
    }, [isVideoOn, mediaStream]);

    // Detect speaking volume
    useEffect(() => {
        let audioContext;
        let analyser;
        let microphone;
        let animationFrameId;

        if (mediaStream && !isMuted) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.5;

                microphone = audioContext.createMediaStreamSource(mediaStream);
                microphone.connect(analyser);

                const dataArray = new Uint8Array(analyser.frequencyBinCount);

                const checkAudioLevel = () => {
                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        sum += dataArray[i];
                    }
                    const average = sum / dataArray.length;

                    if (average > 15) {
                        setIsSpeaking(true);
                    } else {
                        setIsSpeaking(false);
                    }

                    animationFrameId = requestAnimationFrame(checkAudioLevel);
                };

                checkAudioLevel();
            } catch (err) {
                console.error("Error setting up audio context", err);
            }
        } else {
            setIsSpeaking(false);
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (audioContext && audioContext.state !== 'closed') {
                audioContext.close();
            }
        };
    }, [mediaStream, isMuted]);

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
        <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden flex flex-col font-sans selection:bg-purple-500/30 relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Top Navigation Bar */}
            <header className="h-24 px-8 flex items-center justify-between z-20 relative">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-wide">Frontend Engineering Interview</h1>
                        <p className="text-sm text-zinc-400 font-medium">with AI Interviewer</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex bg-zinc-900/50 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
                        <div className="px-5 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold shadow-sm">
                            Question 1/5
                        </div>
                    </div>
                    <button
                        onClick={handleEndInterview}
                        className="group flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold rounded-full transition-all border border-red-500/20"
                    >
                        <AlertCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        End Interview
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 md:p-8 pt-0 flex flex-col md:flex-row gap-6 z-10 relative h-[calc(100vh-6rem)]">

                {/* Left Panel: AI Interviewer */}
                <div className="flex-1 rounded-[2rem] overflow-hidden relative group border border-white/10 bg-zinc-900/40 backdrop-blur-md shadow-2xl flex flex-col">
                    {/* Top Overlay */}
                    <div className="absolute top-6 left-6 z-20 flex gap-3">
                        <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-semibold flex items-center gap-2 text-purple-300 shadow-lg">
                            <Sparkles className="w-4 h-4" /> AI Interviewer
                        </div>
                    </div>

                    {/* AI Visualizer */}
                    <div className="flex-1 flex items-center justify-center relative bg-gradient-to-b from-transparent to-black/40">
                        {/* Glowing Orb */}
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute w-56 h-56 bg-blue-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

                            <div className="relative w-40 h-40 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)]">
                                {/* Sound waves inner */}
                                {!isAnswering && (
                                    <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-90">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="w-2 bg-white rounded-full" style={{ height: `${20 + Math.random() * 40}px`, animation: `pulse-height 1s infinite alternate`, animationDelay: `0.${i}s` }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Question Card Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/60 w-auto backdrop-blur-xl border border-white/10 shadow-2xl transform transition-transform hover:-translate-y-1">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-2.5 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 rounded-xl shadow-inner">
                                <MessageSquare className="w-6 h-6 text-purple-300" />
                            </div>
                            <div>
                                <h3 className="text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">Current Question</h3>
                                <p className="text-white/95 text-lg leading-relaxed font-medium">
                                    {currentQuestion}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: User Camera & Controls */}
                <div className="w-full md:w-[40%] flex flex-col gap-6 h-full">

                    {/* Camera Feed */}
                    <div className="flex-1 relative rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-sm shadow-2xl group">
                        {isVideoOn ? (
                            <div className="w-full h-full bg-zinc-950 flex items-center justify-center -scale-x-100 relative">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-zinc-900/80">
                                <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                                    <VideoOff className="w-8 h-8 text-zinc-500" />
                                </div>
                                <p className="text-zinc-500 font-medium">Camera is disabled</p>
                            </div>
                        )}

                        {/* User Status Tags */}
                        <div className="absolute top-6 right-6 flex flex-col items-end gap-3 z-20">
                            {isAnswering && (
                                <div className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center gap-2 animate-pulse">
                                    <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                                    Recording {formatTime(timer)}
                                </div>
                            )}
                            {isSpeaking && !isMuted && !isAnswering && (
                                <div className="px-3 py-1.5 bg-green-500/90 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-md">
                                    Speaking...
                                </div>
                            )}
                        </div>

                        {/* Name Tag */}
                        <div className="absolute bottom-6 left-6 z-20">
                            <div className="px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center gap-3 shadow-xl">
                                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10">
                                    {isMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-green-400" />}
                                </div>
                                <span className="text-white text-sm font-semibold">You</span>
                            </div>
                        </div>

                        {/* Audio Wave Bar for user */}
                        {isSpeaking && !isMuted && (
                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all duration-75"></div>
                        )}
                    </div>

                    {/* Controls Dock */}
                    <div className="h-28 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-2xl p-4 flex items-center justify-between shadow-2xl">

                        {/* Media Toggles */}
                        <div className="flex items-center gap-3 pl-2">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
                            >
                                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                            </button>
                            <button
                                onClick={() => setIsVideoOn(!isVideoOn)}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${!isVideoOn ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
                            >
                                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                            </button>
                        </div>

                        {/* Center Action */}
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
                            className={`flex items-center justify-center gap-3 h-16 px-8 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${isAnswering
                                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 border border-red-400/30'
                                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 border border-purple-400/30'
                                }`}
                        >
                            {isAnswering ? (
                                <>
                                    <Square className="w-6 h-6 fill-current" />
                                    Finish Answer
                                </>
                            ) : (
                                <>
                                    <Play className="w-6 h-6 fill-current" />
                                    Start Answering
                                </>
                            )}
                        </button>

                        {/* Skip Button */}
                        <div className="pr-2 hidden xl:block">
                            <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all border border-white/5 hover:border-white/10">
                                Skip
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-height {
                    0% { height: 20px; opacity: 0.5; }
                    100% { height: 60px; opacity: 1; }
                }
            `}} />
        </div>
    );
};

export default InterviewRoom;
