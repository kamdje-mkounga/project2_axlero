import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const { register, loading } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        register(name, email, password, role);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
            <div className="panel" style={{ width: '100%', maxWidth: '400px', padding: '30px' }}>
                <h2 style={{ marginBottom: '8px', textAlign: 'center' }}>Create Account</h2>
                <p style={{ color: '#666', marginBottom: '24px', textAlign: 'center' }}>Join Axlero Store today</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '6px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '6px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '6px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label htmlFor="role">I want to register as</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff' }}
                        >
                            <option value="customer">Customer (Shop products)</option>
                            <option value="vendor">Vendor (Sell products)</option>
                        </select>
                    </div>

                    <button type="submit" className="primary-btn" disabled={loading} style={{ width: '100%', marginTop: '8px', padding: '12px' }}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
                    Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 500 }}>Login</Link>
                </p>
            </div>
        </div>
    );
}