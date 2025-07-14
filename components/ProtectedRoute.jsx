'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const { admin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !admin) {
            router.push('/admin/login');
        }
    }, [admin, loading, router]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!admin) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
