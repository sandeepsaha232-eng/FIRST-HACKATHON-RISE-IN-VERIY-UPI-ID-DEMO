import React from 'react';
import { motion } from 'framer-motion';
import { FileWarning } from 'lucide-react';

const Reason = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 absolute top-0 left-0 z-40 pt-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl w-full px-6 md:px-12 flex flex-col items-center text-center space-y-8"
            >
                <div className="p-6 bg-red-500/10 rounded-full mb-4 animate-pulse">
                    <FileWarning className="w-20 h-20 text-red-500" />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                    The Daily Struggle
                </h1>

                <p className="text-2xl md:text-3xl text-slate-300 max-w-3xl leading-relaxed">
                    Proving payments for rent, electricity, & shared expenses is a mess.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12 text-left">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-colors">
                        <div className="w-3 h-3 bg-red-500 rounded-full mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Fake Screenshots</h3>
                        <p className="text-slate-400">Digital receipts are easily doctored, leading to distrust and fraud.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-colors">
                        <div className="w-3 h-3 bg-red-500 rounded-full mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Lost Records</h3>
                        <p className="text-slate-400">Physical papers fade or get lost. Emails get buried in spam.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-colors">
                        <div className="w-3 h-3 bg-red-500 rounded-full mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Wasted Time</h3>
                        <p className="text-slate-400">Managers spend countless hours manually verifying claims.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Reason;
