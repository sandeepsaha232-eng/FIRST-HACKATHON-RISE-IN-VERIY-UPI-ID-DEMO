import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, X, ExternalLink } from 'lucide-react';
import axios from 'axios';

const History = ({ user }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Mock user ID 1 if not provided (for MVP demo stability)
                const userId = user?.id || 1;
                const res = await axios.get(`http://localhost:8000/api/history/${userId}`);
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchHistory();
    }, [user]);

    if (!user) return null;

    return (
        <section className="py-12 px-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <Clock className="text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Verification History</h2>
            </div>

            {loading ? (
                <div className="text-center text-slate-500">Loading records...</div>
            ) : (
                <div className="grid gap-4">
                    {history.length === 0 && (
                        <div className="text-slate-500 italic">No verification history found.</div>
                    )}
                    {history.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-surface border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${item.status === 'VERIFIED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {item.status === 'VERIFIED' ? <Check size={18} /> : <X size={18} />}
                                </div>
                                <div>
                                    <p className="text-white font-mono text-sm">{item.tx_hash}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(item.created_at).toLocaleString()} • {item.amount_wei} WEI
                                    </p>
                                </div>
                            </div>

                            <a
                                href={`https://coston2-explorer.flare.network/tx/${item.tx_hash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-400 hover:text-white transition-colors"
                            >
                                <ExternalLink size={16} />
                            </a>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default History;
