import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
            <div className="panel" style={{ width: '100%', maxWidth: '400px', padding: '30px' }}>
                <h2 style={{ marginBottom: '8px', textAlign: 'center' }}>Welcome Back</h2>
                <p style={{ color: '#666', marginBottom: '24px', textAlign: 'center' }}>Sign in to your Axlero account</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '6px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <button type="submit" className="primary-btn" disabled={loading} style={{ width: '100%', marginTop: '8px', padding: '12px' }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: 500 }}>Register</Link>
                </p>
            </div>
        </div>
    );
}