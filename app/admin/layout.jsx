'use client';

import Sidebar from "@/components/Sidebar";
import { ToastContainer } from 'react-toastify';
import '@/components/AdminStyles.css';

export default function Layout({ children }) {

    return (
        <>
            <div className="modern-admin-layout">
                <ToastContainer 
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <Sidebar />
                <div className="admin-main-content">
                    <div className="admin-header">
                        <div className="admin-header-content">
                            <h1 className="admin-title">Admin Dashboard</h1>
                            <div className="admin-header-actions">
                                <span className="admin-badge admin-badge-success">Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="admin-page-container">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}