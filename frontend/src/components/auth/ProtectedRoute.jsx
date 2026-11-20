import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';

export default function ProtectedRoute({ allowedRoles = [], children }) {
    const { user, token, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <p>Verifying authentication...</p>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!token || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role-Based Access Control
    if (allowedRoles.length > 0) {
        const userRole = (user.role || 'customer').toLowerCase().trim();
        // Admins automatically have elevated access to all management areas
        const isAuthorized = userRole === 'admin' || allowedRoles.map(r => r.toLowerCase()).includes(userRole);

        if (!isAuthorized) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
                    <div className="panel" style={{ maxWidth: '480px', textAlign: 'center', padding: '36px 24px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
                        <h2 style={{ marginBottom: '10px', color: '#1e293b' }}>Access Denied</h2>
                        <p style={{ color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
                            You are logged in as <strong>{user.name}</strong> (<span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>{user.role}</span>).
                        </p>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                            This area requires <strong>{allowedRoles.join(' or ')}</strong> permissions.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <a href="/" className="primary-btn" style={{ textDecoration: 'none', padding: '10px 18px' }}>
                                Back to Storefront
                            </a>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return children;
}
