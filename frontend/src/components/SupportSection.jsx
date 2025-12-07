import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, LifeBuoy } from 'lucide-react';

const SupportSection = forwardRef((props, ref) => {
    return (
        <section ref={ref} id="support" className="min-h-screen flex items-center justify-center px-4 bg-slate-900 py-20">
            {/* 50% Width Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full md:w-1/2 bg-surface border border-slate-700 rounded-2xl p-12 shadow-2xl relative overflow-hidden"
            >
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />

                <div className="flex items-center gap-4 mb-8">
                    <LifeBuoy className="w-10 h-10 text-primary" />
                    <h1 className="text-3xl font-bold text-white">Customer Support</h1>
                </div>

                <div className="space-y-8">
                    <p className="text-slate-400 text-lg">
                        Need help verifying a transaction or have questions about the platform? Reach out to our dedicated support team.
                    </p>

                    <div className="space-y-6">
                        {/* Email */}
                        <div className="flex items-start gap-4 p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors group">
                            <div className="p-3 bg-slate-800 rounded-lg group-hover:scale-110 transition-transform">
                                <Mail className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Email Us</h3>
                                <p className="text-white font-mono text-lg break-all">nightcoders.sot25@pwioi.com</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-4 p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors group">
                            <div className="p-3 bg-slate-800 rounded-lg group-hover:scale-110 transition-transform">
                                <Phone className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Call Us</h3>
                                <p className="text-white font-mono text-lg">+91 83274589XX</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-700 text-center">
                    <p className="text-slate-500 text-sm">Available Mon-Fri, 9AM - 6PM IST</p>
                </div>
            </motion.div>
        </section>
    );
});

export default SupportSection;
