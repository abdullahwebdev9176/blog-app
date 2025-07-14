'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const ClientProtectedRoute = ({ children }) => {
    const { admin, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If admin is logged in and tries to access public pages, redirect to admin dashboard
        if (!loading && admin && !pathname.startsWith('/admin')) {
            router.push('/admin');
        }
    }, [admin, loading, pathname, router]);

    // If admin is logged in and on public pages, show loading or redirect
    if (admin && !pathname.startsWith('/admin')) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Redirecting...</span>
                </div>
            </div>
        );
    }

    return children;
};

export default ClientProtectedRoute;
