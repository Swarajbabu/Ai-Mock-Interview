import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, Home, Video } from 'lucide-react';

const MainLayout = () => {
    const location = useLocation();
    const isInterviewPage = location.pathname.includes('/interview');

    // Hide nav on the actual interview page for full focus
    if (isInterviewPage) {
        return <Outlet />;
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-md shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 text-white font-bold">
                                AI
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                MockInterview
                            </span>
                        </div>

                        <div className="flex items-center gap-6">
                            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                <Home className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <Link to="/interview" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                <Video className="w-4 h-4" />
                                Practice
                            </Link>
                            <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors ml-4 border-l border-slate-200 pl-4">
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen-nav">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
