import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = async (email, password) => {
        setLoading(true);
        try {
            let res;
            try {
                res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
            } catch {
                res = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
            }

            const contentType = res.headers.get("content-type");
            let data = {};
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                throw new Error(`Server error (HTTP ${res.status}): Backend may be down or unconfigured.`);
            }

            if (!res.ok) throw new Error(data.error || 'Login failed');

            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Role-based redirection upon successful login
            if (data.user?.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (data.user?.role === 'vendor') {
                navigate('/vendor/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password, role = 'customer') => {
        setLoading(true);
        try {
            let res;
            try {
                res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, role }),
                });
            } catch {
                res = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, role }),
                });
            }

            const contentType = res.headers.get("content-type");
            let data = {};
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                throw new Error(`Server error (HTTP ${res.status}): Backend may be down or unconfigured.`);
            }

            if (!res.ok) throw new Error(data.error || 'Registration failed');

            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);