import React, { useState } from 'react';
import { api } from '../services/api';
import { Terminal, UploadCloud, Check, X, Loader2, Link as LinkIcon, Shield, Fingerprint, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
    { title: "Analyzing Receipt via OCR", icon: <Fingerprint className="w-4 h-4" /> },
    { title: "Verifying VPA Integrity", icon: <Activity className="w-4 h-4" /> },
    { title: "Submitting to Flare Oracle", icon: <Shield className="w-4 h-4" /> }
];

export default function VerificationTerminal({ onStatusChange }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('upload'); // upload, processing, verified
    const [currentStep, setCurrentStep] = useState(0);
    const [result, setResult] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [manualId, setManualId] = useState("");

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            startVerification(e.target.files[0]);
        }
    };

    const handleManualVerify = () => {
        if (!manualId) return;
        // Skip analysis, go straight to verify
        startVerification(null, manualId);
    };

    const startVerification = async (selectedFile, manualUpiId = null) => {
        setStatus('processing');
        onStatusChange('verifying_on_chain');
        setErrorMsg(null);
        setCurrentStep(0);

        try {
            let upiId = manualUpiId;
            let method = "MANUAL";

            // Step 1: Analysis (if file provided)
            if (selectedFile) {
                console.log("Starting Analysis...");
                const formData = new FormData();
                formData.append('file', selectedFile);

                const analysis = await api.analyzeImage(formData);
                console.log("Analysis Result:", analysis);

                if (!analysis.upi_id) {
                    throw new Error("Could not extract UPI ID from image. Please try again or use manual entry.");
                }
                upiId = analysis.upi_id;
                method = analysis.method;
            } else {
                // Manual Flow - Skip Step 0 visual delay
                setCurrentStep(1);
            }

            // Step 2: Verification
            setCurrentStep(1);
            // Small delay for UX if it was instant
            if (selectedFile) await new Promise(r => setTimeout(r, 1000));

            console.log("Verifying UPI:", upiId);
            const verifyResult = await api.verifyUpi(upiId);
            console.log("Verify Result:", verifyResult);

            if (!verifyResult.validation.is_active) {
                throw new Error(verifyResult.validation.status_message || "UPI ID is invalid");
            }

            // Step 3: Oracle Submission (Attestation)
            setCurrentStep(2);
            await new Promise(r => setTimeout(r, 1500)); // UX Delay for Oracle simulation

            const attestation = verifyResult.attestation;
            if (attestation.attestation_status !== "VERIFIED") {
                throw new Error("Flare FDC Attestation Failed");
            }

            // Success Data Construction
            const data = {
                tx_id: attestation.proof, // Merkle Root as ID
                is_valid: true,
                timestamp: attestation.timestamp,
                vote_count: attestation.attestation_round, // Using round as vote count proxy
                upi_id: upiId,
                registered_name: verifyResult.validation.registered_name
            };

            setResult(data);
            setStatus('verified');
            onStatusChange('verified');

        } catch (e) {
            console.error(e);
            setErrorMsg(e.message || "Verification Failed");
            setStatus('upload'); // Go back to upload but show error
            onStatusChange('failed');
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto relative z-10 px-4">
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden relative">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <div className="flex items-center space-x-3 text-cyan-400">
                        <Terminal className="w-5 h-5" />
                        <span className="text-sm font-mono tracking-widest uppercase font-bold">Trust Engine v2.0</span>
                    </div>
                    <div className="flex space-x-1">
                        <span className="w-2 h-2 rounded-full bg-red-500/20" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500/20" />
                        <span className="w-2 h-2 rounded-full bg-green-500/20" />
                    </div>
                </div>

                <AnimatePresence mode='wait'>

                    {/* STATE 1: SELECTION (SPLIT VIEW) */}
                    {status === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {errorMsg && (
                                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs font-mono text-center">
                                    ❌ {errorMsg}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* LEFT: Manual Verification */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-center space-y-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4 text-cyan-400" /> Manual Verification
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1">Verify existing chain transactions</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">UPI ID / VPA</label>
                                            <input
                                                type="text"
                                                value={manualId}
                                                onChange={(e) => setManualId(e.target.value)}
                                                placeholder="example@bank"
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                            />
                                        </div>
                                        <button
                                            onClick={handleManualVerify}
                                            disabled={!manualId}
                                            className={`w-full font-bold text-sm py-2 rounded-lg transition-all ${manualId ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-700/20 text-slate-500 border border-transparent cursor-not-allowed'
                                                }`}
                                        >
                                            Verify ID
                                        </button>
                                    </div>
                                </div>

                                {/* RIGHT: Upload Verification */}
                                <div className="group relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center transition-all hover:border-cyan-500/50 hover:bg-cyan-500/5 flex flex-col items-center justify-center">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        onChange={handleFileChange}
                                        accept="image/*,.pdf"
                                    />
                                    <div className="p-3 bg-slate-800 rounded-full group-hover:scale-110 transition-transform shadow-xl mb-3">
                                        <UploadCloud className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Upload Receipt/QR</h3>
                                    <p className="text-slate-400 text-xs mt-1 mb-2">Drag & Drop Evidence</p>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono border px-2 py-1 rounded border-slate-700">
                                        JPG, PNG
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STATE 2: PROCESSING (STEPPER) */}
                    {status === 'processing' && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6 py-4"
                        >
                            {steps.map((step, idx) => (
                                <div key={idx} className={`flex items-center space-x-4 p-4 rounded-xl border transition-all ${idx === currentStep ? 'bg-cyan-500/10 border-cyan-500/30' :
                                    idx < currentStep ? 'bg-green-500/5 border-green-500/20 opacity-50' :
                                        'bg-white/5 border-white/5 opacity-30'
                                    }`}>
                                    <div className={`p-2 rounded-lg ${idx <= currentStep ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-white'
                                        }`}>
                                        {idx < currentStep ? <Check className="w-5 h-5" /> :
                                            idx === currentStep ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                                step.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white">{step.title}</p>
                                        {idx === currentStep && (
                                            <p className="text-xs text-cyan-400 font-mono animate-pulse">Processing...</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* STATE 3: VERDICT (RESULT CARD) */}
                    {status === 'verified' && result && (
                        <motion.div
                            key="verified"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <div className="bg-gradient-to-b from-green-500/10 to-green-900/10 border border-green-500/30 rounded-xl p-8 relative overflow-hidden">
                                {/* Success Icon */}
                                <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 mb-6">
                                    <Check className="w-8 h-8 text-white" />
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2">Immutable Proof Certificate</h2>
                                <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                                    The Flare Trust Oracle has verified the VPA <strong>{result.upi_id}</strong> (Owner: {result.registered_name}) as VALID.
                                </p>

                                <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto mb-8">
                                    <div className="bg-black/20 p-3 rounded-lg">
                                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Merkle Proof Root</p>
                                        <p className="text-xs text-cyan-400 font-mono break-all">{result.tx_id.substring(0, 16)}...</p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg">
                                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">FDC Consensus</p>
                                        <p className="text-xs text-green-400 font-mono font-bold">
                                            ROUND #{result.vote_count}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setStatus('upload');
                                        setManualId("");
                                    }}
                                    className="text-sm text-slate-500 hover:text-white underline transition-colors"
                                >
                                    Verify Another Receipt
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
