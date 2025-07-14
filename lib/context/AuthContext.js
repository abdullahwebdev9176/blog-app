'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check authentication status
    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/admin/auth');
            if (response.data.authenticated) {
                setAdmin(response.data.admin);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setAdmin(null);
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/admin/login', {
                username,
                password
            });
            
            if (response.data.success) {
                setAdmin(response.data.admin);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Login failed' 
            };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.post('/api/admin/logout');
            setAdmin(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        admin,
        loading,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
