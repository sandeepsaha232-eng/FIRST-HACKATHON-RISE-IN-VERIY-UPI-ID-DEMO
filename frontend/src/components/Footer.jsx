import React from 'react';
import { Shield, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full bg-slate-900 border-t border-slate-800 pt-16 pb-8 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <Shield className="text-emerald-500 w-8 h-8" />
                            <span className="text-white font-bold text-xl tracking-wider">EXPENSESHIELD</span>
                        </div>
                        <p className="text-slate-400 text-base leading-relaxed">
                            Securing financial truth with blockchain verification. Trusted by thousands for instant, fraud-proof expense validation.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-emerald-500 transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-emerald-500 transition-all">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-emerald-500 transition-all">
                                <Github size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Spacer Column */}
                    <div className="hidden md:block col-span-1"></div>

                    {/* Links Columns */}
                    <div className="col-span-1 space-y-4">
                        <h4 className="text-white font-bold tracking-wide uppercase text-base">Legal</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-400 hover:text-emerald-400 text-base transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-emerald-400 text-base transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-emerald-400 text-base transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>

                    <div className="col-span-1 space-y-4">
                        <h4 className="text-white font-bold tracking-wide uppercase text-base">Support</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-400 hover:text-emerald-400 text-base transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-emerald-400 text-base transition-colors">Feedback</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-emerald-400 text-base transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm text-center md:text-left">
                        ©️ 2025 ExpenseShield. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-slate-500 text-sm font-mono uppercase tracking-widest">System Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
