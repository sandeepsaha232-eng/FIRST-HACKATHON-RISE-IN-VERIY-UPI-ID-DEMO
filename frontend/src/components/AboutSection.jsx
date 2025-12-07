import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle } from 'lucide-react';

const AboutSection = forwardRef((props, ref) => {
    return (
        <section ref={ref} id="about" className="min-h-screen py-24 px-6 md:px-12 max-w-7xl mx-auto text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto space-y-8"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Our Mission
                    </h1>
                    <p className="text-xl text-slate-400">
                        Bridging the gap between manual verification and blockchain certainty.
                    </p>
                </div>

                {/* Content */}
                <div className="bg-surface border border-slate-700 p-8 rounded-2xl shadow-xl">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-cyan-500/10 rounded-lg">
                            <ShieldCheck className="w-10 h-10 text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold">How We Help You</h2>
                    </div>

                    <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        We provide an unforgeable proof of expense. By uploading a Transaction Hash or Receipt,
                        our system verifies it on-chain against real-time data or multiple independent sources.
                        Impossible to fake. Instant to verify.
                    </p>

                    <ul className="grid gap-4 md:grid-cols-2">
                        <li className="flex items-center space-x-3 bg-black/20 p-4 rounded-lg">
                            <CheckCircle className="text-emerald-500" />
                            <span>Permanent proof stored on Flare Network</span>
                        </li>
                        <li className="flex items-center space-x-3 bg-black/20 p-4 rounded-lg">
                            <CheckCircle className="text-emerald-500" />
                            <span>Instant verification for landlords/managers</span>
                        </li>
                        <li className="flex items-center space-x-3 bg-black/20 p-4 rounded-lg">
                            <CheckCircle className="text-emerald-500" />
                            <span>USD Value locked at time of expense</span>
                        </li>
                        <li className="flex items-center space-x-3 bg-black/20 p-4 rounded-lg">
                            <CheckCircle className="text-emerald-500" />
                            <span>FTSO Oracle Price Feeds</span>
                        </li>
                    </ul>
                </div>
            </motion.div>
        </section>
    );
});

export default AboutSection;
