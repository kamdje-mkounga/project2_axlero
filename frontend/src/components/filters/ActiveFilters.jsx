export default function ActiveFilters({
  searchQuery,
  category,
  priceRange,
  maxDefaultPrice,
  inStockOnly,
  minRating,
  onClearSearch,
  onClearCategory,
  onClearPrice,
  onClearInStock,
  onClearRating,
  onClearAll,
}) {
  const chips = []

  if (searchQuery.trim()) {
    chips.push({
      id: 'search',
      label: `Search: "${searchQuery}"`,
      onRemove: onClearSearch,
    })
  }

  if (category && category !== 'All') {
    chips.push({
      id: 'category',
      label: `Category: ${category}`,
      onRemove: onClearCategory,
    })
  }

  if (priceRange[0] > 0 || priceRange[1] < maxDefaultPrice) {
    chips.push({
      id: 'price',
      label: `Price: ₹${priceRange[0].toLocaleString('en-IN')} - ₹${priceRange[1].toLocaleString('en-IN')}`,
      onRemove: onClearPrice,
    })
  }

  if (inStockOnly) {
    chips.push({
      id: 'stock',
      label: 'In Stock Only',
      onRemove: onClearInStock,
    })
  }

  if (minRating > 0) {
    chips.push({
      id: 'rating',
      label: `${minRating}★ & above`,
      onRemove: onClearRating,
    })
  }

  if (chips.length === 0) {
    return null
  }

  return (
    <div className="active-filters-bar">
      <span className="active-filters-label">Active Filters:</span>
      {chips.map((chip) => (
        <span key={chip.id} className="active-filter-chip">
          {chip.label}
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Remove filter ${chip.label}`}
          >
            ✕
          </button>
        </span>
      ))}
      <button
        type="button"
        className="clear-all-chips-btn"
        onClick={onClearAll}
      >
        Clear all
      </button>
    </div>
  )
}
