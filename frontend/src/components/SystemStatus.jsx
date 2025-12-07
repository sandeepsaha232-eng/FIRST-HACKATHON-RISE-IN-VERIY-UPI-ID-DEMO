import React, { useState, useEffect } from 'react';
import { Activity, Database, Server } from 'lucide-react';
import axios from 'axios';

export default function SystemStatus() {
    const [backendStatus, setBackendStatus] = useState('checking'); // checking, online, offline
    const [dbStatus, setDbStatus] = useState('checking'); // checking, connected, disconnected

    useEffect(() => {
        const checkHealth = async () => {
            // Check Backend Root
            try {
                await axios.get('http://localhost:8000/', { timeout: 2000 });
                setBackendStatus('online');
            } catch (e) {
                setBackendStatus('offline');
            }

            // Check DB Health
            try {
                await axios.get('http://localhost:8000/health', { timeout: 2000 });
                setDbStatus('connected');
            } catch (e) {
                setDbStatus('disconnected');
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 font-mono text-xs">

            {/* Backend Indicator */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full backdrop-blur-md border ${backendStatus === 'online'
                ? 'bg-green-500/10 border-green-500/50 text-green-400'
                : 'bg-red-500/10 border-red-500/50 text-red-400'
                }`}>
                <Server className="w-3 h-3" />
                <span className="uppercase font-bold">API: {backendStatus}</span>
                <span className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            </div>

            {/* Database Indicator */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full backdrop-blur-md border ${dbStatus === 'connected'
                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                : 'bg-red-500/10 border-red-500/50 text-red-400'
                }`}>
                <Database className="w-3 h-3" />
                <span className="uppercase font-bold">DB: {dbStatus}</span>
                <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`} />
            </div>

        </div>
    );
}
