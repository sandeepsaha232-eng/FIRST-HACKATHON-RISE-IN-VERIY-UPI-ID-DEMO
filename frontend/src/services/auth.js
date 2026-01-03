
import { API_BASE_URL } from './api';
import axios from 'axios';

// DEMO_MODE: Set to true to bypass backend and use mockup data
const DEMO_MODE = true;

const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user'
};

export const authService = {
    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{user: object, token: string}>}
     */
    login: async (email, password) => {
        if (DEMO_MODE) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Mock success response
            const demoUser = {
                id: 1,
                name: 'Sandeep', // Default demo name, usually we'd fetch this
                email: email,
                wallet_address: '0xDemoWallet123',
                token: 'demo-token-123'
            };

            _saveSession(demoUser);
            return demoUser;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
            const { user, token } = response.data;
            _saveSession({ ...user, token });
            return { ...user, token };
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    },

    /**
     * Register new user
     * @param {object} userData 
     * @returns {Promise<{user: object, token: string}>}
     */
    register: async (userData) => {
        if (DEMO_MODE) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const demoUser = {
                id: Math.floor(Math.random() * 1000),
                name: userData.full_name,
                email: userData.email,
                phone: userData.phone,
                wallet_address: '0xNewDemoWallet' + Math.floor(Math.random() * 999),
                token: 'demo-token-register-' + Date.now()
            };

            _saveSession(demoUser);
            return demoUser;
        }

        try {
            // Format data as expected by backend
            const payload = {
                ...userData,
                dob: new Date(userData.dob).toISOString()
            };

            const response = await axios.post(`${API_BASE_URL}/auth/register`, payload);
            const { user, token } = response.data;
            _saveSession({ ...user, token });
            return { ...user, token };
        } catch (error) {
            console.error("Registration Error:", error);
            throw error;
        }
    },

    /**
     * Logout user
     */
    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
    },

    /**
     * Get current user from storage
     * @returns {object|null}
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated: () => {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    }
};

/**
 * Helper to save session
 * @param {object} user 
 */
const _saveSession = (user) => {
    if (!user) return;
    const token = user.token;
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};
