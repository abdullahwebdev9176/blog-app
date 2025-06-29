import Sidebar from "@/components/Sidebar";
import { ToastContainer } from 'react-toastify';

export default function Layout({ children }) {
    return (
        <>

            <div className="admin-layout">
                <ToastContainer />
                <div className="admin-layout-col-1">
                    <Sidebar />
                </div>
                <div className="admin-layout-col-2">
                    <div className="bg-dark text-white px-4 py-3">
                        <h1 className="admin-header">Admin Dashboard</h1>
                    </div>
                    <div className="p-4">
                        {children}
                    </div>


                </div>
            </div>
        </>
    );
}