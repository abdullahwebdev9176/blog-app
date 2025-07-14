"use client";
import Header from './Header'
import Footer from './Footer'
import { AuthProvider } from '@/lib/context/AuthContext'
import ClientProtectedRoute from './ClientProtectedRoute'

const LayoutClientShell = ({children}) => {
  return (
    <AuthProvider>
        <ClientProtectedRoute>
            <Header />
                {children}
            <Footer />
        </ClientProtectedRoute>
    </AuthProvider>
  )
}

export default LayoutClientShell