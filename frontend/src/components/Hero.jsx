import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

const Hero = ({ appState }) => {
    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-slate-900 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-screen animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl mix-blend-screen" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-4 max-w-4xl px-4">
                <p className="font-mono text-cyan-400 tracking-[0.2em] text-sm md:text-base font-bold uppercase stencil-effect">
                    Welcome to ExpenseShield
                </p>
                <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight leading-tight">
                    Stop Faking Receipts.<br />
                    <span className="text-cyan-500">Verify on Chain.</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-400 italic font-light tracking-wide">
                    "Where every expense earns trust."
                </p>
            </div>

            {/* Spline Scene Container (Positioned Relative to Text) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-60 scale-125 translate-y-20">
                <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
            </div>

            <div className="absolute bottom-10 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-scroll" />
                </div>
            </div>
        </div>
    );
};

export default Hero;
