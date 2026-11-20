import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';

function AdminSidebar() {
    return (
        <aside className="sidebar" style={{ background: '#0f172a' }}>
            <div className="brand" style={{ display: 'flex', alignItems: 'center' }}>
                Axlero<span style={{ color: '#ef4444' }}>.</span>
                <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.8px',
                    background: '#ef4444',
                    color: '#ffffff',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    marginLeft: '8px',
                }}>
                    ADMIN
                </span>
            </div>

            <p className="sidebar-label">CONTROL PANEL</p>

            <nav className="sidebar-nav">
                <NavLink to="/admin/dashboard" className="nav-link">
                    <span>▦</span> System Dashboard
                </NavLink>
                <NavLink to="/admin/users" className="nav-link">
                    <span>👥</span> User Management
                </NavLink>
                <NavLink to="/admin/products" className="nav-link">
                    <span>📦</span> Platform Products
                </NavLink>
            </nav>

            <div className="sidebar-bottom" style={{ borderTop: '1px solid #1e293b' }}>
                <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Portals</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link to="/" className="switch-portal-btn">
                        ← Consumer Storefront
                    </Link>
                    <Link to="/vendor/dashboard" className="switch-portal-btn" style={{ color: '#a5b4fc' }}>
                        💼 Vendor Portal
                    </Link>
                </div>
            </div>
        </aside>
    );
}

export default function AdminLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const titles = {
        '/admin/dashboard': 'Admin Command Center',
        '/admin/users': 'Platform User Management',
        '/admin/products': 'Global Product Moderation',
    };

    return (
        <div className="dashboard-layout">
            <AdminSidebar />
            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-title">
                        {titles[location.pathname] || 'Admin Portal'}
                    </div>
                    <div className="profile" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                                {user?.name || 'Administrator'}
                            </div>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#ef4444',
                                background: '#fee2e2',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                display: 'inline-block'
                            }}>
                                SUPER ADMIN
                            </span>
                        </div>
                        <div className="avatar" style={{ background: '#ef4444', color: '#fff', fontWeight: 700 }}>
                            {user?.name ? user.name[0].toUpperCase() : 'A'}
                        </div>
                        <button
                            type="button"
                            onClick={logout}
                            className="secondary-btn sm"
                            style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="page-content" style={{ padding: '30px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
