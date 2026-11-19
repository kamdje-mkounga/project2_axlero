import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

export default function AdminDashboard() {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAdminData() {
            try {
                setLoading(true);
                // 1. Fetch Users
                let userRes;
                try {
                    userRes = await fetch('/api/auth/users', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch {
                    userRes = await fetch('http://localhost:5000/api/auth/users', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
                if (userRes.ok) {
                    const userData = await userRes.json();
                    if (Array.isArray(userData)) setUsers(userData);
                }

                // 2. Fetch Products
                let prodRes;
                try {
                    prodRes = await fetch('/api/products');
                } catch {
                    prodRes = await fetch('http://localhost:5000/api/products');
                }
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    if (Array.isArray(prodData)) setProducts(prodData);
                }
            } catch (err) {
                console.warn('Error fetching admin dashboard data:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchAdminData();
    }, [token]);

    const totalVendors = users.filter((u) => u.role === 'vendor').length;
    const totalCustomers = users.filter((u) => u.role === 'customer' || u.role === 'consumer').length;
    const totalAdmins = users.filter((u) => u.role === 'admin').length;

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>Welcome, Administrator</h1>
                    <p>Live platform metrics and user access control overview.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="/admin/users">
                        <button className="secondary-btn">Manage Users</button>
                    </Link>
                    <Link to="/admin/products">
                        <button className="primary-btn">Review Catalog</button>
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4338ca' }}>👥</div>
                    <p className="stat-label">Total Users</p>
                    <div className="stat-value">{loading ? '...' : users.length}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}>🏪</div>
                    <p className="stat-label">Verified Vendors</p>
                    <div className="stat-value">{loading ? '...' : totalVendors}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#dcfce7', color: '#15803d' }}>🛍️</div>
                    <p className="stat-label">Customers</p>
                    <div className="stat-value">{loading ? '...' : totalCustomers}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fee2e2', color: '#b91c1c' }}>📦</div>
                    <p className="stat-label">Total Products</p>
                    <div className="stat-value">{loading ? '...' : products.length}</div>
                </div>
            </div>

            {/* Security & System Status Banner */}
            <div className="panel" style={{ marginBottom: '24px', background: '#f8fafc', borderLeft: '4px solid #3b82f6' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                    🛡️ Security & Role-Based Access Control Status
                </h3>
                <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>
                    RBAC middleware is enforcing role separation for <strong>Admin</strong>, <strong>Vendor</strong>, and <strong>Customer</strong>.
                    Active administrators registered: <strong>{totalAdmins}</strong>.
                </p>
            </div>

            {/* Recent Registrations Table */}
            <div className="panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2>Recent Users ({users.length})</h2>
                    <Link to="/admin/users" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>
                        View All Users →
                    </Link>
                </div>

                {loading ? (
                    <p style={{ color: '#666', padding: '16px 0' }}>Loading user data...</p>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>ROLE</th>
                                    <th>JOINED</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.slice(0, 5).map((u) => (
                                    <tr key={u._id || u.id}>
                                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                                        <td style={{ color: '#64748b' }}>{u.email}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                background: u.role === 'admin' ? '#fee2e2' : u.role === 'vendor' ? '#fef3c7' : '#e0e7ff',
                                                color: u.role === 'admin' ? '#991b1b' : u.role === 'vendor' ? '#92400e' : '#3730a3',
                                            }}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ color: '#64748b' }}>
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
