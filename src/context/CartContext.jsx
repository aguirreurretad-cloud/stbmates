import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('mateas_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('mateas_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, color = null, variation = null) => {
    // variation puede ser { name, price } o null
    const varName = variation?.name || ''
    const cartId  = `${product.id}-${color?.hex || ''}-${varName}`

    setCart(prev => {
      const existing = prev.find(item => item.cartId === cartId)
      if (existing) {
        return prev.map(item =>
          item.cartId === cartId ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, {
        ...product,
        qty: 1,
        cartId,
        selectedColor: color,
        selectedVariation: variation,  // { name, price } o null
      }]
    })
    setIsOpen(true)
  }

  const updateQty = (cartId, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.cartId !== cartId))
      return
    }
    setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, qty } : item))
  }

  const removeFromCart = (cartId) => setCart(prev => prev.filter(item => item.cartId !== cartId))
  const clearCart = () => setCart([])

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <CartContext.Provider value={{
      cart, isOpen, setIsOpen,
      addToCart, updateQty, removeFromCart, clearCart,
      totalItems, totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
