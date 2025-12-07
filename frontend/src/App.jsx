import React, { useState, useRef } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import SystemStatus from './components/SystemStatus';
import Hero from './components/Hero';
import VerificationTerminal from './components/VerificationTerminal';
import History from './components/History';
import AboutSection from './components/AboutSection';
import ReasonSection from './components/ReasonSection';
import SupportSection from './components/SupportSection';
import Footer from './components/Footer';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token');
    });
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [user, setUser] = useState(() => {
        const u = localStorage.getItem('user');
        return u ? JSON.parse(u) : null;
    });
    const [appState, setAppState] = useState('IDLE');

    // Refs for Scrolling
    const homeRef = useRef(null);
    const aboutRef = useRef(null);
    const reasonRef = useRef(null);
    const supportRef = useRef(null);

    const scrollToSection = (section) => {
        const refs = {
            home: homeRef,
            about: aboutRef,
            reason: reasonRef,
            support: supportRef
        };
        refs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleLoginSuccess = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        setShowAuthModal(false);
    };

    const handleAuthRequired = (e) => {
        if (!isAuthenticated) {
            if (e) e.preventDefault();
            e.stopPropagation();
            setShowAuthModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-background text-text font-sans selection:bg-primary selection:text-white pb-20">

            <Header
                onAuthClick={() => setShowAuthModal(true)}
                isAuthenticated={isAuthenticated}
                user={user}
                onNavigate={scrollToSection}
            />

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            <SystemStatus />

            {/* Main Content Sections */}
            <div
                onClickCapture={!isAuthenticated ? handleAuthRequired : undefined}
                className={!isAuthenticated ? "cursor-lock" : "pointer-events-auto"}
            >
                {isAuthenticated ? (
                    // AUTHENTICATED DASHBOARD VIEW
                    <div ref={homeRef} id="home" className="pt-24 px-4 max-w-7xl mx-auto space-y-12 min-h-screen">
                        {/* 1. Transaction History */}
                        <div className="bg-surface/50 border border-white/5 rounded-2xl p-2 backdrop-blur-sm">
                            <History user={user} />
                        </div>

                        {/* 2. Verification Terminal */}
                        <div className="pb-20">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">New Expense Verification</h2>
                            <VerificationTerminal
                                setAppState={setAppState}
                                onStatusChange={() => { }}
                            />
                        </div>
                    </div>
                ) : (
                    // UNAUTHENTICATED LANDING VIEW
                    <div ref={homeRef} id="home" className="min-h-screen pt-16">
                        <Hero appState={appState} />

                        <div className="relative z-30 mb-20">
                            <div className="flex flex-col items-center justify-center gap-6 mt-[-40px]">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => setShowAuthModal(true)}
                                        className="bg-primary hover:bg-emerald-400 text-white text-lg font-bold py-4 px-10 rounded-full shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        Login to Terminal
                                    </button>
                                    <button
                                        onClick={() => setShowAuthModal(true)}
                                        className="bg-slate-800/80 backdrop-blur-md hover:bg-slate-700 border border-slate-600 text-white text-lg font-bold py-4 px-10 rounded-full transition-all hover:scale-105"
                                    >
                                        Create Identity
                                    </button>
                                </div>
                                <p className="text-slate-400 text-sm font-mono mt-4">POWERED BY FLARE NETWORK</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Common Info Sections (Visible to All) */}
                <AboutSection ref={aboutRef} />
                <ReasonSection ref={reasonRef} />
                <SupportSection ref={supportRef} />
            </div>

            {/* Secondary Logout (Authenticated Only) */}
            {isAuthenticated && (
                <div className="max-w-7xl mx-auto px-6 mb-8 flex justify-end">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/';
                        }}
                        className="text-slate-500 hover:text-red-400 text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        Sign Out From Device →
                    </button>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default App;
