export default function FilterSidebar({
  categories = [],
  categoryCounts = {},
  selectedCategory = 'All',
  onSelectCategory,
  priceRange = [0, 10000],
  maxDefaultPrice = 10000,
  onPriceChange,
  inStockOnly = false,
  onToggleInStock,
  inStockCount = 0,
  minRating = 0,
  onSelectRating,
  onResetAll,
  isMobileOpen = false,
  onCloseMobile,
  hasActiveFilters = false,
}) {
  const pricePresets = [
    { label: 'All Prices', min: 0, max: maxDefaultPrice },
    { label: 'Under ₹1,500', min: 0, max: 1500 },
    { label: '₹1,500 - ₹3,500', min: 1500, max: 3500 },
    { label: '₹3,500 - ₹5,000', min: 3500, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: maxDefaultPrice },
  ]

  function handleSliderChange(e) {
    const val = Number(e.target.value)
    onPriceChange([priceRange[0], val])
  }

  function handleMinPriceInput(e) {
    const val = Math.max(0, Number(e.target.value) || 0)
    onPriceChange([val, Math.max(val, priceRange[1])])
  }

  function handleMaxPriceInput(e) {
    const val = Math.min(maxDefaultPrice, Number(e.target.value) || maxDefaultPrice)
    onPriceChange([Math.min(priceRange[0], val), val])
  }

  function isPresetActive(preset) {
    return priceRange[0] === preset.min && priceRange[1] === preset.max
  }

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`filter-drawer-overlay ${isMobileOpen ? 'visible' : ''}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside className={`filter-sidebar ${isMobileOpen ? 'drawer-open' : ''}`}>
        {/* Header */}
        <div className="filter-sidebar-header">
          <h3 className="filter-sidebar-title">
            <span className="filter-icon"></span> Filters
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {hasActiveFilters && (
              <button
                type="button"
                className="filter-reset-link"
                onClick={onResetAll}
              >
                Reset All
              </button>
            )}
            <button
              type="button"
              className="filter-drawer-close-btn"
              onClick={onCloseMobile}
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 1. Category Section */}
        <div className="filter-section">
          <div className="filter-section-title">
            <span>Category</span>
          </div>
          <div className="category-option-list">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat
              const count = categoryCounts[cat] ?? 0
              return (
                <button
                  key={cat}
                  type="button"
                  className={`category-option-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectCategory(cat)}
                >
                  <span>{cat}</span>
                  <span className="category-count-badge">{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Price Range Section */}
        <div className="filter-section">
          <div className="filter-section-title">
            <span>Price Range</span>
            <small style={{ color: '#64748b', fontWeight: 500 }}>
              Max: ₹{priceRange[1].toLocaleString('en-IN')}
            </small>
          </div>

          <input
            type="range"
            min="0"
            max={maxDefaultPrice}
            step="100"
            value={priceRange[1]}
            onChange={handleSliderChange}
            className="price-range-slider"
            aria-label="Maximum price range"
          />

          <div className="price-inputs-row">
            <div className="price-input-box">
              <span>₹</span>
              <input
                type="number"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={handleMinPriceInput}
                placeholder="Min"
              />
            </div>
            <span className="price-range-sep">to</span>
            <div className="price-input-box">
              <span>₹</span>
              <input
                type="number"
                min={priceRange[0]}
                max={maxDefaultPrice}
                value={priceRange[1]}
                onChange={handleMaxPriceInput}
                placeholder="Max"
              />
            </div>
          </div>

          {/* Quick Price Presets */}
          <div className="price-presets">
            {pricePresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={`price-preset-chip ${isPresetActive(preset) ? 'active' : ''}`}
                onClick={() => onPriceChange([preset.min, preset.max])}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Availability Filter */}
        <div className="filter-section">
          <label className="availability-toggle-label">
            <span>In Stock Only</span>
            <input
              type="checkbox"
              className="availability-checkbox"
              checked={inStockOnly}
              onChange={onToggleInStock}
            />
          </label>
          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b' }}>
            {inStockCount} items currently available
          </p>
        </div>

        {/* 4. Customer Rating Filter */}
        <div className="filter-section">
          <div className="filter-section-title">
            <span>Customer Rating</span>
          </div>
          <div className="rating-options">
            {[
              { stars: 0, label: 'All Ratings' },
              { stars: 4.5, label: '4.5★ & above' },
              { stars: 4.0, label: '4.0★ & above' },
              { stars: 3.5, label: '3.5★ & above' },
            ].map((option) => (
              <button
                key={option.stars}
                type="button"
                className={`rating-option-btn ${minRating === option.stars ? 'active' : ''}`}
                onClick={() => onSelectRating(option.stars)}
              >
                <span className="rating-stars-gold">
                  {option.stars === 0 ? '★' : '★'.repeat(Math.floor(option.stars))}
                </span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
