'use client'

import { useCart } from '@/context/CartContext'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom' // <--- IMPORTANTE

export default function CartSidebar() {
    const { isCartOpen, toggleCart, cart, removeFromCart, cartTotal } = useCart()
    const sidebarRef = useRef<HTMLDivElement>(null)

    // Estado para saber si estamos en el cliente (necesario para Portals)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        // Lógica de click afuera
        function handleClickOutside(event: MouseEvent) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                // Solo cerramos si está abierto para evitar conflictos
                if (isCartOpen) toggleCart()
            }
        }

        // Solo agregamos el listener si el menú está abierto
        if (isCartOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isCartOpen, toggleCart])

    // Si no estamos en el navegador aun, no renderizamos nada
    if (!mounted) return null

    // EL CONTENIDO DEL SIDEBAR
    const sidebarContent = (
        <div className="relative z-[99999]"> {/* Z-Index Supremo */}
            {/* 1. OVERLAY OSCURO */}
            <div
                className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* 2. PANEL DESLIZANTE */}
            <div
                ref={sidebarRef}
                className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b flex justify-between items-center bg-brand-cream/30">
                        <h2 className="text-xl font-bold text-brand-blue">Tu Pedido</h2>
                        <button onClick={toggleCart} className="text-gray-500 hover:text-brand-red">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Lista */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p>Tu carrito está vacío 😔</p>
                                <button onClick={toggleCart} className="mt-4 text-brand-blue font-bold hover:underline">
                                    Ver Menú
                                </button>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.cartItemId} className="flex gap-4 border-b border-gray-100 pb-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                        {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                                        {item.selectedOptions?.sauce && (
                                            <p className="text-xs text-brand-blue bg-blue-50 inline-block px-1 rounded mt-1">
                                                + {item.selectedOptions.sauce.name}
                                            </p>
                                        )}
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-gray-500 text-xs">Cant: {item.quantity}</span>
                                            <span className="font-bold text-gray-800">${item.price * item.quantity}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-300 hover:text-red-500 self-start">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="p-4 bg-white border-t">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600 font-medium">Total</span>
                                <span className="text-2xl font-bold text-green-600">${cartTotal}</span>
                            </div>
                            <button className="w-full bg-brand-red text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
                                Iniciar Pedido
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    // LA MAGIA: Enviamos el HTML directo al <body>
    return createPortal(sidebarContent, document.body)
}