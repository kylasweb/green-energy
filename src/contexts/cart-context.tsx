"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    mrp: number
    images: string[]
    stockQuantity: number
    category: {
      name: string
      slug: string
    }
    brand: {
      name: string
      slug: string
    }
  }
  createdAt: string
  updatedAt: string
}

interface CartState {
  items: CartItem[]
  totals: {
    subtotal: number
    totalItems: number
    tax: number
    shipping: number
    total: number
  }
  loading: boolean
  error: string | null
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: { items: CartItem[]; totals: any } }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }

const initialState: CartState = {
  items: [],
  totals: {
    subtotal: 0,
    totalItems: 0,
    tax: 0,
    shipping: 0,
    total: 0
  },
  loading: false,
  error: null
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        totals: action.payload.totals,
        loading: false,
        error: null
      }
    
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        loading: false,
        error: null
      }
    
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        loading: false,
        error: null
      }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        loading: false,
        error: null
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totals: initialState.totals,
        loading: false,
        error: null
      }
    
    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  fetchCart: () => Promise<void>
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateCartItem: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/cart')
      if (!response.ok) {
        throw new Error('Failed to fetch cart')
      }
      const data = await response.json()
      dispatch({ type: 'SET_CART', payload: data })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add to cart')
      }
      
      await fetchCart() // Refresh cart after adding item
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update cart item')
      }
      
      await fetchCart() // Refresh cart after updating item
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove from cart')
      }
      
      await fetchCart() // Refresh cart after removing item
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Remove all items one by one
      for (const item of state.items) {
        await removeFromCart(item.id)
      }
      
      dispatch({ type: 'CLEAR_CART' })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  // Fetch cart on mount
  useEffect(() => {
    fetchCart()
  }, [])

  return (
    <CartContext.Provider
      value={{
        state,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}