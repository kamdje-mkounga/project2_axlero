import { useState } from 'react'
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import './App.css'
import ProductImageUpload from './components/ProductImageUpload'

// Initial mock products for the consumer catalog
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Noise-Canceling Headphones',
    category: 'Electronics',
    price: 4999,
    stock: 15,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    description: 'Immersive sound with active noise cancellation and 40-hour battery life.',
  },
  {
    id: 2,
    name: 'Minimalist Mechanical Keyboard',
    category: 'Electronics',
    price: 3499,
    stock: 8,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
    description: 'Tactile switches with customizable RGB backlighting and sleek aluminum frame.',
  },
  {
    id: 3,
    name: 'Classic Cotton Oversized Hoodie',
    category: 'Fashion',
    price: 1299,
    stock: 25,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60',
    description: 'Premium heavyweight cotton blend designed for maximum comfort and streetwear style.',
  },
  {
    id: 4,
    name: 'Smart Desk LED Lamp with Wireless Charger',
    category: 'Home & Kitchen',
    price: 1899,
    stock: 5,
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1534073828943-f801091fb18c?w=500&auto=format&fit=crop&q=60',
    description: 'Adjustable color temperatures with integrated Qi fast wireless charging base.',
  },
]

// ==========================================
// VENDOR PORTAL COMPONENTS
// ==========================================

function VendorSidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        Axlero<span>.</span>
      </div>

      <p className="sidebar-label">MAIN MENU</p>

      <nav className="sidebar-nav">
        <NavLink to="/vendor/dashboard" className="nav-link">
          <span>▦</span> Dashboard
        </NavLink>
        <NavLink to="/vendor/products" className="nav-link">
          <span>□</span> My Products
        </NavLink>
        <NavLink to="/vendor/products/add" className="nav-link">
          <span>＋</span> Add Product
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <Link to="/" className="switch-portal-btn">
          ← Switch to Storefront
        </Link>
      </div>
    </aside>
  )
}

function VendorLayout() {
  const location = useLocation()
  const titles = {
    '/vendor/dashboard': 'Dashboard',
    '/vendor/products': 'My Products',
    '/vendor/products/add': 'Add Product',
  }

  return (
    <div className="dashboard-layout">
      <VendorSidebar />
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            {titles[location.pathname] || 'Vendor Portal'}
          </div>
          <div className="profile">
            <span>Vendor Account</span>
            <div className="avatar">V</div>
          </div>
        </header>

        <div className="page-content">
          <Routes>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function VendorDashboard() {
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Welcome, Vendor!</h1>
          <p>Here's an overview of your store performance.</p>
        </div>
        <Link to="/vendor/products/add">
          <button className="primary-btn">+ Add Product</button>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <p className="stat-label">Total Products</p>
          <div className="stat-value">{INITIAL_PRODUCTS.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <p className="stat-label">Total Orders</p>
          <div className="stat-value">12</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <p className="stat-label">Total Revenue</p>
          <div className="stat-value">₹45,290</div>
        </div>
      </div>

      <div className="panel">
        <h2>Recent Activity</h2>
        <p>Your store received 3 new orders today. Keep up the great work!</p>
      </div>
    </>
  )
}

function Products() {
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>My Products</h1>
          <p>Manage all products in your store.</p>
        </div>
        <Link to="/vendor/products/add">
          <button className="primary-btn">+ Add Product</button>
        </Link>
      </div>

      <div className="panel">
        <h2>Product List</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_PRODUCTS.map((p) => (
                <tr key={p.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <span style={{ fontWeight: 500 }}>{p.name}</span>
                  </td>
                  <td>{p.category}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`status-badge ${p.status === 'In Stock' ? 'success' : 'warning'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function AddProduct() {
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState(null)

  function handleSubmit(event) {
    event.preventDefault()
    alert(
      imageFile
        ? `Product saved successfully with image: ${imageFile.name}!`
        : 'Product saved successfully!'
    )
    navigate('/vendor/products')
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Add New Product</h1>
          <p>Enter your product details and upload an image.</p>
        </div>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="productName">Product Name *</label>
            <input id="productName" type="text" placeholder="Enter product name" required />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select id="category" required defaultValue="">
              <option value="" disabled>Select category</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Kitchen</option>
              <option>Books</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹) *</label>
            <input id="price" type="number" min="0" placeholder="Enter price" required />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Quantity *</label>
            <input id="stock" type="number" min="0" placeholder="Enter quantity" required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Product Description *</label>
          <textarea id="description" rows="4" placeholder="Describe your product..." required />
        </div>

        <ProductImageUpload onImageSelect={setImageFile} />

        <div className="form-actions">
          <button type="submit" className="primary-btn">Save Product</button>
          <button type="button" className="secondary-btn" onClick={() => navigate('/vendor/products')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}


// ==========================================
// CONSUMER STOREFRONT COMPONENTS
// ==========================================

function StorefrontLayout() {
  const [cartCount, setCartCount] = useState(2)

  return (
    <div className="storefront-layout">
      {/* Store Header */}
      <header className="store-header">
        <div className="store-brand">
          <Link to="/">Axlero<span>.</span> Store</Link>
        </div>

        <div className="store-nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'store-link active' : 'store-link'}>
            Catalog
          </NavLink>
        </div>

        <div className="store-actions">
          <Link to="/vendor/dashboard" className="vendor-switch-btn">
            Vendor Portal
          </Link>
          <div className="cart-badge-wrapper">
            🛒 <span className="cart-count">{cartCount}</span>
          </div>
        </div>
      </header>

      {/* Main Storefront Content */}
      <main className="store-main">
        <Routes>
          <Route path="/" element={<ProductCatalog setCartCount={setCartCount} />} />
        </Routes>
      </main>

      {/* Store Footer */}
      <footer className="store-footer">
        <p>© 2026 Axlero E-Commerce Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}

function ProductCatalog({ setCartCount }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Books']

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  function handleAddToCart(productName) {
    setCartCount((prev) => prev + 1)
    alert(`"${productName}" added to your cart!`)
  }

  return (
    <div className="catalog-container">
      {/* Hero Banner */}
      <div className="store-hero">
        <h1>Discover Amazing Products</h1>
        <p>Shop top-quality items from verified vendors across India.</p>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-card-img-wrapper">
                <img src={product.image} alt={product.name} />
                <span className="product-category-tag">{product.category}</span>
              </div>
              <div className="product-card-body">
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-card-footer">
                  <span className="product-price">₹{product.price}</span>
                  <button
                    className="primary-btn sm"
                    onClick={() => handleAddToCart(product.name)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}


// ==========================================
// ROOT APP COMPONENT
// ==========================================

function App() {
  return (
    <Routes>
      {/* Vendor Portal Routes */}
      <Route path="/vendor/*" element={<VendorLayout />} />

      {/* Consumer Storefront Routes */}
      <Route path="/*" element={<StorefrontLayout />} />
    </Routes>
  )
}

export default App