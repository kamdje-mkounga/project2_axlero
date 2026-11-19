import { useEffect, useState } from 'react';
import { useAuth } from '../../context';

export default function AdminProducts() {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    async function loadProducts() {
        try {
            setLoading(true);
            let res;
            try {
                res = await fetch('/api/products');
            } catch {
                res = await fetch('http://localhost:5000/api/products');
            }
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) setProducts(data);
            }
        } catch (err) {
            console.warn('Error loading products for admin:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let isMounted = true;
        async function fetchInitialProducts() {
            try {
                let res;
                try {
                    res = await fetch('/api/products');
                } catch {
                    res = await fetch('http://localhost:5000/api/products');
                }
                if (res.ok && isMounted) {
                    const data = await res.json();
                    if (Array.isArray(data)) setProducts(data);
                }
            } catch (err) {
                console.warn('Error loading products for admin:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchInitialProducts();
        return () => {
            isMounted = false;
        };
    }, []);

    async function handleDelete(productId, productName) {
        if (!window.confirm(`Are you sure you want to delete "${productName}" from the platform?`)) {
            return;
        }

        try {
            setDeletingId(productId);
            let res;
            try {
                res = await fetch(`/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch {
                res = await fetch(`http://localhost:5000/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            if (res.ok) {
                alert(`Product "${productName}" deleted successfully.`);
                setProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));
            } else {
                const errData = await res.json();
                alert(`Delete failed: ${errData.error || 'Unknown error'}`);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setDeletingId(null);
        }
    }

    const filtered = products.filter((p) => {
        const q = search.toLowerCase().trim();
        return !q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
    });

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>Global Product Moderation</h1>
                    <p>Review, audit, and moderate vendor products across the entire platform.</p>
                </div>
            </div>

            <div className="panel" style={{ marginBottom: '20px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search products by title or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            width: '320px',
                            fontSize: '14px',
                        }}
                    />
                    <button type="button" className="secondary-btn" onClick={loadProducts}>
                        ↻ Refresh Catalog
                    </button>
                </div>
            </div>

            <div className="panel">
                <h2>Platform Inventory ({filtered.length} products)</h2>
                {loading ? (
                    <p style={{ color: '#666', padding: '20px 0' }}>Loading products...</p>
                ) : filtered.length === 0 ? (
                    <p style={{ color: '#666', padding: '20px 0' }}>No products found.</p>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>PRICE</th>
                                    <th>STOCK</th>
                                    <th>VENDOR</th>
                                    <th>STATUS</th>
                                    <th>MODERATION ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p) => {
                                    const pId = p._id || p.id;
                                    const isDeleting = deletingId === pId;

                                    return (
                                        <tr key={pId}>
                                            <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img
                                                    src={p.image}
                                                    alt={p.name}
                                                    style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px' }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                                                    <small style={{ color: '#94a3b8' }}>ID: {pId}</small>
                                                </div>
                                            </td>
                                            <td>{p.category}</td>
                                            <td style={{ fontWeight: 600 }}>₹{p.price?.toLocaleString('en-IN')}</td>
                                            <td>{p.stock}</td>
                                            <td>
                                                {p.vendorId && typeof p.vendorId === 'object' ? (
                                                    <div>
                                                        <div style={{ fontWeight: 500 }}>{p.vendorId.name}</div>
                                                        <small style={{ color: '#64748b' }}>{p.vendorId.email}</small>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#94a3b8' }}>Verified Vendor</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${p.stock > 0 ? 'success' : 'warning'}`}>
                                                    {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(pId, p.name)}
                                                    disabled={isDeleting}
                                                    style={{
                                                        background: '#fee2e2',
                                                        color: '#b91c1c',
                                                        border: '1px solid #fecaca',
                                                        borderRadius: '6px',
                                                        padding: '6px 12px',
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                                                    }}
                                                >
                                                    {isDeleting ? 'Deleting...' : 'Delete Product'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
