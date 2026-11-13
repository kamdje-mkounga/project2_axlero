
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

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">Axlero<span>.</span></div>

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
        <p>Vendor Portal</p>
        <p>Axlero E-Commerce</p>
      </div>
    </aside>
  )
}

function Layout() {
  const location = useLocation()

  const titles = {
    '/vendor/dashboard': 'Dashboard',
    '/vendor/products': 'My Products',
    '/vendor/products/add': 'Add Product',
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

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
          <div className="stat-value">0</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <p className="stat-label">Total Orders</p>
          <div className="stat-value">0</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <p className="stat-label">Total Revenue</p>
          <div className="stat-value">₹0</div>
        </div>
      </div>

      <div className="panel">
        <h2>Recent Activity</h2>
        <p>No recent activity available. Start by adding your first product!</p>
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
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="4">No products added yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function AddProduct() {
  const navigate = useNavigate()

  const [image, setImage] = useState(null)

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.')
        event.target.value = ''
        return
      }

      setImage(URL.createObjectURL(file))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    alert('Product form UI is ready. Backend integration will be added later.')
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

        <div className="form-group">
          <label>Product Image</label>

          <label className="image-upload" htmlFor="productImage">
            <span>📷</span>
            <p>Click here to upload product image</p>
            <small>Choose an image from your computer</small>

            {image && (
              <img className="image-preview" src={image} alt="Product preview" />
            )}
          </label>

          <input
            id="productImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn">
            Save Product
          </button>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate('/vendor/products')}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vendor/dashboard" replace />} />
      <Route path="/vendor/*" element={<Layout />} />
      <Route path="*" element={<Navigate to="/vendor/dashboard" replace />} />
    </Routes>
  )
}

export default App
