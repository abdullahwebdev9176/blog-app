export default function Layout({ children }) {
    return (
        <>
            <div className="admin-layout mt-5">
                <div className="admin-layout-col-1">

                </div>
                <div className="admin-layout-col-2">
                    <div className="bg-dark text-white p-4">
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    </div>

                    <div className="p-4">
                        {children}
                    </div>
                    <div className="bg-dark text-white p-4 text-center">
                        &copy; {new Date().getFullYear()} My Blog
                    </div>
                </div>
            </div>
        </>
    );
}