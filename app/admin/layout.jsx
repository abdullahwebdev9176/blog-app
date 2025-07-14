'use client';

import Sidebar from "@/components/Sidebar";
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/lib/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { usePathname } from 'next/navigation';

export default function Layout({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    return (
        <AuthProvider>
            {isLoginPage ? (
                <>
                    <ToastContainer />
                    {children}
                </>
            ) : (
                <ProtectedRoute>
                    <div className="admin-layout">
                        <ToastContainer />
                        <div className="admin-layout-col-1">
                            <Sidebar />
                        </div>
                        <div className="admin-layout-col-2">
                            <div className="bg-dark text-white px-4 py-3">
                                <h1 className="admin-header mb-0">Admin Dashboard</h1>
                            </div>
                            <div className="p-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </ProtectedRoute>
            )}
        </AuthProvider>
    );
}