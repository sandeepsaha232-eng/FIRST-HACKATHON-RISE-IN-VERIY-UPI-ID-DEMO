import React from 'react';
import { FileWarning, CheckCircle, Search, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProblemSolution() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-20 px-6">
            {/* Column 1: Hope & Research */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Hope Through Research</h2>
                </div>
                <p className="text-xl text-text leading-relaxed">
                    Research is advancing everywhere. Promising developments are creating new paths to wellness.
                </p>
                <ul className="space-y-4 text-text/80">
                    <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span>New targeted therapies are emerging.</span>
                    </li>
                    <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span>Rising remission rates globally.</span>
                    </li>
                    <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span>Success in holistic management.</span>
                    </li>
                </ul>
            </motion.div>

            {/* Column 2: The Solution */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-secondary/10 rounded-lg">
                        <ShieldCheck className="w-8 h-8 text-secondary" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">The Flare Solution</h2>
                </div>
                <p className="text-xl text-text leading-relaxed">
            Upload a Tx Hash -> We verify it on-chain. Impossible to fake.
                </p>
                <ul className="space-y-4 text-text/80">
                    <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-secondary rounded-full" />
                        <span>Permanent proof stored on Flare.</span>
                    </li>
                    <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-secondary rounded-full" />
                        <span>Instant verification for landlords.</span>
                    </li>
                    <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-secondary rounded-full" />
                        <span>USD Value from FTSO Oracles.</span>
                    </li>
                </ul>
            </motion.div>
        </div>
    );
}
