import React from 'react';
import { Shield } from 'lucide-react';

const Header = ({ onAuthClick, isAuthenticated, user, onNavigate }) => {

    const NavButton = ({ section, label }) => (
        <button
            onClick={() => onNavigate(section)}
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium uppercase tracking-wide cursor-pointer"
        >
            {label}
        </button>
    );

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-slate-700 h-16 flex items-center justify-between px-6">
            {/* Left: Logo */}
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group">
                <Shield className="text-primary w-8 h-8 group-hover:rotate-12 transition-transform" />
                <span className="text-white font-bold text-xl tracking-wider">EXPENSESHIELD</span>
            </button>

            {/* Center: Navigation */}
            <nav className="hidden md:flex items-center gap-8">
                <NavButton section="home" label="Home" />
                <NavButton section="about" label="About Us" />
                <NavButton section="reason" label="Reason" />
                <NavButton section="support" label="Support" />
            </nav>

            {/* Right: Auth Button */}
            <div>
                {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                        <span className="text-text text-sm hidden lg:block">Welcome, {user?.full_name || 'User'}</span>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.location.href = '/';
                            }}
                            className="text-xs text-red-400 hover:text-white border border-red-500/30 hover:bg-red-500/20 px-3 py-1 rounded-lg transition-all ml-2"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onAuthClick}
                        className="bg-primary hover:bg-emerald-400 text-white font-bold py-2 px-6 rounded-full shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105"
                    >
                        Login / Sign Up
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
