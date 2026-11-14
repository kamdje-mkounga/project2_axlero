import { useEffect, useReducer, useState } from 'react'
import { CartContext } from './CartContext.js'

const CART_STORAGE_KEY = 'axlero_cart_items'

// Action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
}

function loadInitialCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.warn('Failed to load cart from localStorage:', error)
  }
  return []
}

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload
      if (!product || quantity <= 0) return state

      const existingIndex = state.findIndex(
        (item) => item.product.id === product.id
      )

      if (existingIndex > -1) {
        return state.map((item, index) => {
          if (index !== existingIndex) return item
          const maxStock = item.product.stock ?? Infinity
          const nextQuantity = Math.min(item.quantity + quantity, maxStock)
          return {
            ...item,
            quantity: nextQuantity,
          }
        })
      }

      const initialQuantity = Math.min(quantity, product.stock ?? Infinity)
      return [...state, { product, quantity: initialQuantity }]
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const { productId } = action.payload
      return state.filter((item) => item.product.id !== productId)
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload

      if (quantity <= 0) {
        return state.filter((item) => item.product.id !== productId)
      }

      return state.map((item) => {
        if (item.product.id !== productId) return item
        const maxStock = item.product.stock ?? Infinity
        return {
          ...item,
          quantity: Math.min(quantity, maxStock),
        }
      })
    }

    case CART_ACTIONS.CLEAR_CART: {
      return []
    }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadInitialCart)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error)
    }
  }, [items])

  // Core Actions
  function addToCart(product, quantity = 1) {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity },
    })
  }

  function removeFromCart(productId) {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId },
    })
  }

  function updateQuantity(productId, quantity) {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity },
    })
  }

  function clearCart() {
    dispatch({ type: CART_ACTIONS.CLEAR_CART })
  }

  function openCart() {
    setIsCartOpen(true)
  }

  function closeCart() {
    setIsCartOpen(false)
  }

  function toggleCart() {
    setIsCartOpen((prev) => !prev)
  }

  // Derived Calculations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const tax = Math.round(subtotal * 0.18) // 18% GST estimate
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99 // Free shipping above ₹2,000
  const totalPrice = subtotal + tax + shipping

  const value = {
    items,
    totalItems,
    subtotal,
    tax,
    shipping,
    totalPrice,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
