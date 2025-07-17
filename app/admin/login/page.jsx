'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faSignInAlt, faSpinner, faShield } from '@fortawesome/free-solid-svg-icons';
import '@/components/AdminStyles.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await login(username, password);
            
            if (result.success) {
                toast.success('Login successful! Welcome to admin dashboard.');
                router.push('/admin');
            } else {
                toast.error(result.error || 'Login failed');
            }
        } catch (error) {
            toast.error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem'
        }}>
            <div className="admin-card" style={{ 
                width: '100%', 
                maxWidth: '400px',
                boxShadow: 'var(--admin-shadow-lg)'
            }}>
                <div className="admin-card-header" style={{ textAlign: 'center' }}>
                    <div style={{ 
                        width: '64px', 
                        height: '64px', 
                        borderRadius: '50%',
                        background: 'var(--admin-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: 'white'
                    }}>
                        <FontAwesomeIcon icon={faShield} style={{ fontSize: '1.5rem' }} />
                    </div>
                    <h1 className="admin-card-title" style={{ marginBottom: '0.5rem' }}>
                        Admin Login
                    </h1>
                    <p style={{ 
                        margin: 0, 
                        color: 'var(--admin-text-secondary)',
                        fontSize: '0.875rem'
                    }}>
                        Sign in to access the admin dashboard
                    </p>
                </div>
                
                <div className="admin-card-body">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="admin-form-group">
                            <label className="admin-label">
                                <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.5rem' }} />
                                Username
                            </label>
                            <input
                                type="text"
                                className="admin-input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <FontAwesomeIcon 
                                icon={faUser} 
                                style={{ 
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--admin-text-tertiary)',
                                    pointerEvents: 'none'
                                }}
                            />
                        </div>
                        
                        <div className="admin-form-group" style={{ position: 'relative' }}>
                            <label className="admin-label">
                                <FontAwesomeIcon icon={faLock} style={{ marginRight: '0.5rem' }} />
                                Password
                            </label>
                            <input
                                type="password"
                                className="admin-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <FontAwesomeIcon 
                                icon={faLock} 
                                style={{ 
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '62%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--admin-text-tertiary)',
                                    pointerEvents: 'none'
                                }}
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary admin-btn-lg"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faSignInAlt} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="admin-card-footer" style={{ textAlign: 'center' }}>
                    <p style={{ 
                        margin: 0, 
                        color: 'var(--admin-text-tertiary)',
                        fontSize: '0.75rem'
                    }}>
                        Protected admin area. Authorized access only.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
