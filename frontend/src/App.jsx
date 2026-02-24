import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Login from './components/auth/Login';
import HomeDashboard from './components/dashboard/HomeDashboard';
import InterviewRoom from './components/interview/InterviewRoom';
import ResultSummary from './components/evaluation/ResultSummary';

function App() {
    return (
        <Router>
            <Routes>
                {/* Auth Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes (Mocked with layout for now) */}
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<HomeDashboard />} />
                    <Route path="/interview" element={<InterviewRoom />} />
                    <Route path="/evaluation" element={<ResultSummary />} />
                </Route>

                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
