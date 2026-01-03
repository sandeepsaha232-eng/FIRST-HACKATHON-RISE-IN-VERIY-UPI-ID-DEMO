import React, { useState } from 'react';

const UPIVerification = () => {
    const [step, setStep] = useState(1); // 1: Upload, 2: Review, 3: Result
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', image);

        try {
            // Update URL to your backend
            const response = await fetch('http://127.0.0.1:8000/api/analyze-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Analysis failed');
            }

            const data = await response.json();
            setAnalysisResult(data);
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/verify-upi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ upi_id: analysisResult.upi_id }),
            });

            if (!response.ok) throw new Error('Verification failed');

            const data = await response.json();
            setVerificationResult(data);
            setStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl text-white">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent mb-6">
                UPI Verification (Flare Powered)
            </h2>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
                    ⚠️ {error}
                </div>
            )}

            {/* Step 1: Upload */}
            {step === 1 && (
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="upi-upload"
                        />
                        <label htmlFor="upi-upload" className="cursor-pointer flex flex-col items-center">
                            {preview ? (
                                <img src={preview} alt="Preview" className="max-h-48 rounded-md mb-2" />
                            ) : (
                                <div className="text-4xl mb-2">📸</div>
                            )}
                            <span className="text-slate-300">
                                {preview ? "Change Image" : "Upload UPI QR or Screenshot"}
                            </span>
                        </label>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={!image || isLoading}
                        className={`w-full py-3 rounded-lg font-semibold transition-all ${!image || isLoading
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                            }`}
                    >
                        {isLoading ? "Scanning..." : "Scan & Extract ID"}
                    </button>
                </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && analysisResult && (
                <div className="space-y-4 animate-fade-in">
                    <div className="bg-slate-800 p-4 rounded-lg">
                        <label className="text-xs text-slate-400 uppercase tracking-widest">Extracted UPI ID</label>
                        <div className="text-xl font-mono text-pink-400 break-all mt-1">
                            {analysisResult.upi_id || "No ID Found"}
                        </div>
                        <div className="mt-2 flex gap-2">
                            <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                                Method: {analysisResult.method}
                            </span>
                        </div>
                    </div>

                    {!analysisResult.upi_id ? (
                        <div className="text-yellow-400 text-sm">
                            Could not find a valid UPI ID. Please try another image.
                            <button onClick={() => setStep(1)} className="block mt-2 text-indigo-400 underline">Try Again</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleVerify}
                                disabled={isLoading}
                                className="py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium"
                            >
                                {isLoading ? "Verifying..." : "Verify on Flare"}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Result */}
            {step === 3 && verificationResult && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center">
                        <div className="text-5xl mb-3">
                            {verificationResult.validation.is_active ? "✅" : "❌"}
                        </div>
                        <h3 className="text-xl font-bold text-white">
                            {verificationResult.validation.is_active ? "Verification Successful" : "Verification Failed"}
                        </h3>
                        <p className={`text-sm ${verificationResult.validation.is_active ? "text-green-400" : "text-red-400"}`}>
                            {verificationResult.validation.status_message}
                        </p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm">Registered Name</span>
                            <span className="text-white font-medium">{verificationResult.validation.registered_name || "N/A"}</span>
                        </div>
                        <div className="h-px bg-slate-700"></div>
                        <div>
                            <span className="text-slate-400 text-sm block mb-1">Flare Attestation Proof</span>
                            <div className="font-mono text-xs text-slate-500 bg-black/30 p-2 rounded break-all">
                                {verificationResult.attestation.proof || "Pending"}
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-slate-400 text-sm">Attestation Status</span>
                            <span className="text-indigo-300 font-bold">{verificationResult.attestation.attestation_status}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setStep(1);
                            setImage(null);
                            setPreview(null);
                        }}
                        className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                        Verify Another
                    </button>
                </div>
            )}
        </div>
    );
};

export default UPIVerification;
