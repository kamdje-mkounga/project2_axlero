import { useState, useMemo } from 'react'
import {
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import './App.css'
import './components/filters/filters.css'
import ProductImageUpload from './components/ProductImageUpload'
import CartDrawer from './components/cart/CartDrawer'
import FilterSidebar from './components/filters/FilterSidebar'
import ActiveFilters from './components/filters/ActiveFilters'
import { useCart } from './context'

// Initial mock products for the consumer catalog
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Noise-Canceling Headphones',
    category: 'Electronics',
    price: 4999,
    stock: 15,
    status: 'In Stock',
    rating: 4.8,
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
    rating: 4.6,
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
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60',
    description: 'Premium heavyweight cotton blend designed for maximum comfort and streetwear style.',
  },
  {
    id: 4,
    name: 'Smart Desk LED Lamp with Wireless Charger',
    category: 'Home & Kitchen',
    price: 1899,
    stock: 4,
    status: 'Low Stock',
    rating: 4.2,
    image: 'https://tse1.mm.bing.net/th/id/OIP.o7J7LdvZOlcGZiADlKnQSAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'Adjustable color temperatures with integrated Qi fast wireless charging base.',
  },
  {
    id: 5,
    name: 'Ergonomic Memory Foam Lumbar Cushion',
    category: 'Home & Kitchen',
    price: 899,
    stock: 18,
    status: 'In Stock',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&auto=format&fit=crop&q=60',
    description: 'Orthopedic memory foam cushion designed to relieve lower back pain during long hours.',
  },
  {
    id: 6,
    name: 'Atomic Habits by James Clear (Hardcover)',
    category: 'Books',
    price: 599,
    stock: 30,
    status: 'In Stock',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60',
    description: 'An easy & proven way to build good habits, break bad ones, and master tiny behaviors.',
  },
  {
    id: 7,
    name: 'Urban Canvas Roll-Top Laptop Backpack',
    category: 'Fashion',
    price: 2499,
    stock: 12,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
    description: 'Water-resistant vintage backpack with padded 15.6-inch laptop compartment and USB port.',
  },
  {
    id: 8,
    name: 'Ultra-Wide 4K Gaming Monitor (34-inch)',
    category: 'Electronics',
    price: 8499,
    stock: 0,
    status: 'Out of Stock',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
    description: '144Hz refresh rate curved gaming display with HDR600 and FreeSync Premium.',
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
  const { totalItems, toggleCart } = useCart()

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
          <button
            type="button"
            className="cart-badge-wrapper"
            onClick={toggleCart}
            aria-label={`Shopping cart with ${totalItems} items`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              font: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            🛒 <span className="cart-count">{totalItems}</span>
          </button>
        </div>
      </header>

      {/* Main Storefront Content */}
      <main className="store-main">
        <Routes>
          <Route path="/" element={<ProductCatalog />} />
        </Routes>
      </main>

      {/* Store Footer */}
      <footer className="store-footer">
        <p>© 2026 Axlero E-Commerce Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}

function ProductCatalog() {
  const { addToCart, openCart } = useCart()

  // Advanced Filtering States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('featured')
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  const categories = useMemo(
    () => ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Books'],
    []
  )

  // Category product counts
  const categoryCounts = useMemo(() => {
    const counts = { All: INITIAL_PRODUCTS.length }
    for (const cat of categories) {
      if (cat !== 'All') {
        counts[cat] = INITIAL_PRODUCTS.filter((p) => p.category === cat).length
      }
    }
    return counts
  }, [categories])

  const inStockCount = useMemo(() => {
    return INITIAL_PRODUCTS.filter((p) => p.stock > 0).length
  }, [])

  // Filtering and Sorting Pipeline
  const filteredAndSortedProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    const filtered = INITIAL_PRODUCTS.filter((product) => {
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q)
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesStock = !inStockOnly || product.stock > 0
      const matchesRating = minRating === 0 || (product.rating || 0) >= minRating

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesStock &&
        matchesRating
      )
    })

    const result = [...filtered]
    switch (sortBy) {
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price)
      case 'rating-desc':
        return result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'name-asc':
        return result.sort((a, b) => a.name.localeCompare(b.name))
      case 'name-desc':
        return result.sort((a, b) => b.name.localeCompare(a.name))
      default:
        return result
    }
  }, [searchQuery, selectedCategory, priceRange, inStockOnly, minRating, sortBy])

  // Active filter checks
  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      selectedCategory !== 'All' ||
      priceRange[0] > 0 ||
      priceRange[1] < 10000 ||
      inStockOnly ||
      minRating > 0
  )

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0)

  function handleResetAll() {
    setSearchQuery('')
    setSelectedCategory('All')
    setPriceRange([0, 10000])
    setInStockOnly(false)
    setMinRating(0)
    setSortBy('featured')
  }

  function handleAddToCart(product) {
    if (product.stock === 0) return
    addToCart(product, 1)
    openCart()
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
            placeholder="Search products by title, keyword, or specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Main 2-Column Filtering & Catalog Layout */}
      <div className="catalog-layout">
        {/* Left Sidebar Filter Panel */}
        <FilterSidebar
          categories={categories}
          categoryCounts={categoryCounts}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          priceRange={priceRange}
          maxDefaultPrice={10000}
          onPriceChange={(newRange) => setPriceRange(newRange)}
          inStockOnly={inStockOnly}
          onToggleInStock={() => setInStockOnly((prev) => !prev)}
          inStockCount={inStockCount}
          minRating={minRating}
          onSelectRating={(r) => setMinRating(r)}
          onResetAll={handleResetAll}
          isMobileOpen={isMobileDrawerOpen}
          onCloseMobile={() => setIsMobileDrawerOpen(false)}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Right Main Catalog Content Area */}
        <div className="catalog-main-area">
          {/* Controls Bar: Results Count, Mobile Filter Trigger, and Sort Dropdown */}
          <div className="catalog-control-bar">
            <div className="catalog-results-count">
              Showing <strong>{filteredAndSortedProducts.length}</strong> of{' '}
              {INITIAL_PRODUCTS.length} products
            </div>

            <div className="catalog-controls-right">
              <button
                type="button"
                className="mobile-filter-trigger"
                onClick={() => setIsMobileDrawerOpen(true)}
              >
                <span>⚡ Filters</span>
                {activeFilterCount > 0 && (
                  <span className="mobile-filter-badge">{activeFilterCount}</span>
                )}
              </button>

              <div className="sort-select-wrapper">
                <label htmlFor="sortSelect">Sort by:</label>
                <select
                  id="sortSelect"
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Pill Bar */}
          <ActiveFilters
            searchQuery={searchQuery}
            category={selectedCategory}
            priceRange={priceRange}
            maxDefaultPrice={10000}
            inStockOnly={inStockOnly}
            minRating={minRating}
            onClearSearch={() => setSearchQuery('')}
            onClearCategory={() => setSelectedCategory('All')}
            onClearPrice={() => setPriceRange([0, 10000])}
            onClearInStock={() => setInStockOnly(false)}
            onClearRating={() => setMinRating(0)}
            onClearAll={handleResetAll}
          />

          {/* Product Cards Grid */}
          <div className="product-grid">
            {filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product) => {
                const productId = product._id || product.id
                const isOutOfStock = product.stock === 0
                const isLowStock = product.stock > 0 && product.stock <= 5

                return (
                  <div
                    key={productId}
                    className={`product-card ${isOutOfStock ? 'is-out-of-stock' : ''}`}
                  >
                    <div className="product-card-img-wrapper">
                      <img src={product.image} alt={product.name} />
                      <span className="product-category-tag">{product.category}</span>
                    </div>

                    <div className="product-card-body">
                      <div className="product-meta-row">
                        <span className="product-rating-badge">
                          ★ {product.rating ? product.rating.toFixed(1) : '4.5'}
                        </span>
                        <span
                          className={`product-stock-tag ${
                            isOutOfStock
                              ? 'out-of-stock'
                              : isLowStock
                                ? 'low-stock'
                                : 'in-stock'
                          }`}
                        >
                          {isOutOfStock
                            ? 'Out of Stock'
                            : isLowStock
                              ? `Only ${product.stock} left`
                              : 'In Stock'}
                        </span>
                      </div>

                      <h3>{product.name}</h3>
                      <p className="product-desc">{product.description}</p>

                      <div className="product-card-footer">
                        <span className="product-price">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <button
                          type="button"
                          className="primary-btn sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={isOutOfStock}
                        >
                          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="no-products">
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
                <h3>No matching products found</h3>
                <p>Try adjusting your category, price range, or search criteria.</p>
                <button
                  type="button"
                  className="primary-btn sm"
                  style={{ marginTop: '16px' }}
                  onClick={handleResetAll}
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


// ==========================================
// ROOT APP COMPONENT
// ==========================================

function App() {
  return (
    <>
      <Routes>
        {/* Vendor Portal Routes */}
        <Route path="/vendor/*" element={<VendorLayout />} />

        {/* Consumer Storefront Routes */}
        <Route path="/*" element={<StorefrontLayout />} />
      </Routes>
      <CartDrawer />
    </>
  )
}

export default App