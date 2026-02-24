import React from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import './index.css'
import App from './App.jsx'

// Load from Vite env variables
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";
const convexUrl = import.meta.env.VITE_CONVEX_URL;

const convex = new ConvexReactClient(convexUrl);

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ConvexProvider client={convex}>
            <GoogleOAuthProvider clientId={googleClientId}>
                <App />
            </GoogleOAuthProvider>
        </ConvexProvider>
    </React.StrictMode>,
)
