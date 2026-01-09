'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product, CartItem } from '@/lib/types'

// Definimos qué funciones tendrá nuestro contexto
interface CartContextType {
    cart: CartItem[]
    addToCart: (product: Product, options?: CartItem['selectedOptions']) => void
    removeFromCart: (cartItemId: string) => void
    clearCart: () => void
    isCartOpen: boolean
    toggleCart: () => void
    cartTotal: number
    cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)

    // 1. Cargar carrito del localStorage al iniciar
    useEffect(() => {
        const savedCart = localStorage.getItem('tequenos_cart')
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }
    }, [])

    // 2. Guardar en localStorage cada vez que cambia el carrito
    useEffect(() => {
        localStorage.setItem('tequenos_cart', JSON.stringify(cart))
    }, [cart])

    // LÓGICA: Agregar al carrito
    const addToCart = (product: Product, options?: CartItem['selectedOptions']) => {
        setCart((prevCart) => {
            // Buscamos si ya existe el producto CON LAS MISMAS OPCIONES
            // (Nota: Para simplificar ahora, comparamos solo ID de producto principal)
            // En el futuro: compararemos también las salsas elegidas

            const existingItem = prevCart.find((item) => item.id === product.id)

            if (existingItem) {
                // Si existe, sumamos cantidad
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }

            // Si no existe, creamos uno nuevo
            const newItem: CartItem = {
                ...product,
                cartItemId: crypto.randomUUID(), // ID único para el frontend
                quantity: 1,
                selectedOptions: options
            }

            // ALERTA UX: Si agregan algo, abrimos el sidebar automáticamente para que vean que funcionó
            setIsCartOpen(true)
            return [...prevCart, newItem]
        })
    }

    const removeFromCart = (cartItemId: string) => {
        setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId))
    }

    const clearCart = () => setCart([])

    const toggleCart = () => setIsCartOpen(!isCartOpen)

    // Cálculos derivados (Getters)
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            isCartOpen,
            toggleCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    )
}

// Hook personalizado para usar el carrito fácilmente
export const useCart = () => {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}