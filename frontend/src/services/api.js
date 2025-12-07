import axios from 'axios';

// EMERGENCY FIX: Hardcoded Base URL
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const api = {
    submitProof: async (txHash) => {
        // Hardcoded demo values for user_id/chain_id as per MVP scope
        try {
            const response = await axios.post(`${API_BASE_URL}/submit-proof`, {
                user_id: 1, // Assuming test user ID 1 exists
                tx_hash: txHash,
                chain_id: "CL2FM",
                amount_wei: "0", // Will be verified on chain
                metadata_info: "Frontend Submission"
            });
            return response.data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },

    pollStatus: async (proofId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/status/${proofId}`);
            return response.data;
        } catch (error) {
            console.error("Poll Error:", error);
            throw error;
        }
    },

    uploadReceipt: async (formData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/upload-receipt`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error("Upload Error:", error);
            throw error;
        }
    }
};
