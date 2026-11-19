import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';

export default function AdminUsers() {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState('All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                let res;
                try {
                    res = await fetch('/api/auth/users', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch {
                    res = await fetch('http://localhost:5000/api/auth/users', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) setUsers(data);
                }
            } catch (err) {
                console.warn('Error loading users:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [token]);

    const filteredUsers = users.filter((u) => {
        const matchesRole =
            selectedRole === 'All' ||
            (selectedRole === 'Customer' && (u.role === 'customer' || u.role === 'consumer')) ||
            (selectedRole === 'Vendor' && u.role === 'vendor') ||
            (selectedRole === 'Admin' && u.role === 'admin');

        const q = search.toLowerCase().trim();
        const matchesSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);

        return matchesRole && matchesSearch;
    });

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>Platform Users</h1>
                    <p>Manage and audit all registered accounts across roles.</p>
                </div>
            </div>

            <div className="panel" style={{ marginBottom: '20px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Role Filter Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['All', 'Admin', 'Vendor', 'Customer'].map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setSelectedRole(role)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    border: '1px solid #cbd5e1',
                                    background: selectedRole === role ? '#1e293b' : '#ffffff',
                                    color: selectedRole === role ? '#ffffff' : '#475569',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {role} ({role === 'All' ? users.length : users.filter(u => {
                                    if (role === 'Customer') return u.role === 'customer' || u.role === 'consumer';
                                    return u.role === role.toLowerCase();
                                }).length})
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            width: '260px',
                            fontSize: '14px',
                        }}
                    />
                </div>
            </div>

            <div className="panel">
                <h2>User Directory ({filteredUsers.length} shown)</h2>
                {loading ? (
                    <p style={{ color: '#666', padding: '20px 0' }}>Loading users from database...</p>
                ) : filteredUsers.length === 0 ? (
                    <p style={{ color: '#666', padding: '20px 0' }}>No users found matching your criteria.</p>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>ROLE</th>
                                    <th>USER ID</th>
                                    <th>REGISTERED</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u._id || u.id}>
                                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                                        <td style={{ color: '#475569' }}>{u.email}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                background: u.role === 'admin' ? '#fee2e2' : u.role === 'vendor' ? '#fef3c7' : '#e0e7ff',
                                                color: u.role === 'admin' ? '#991b1b' : u.role === 'vendor' ? '#92400e' : '#3730a3',
                                            }}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ color: '#94a3b8', fontSize: '12px', fontFamily: 'monospace' }}>
                                            {u._id || u.id}
                                        </td>
                                        <td style={{ color: '#64748b', fontSize: '13px' }}>
                                            {u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A'}
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
