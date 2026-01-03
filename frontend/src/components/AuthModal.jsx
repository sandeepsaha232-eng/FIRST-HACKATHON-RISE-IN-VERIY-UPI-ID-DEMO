import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, Mail, Phone, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { authService } from '../services/auth';


const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form States
    const [formData, setFormData] = useState({
        email: 'sandeepsaha232@gmail.com',
        password: '123456789',
        full_name: 'Sandeep',
        phone: '8327458900',
        dob: '2006-01-01'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let user;
            if (isLogin) {
                user = await authService.login(formData.email, formData.password);
            } else {
                user = await authService.register(formData);
            }

            console.log("Auth Success:", user);
            alert(isLogin ? "Login Successful" : "Registration Successful");

            onLoginSuccess(user);
            onClose();

        } catch (err) {
            console.error(err);
            setError(isLogin ? "Login Failed" : "Registration Failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md mx-4 md:mx-auto rounded-3xl overflow-hidden shadow-2xl"
                >
                    {/* Glassmorphism Background */}
                    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl border border-white/10 z-0" />

                    {/* Ambient Glow */}
                    <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-50%] right-[-50%] w-full h-full bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>

                        {/* Premium Header with Logo */}
                        <div className="pt-10 pb-6 text-center">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 rotate-3 hover:rotate-6 transition-transform duration-500 mb-6">
                                <ShieldCheck size={32} className="text-white" />
                            </div>

                            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                                {isLogin ? 'Welcome Back' : 'Create Identity'}
                            </h2>
                            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                                <Lock size={12} /> Secured by Zero-Knowledge Proofs
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded font-bold">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-slate-500" size={18} />
                                        <input
                                            name="full_name" placeholder="Full Name" onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 text-slate-500" size={18} />
                                        <input
                                            name="phone" placeholder="Phone Number" onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-slate-500" size={18} />
                                        <input
                                            type="date" name="dob" onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input
                                    name="email" type="email" placeholder="Email Address" onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 text-white focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input
                                    name="password" type="password" placeholder="Password" onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 text-white focus:border-primary focus:outline-none"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
                            >
                                {loading ? 'PROCESSING...' : (isLogin ? 'ACCESS TERMINAL' : 'REGISTER IDENTITY')}
                                {!loading && <ArrowRight size={18} />}
                            </motion.button>
                        </form>

                        <div className="text-center mt-4">
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="text-slate-400 hover:text-white text-sm transition-colors"
                            >
                                {isLogin ? "Need an identity? Register" : "Already verified? Login"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
