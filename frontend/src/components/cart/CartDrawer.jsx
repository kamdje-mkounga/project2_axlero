import { useEffect } from 'react'
import { useCart } from '../../context'

export default function CartDrawer() {
  const {
    items,
    totalItems,
    subtotal,
    tax,
    shipping,
    totalPrice,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCartOpen, closeCart])

  // Prevent background scrolling while cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])

  if (!isCartOpen) return null

  const freeShippingThreshold = 2000
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))

  function handleCheckout() {
    alert(`Order confirmed! Thank you for purchasing. Total: ₹${totalPrice.toLocaleString('en-IN')}`)
    clearCart()
    closeCart()
  }

  return (
    <div className="cart-drawer-overlay" onClick={closeCart} role="dialog" aria-modal="true" aria-label="Shopping Cart">
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="cart-drawer-header">
          <div className="cart-header-title">
            <h2>Your Cart</h2>
            <span className="cart-items-pill">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            ✕
          </button>
        </header>

        {/* Free shipping goal banner */}
        {items.length > 0 && (
          <div className="cart-shipping-banner">
            {amountToFreeShipping > 0 ? (
              <p>Add <strong>₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more for <strong>FREE Delivery</strong></p>
            ) : (
              <p className="free-shipping-unlocked">🎉 You unlocked <strong>FREE Delivery!</strong></p>
            )}
            <div className="shipping-progress-track">
              <div
                className="shipping-progress-bar"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything yet. Explore our top products and add your favorites!</p>
              <button
                type="button"
                className="primary-btn"
                onClick={closeCart}
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {items.map(({ product, quantity }) => {
                const itemTotal = product.price * quantity
                const isMaxStock = product.stock != null && quantity >= product.stock

                return (
                  <li key={product.id} className="cart-item">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="cart-item-img"
                    />

                    <div className="cart-item-details">
                      <div className="cart-item-top">
                        <span className="cart-item-category">{product.category}</span>
                        <button
                          type="button"
                          className="cart-item-remove-btn"
                          onClick={() => removeFromCart(product.id)}
                          aria-label={`Remove ${product.name} from cart`}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>

                      <h4 className="cart-item-title">{product.name}</h4>
                      <p className="cart-item-unit-price">₹{product.price.toLocaleString('en-IN')}</p>

                      <div className="cart-item-bottom">
                        {/* Quantity Stepper */}
                        <div className="quantity-stepper">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            aria-label="Decrease quantity"
                            disabled={quantity <= 1}
                          >
                            −
                          </button>
                          <span>{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            aria-label="Increase quantity"
                            disabled={isMaxStock}
                          >
                            +
                          </button>
                        </div>

                        <span className="cart-item-total">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {isMaxStock && (
                        <p className="cart-stock-warning">Max available stock ({product.stock}) reached</p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer with Summary & Checkout */}
        {items.length > 0 && (
          <footer className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary-row">
              <span>Estimated Tax (18% GST)</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery</span>
              <span>{shipping === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${shipping}`}</span>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-row total">
              <span>Total</span>
              <span className="cart-total-amount">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>

            <button
              type="button"
              className="primary-btn checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout • ₹{totalPrice.toLocaleString('en-IN')}
            </button>

            <div className="cart-footer-links">
              <button
                type="button"
                className="cart-clear-btn"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button
                type="button"
                className="cart-continue-btn"
                onClick={closeCart}
              >
                Continue Shopping
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}
