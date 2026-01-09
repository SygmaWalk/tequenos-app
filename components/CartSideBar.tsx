'use client'

import { useCart } from '@/context/CartContext'
import { useEffect, useRef } from 'react'

export default function CartSidebar() {
    const { isCartOpen, toggleCart, cart, removeFromCart, cartTotal } = useCart()
    const sidebarRef = useRef<HTMLDivElement>(null)

    // Lógica: Cerrar el sidebar si hago clic afuera de él
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                if (isCartOpen) toggleCart()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isCartOpen, toggleCart])

    return (
        <>
            {/* 1. OVERLAY OSCURO (Fondo) */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* 2. PANEL DESLIZANTE (Sidebar) */}
            <div
                ref={sidebarRef}
                className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white z-60 shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">

                    {/* Header del Carrito */}
                    <div className="p-4 border-b flex justify-between items-center bg-orange-50">
                        <h2 className="text-xl font-bold text-gray-800">Tu Pedido</h2>
                        <button
                            onClick={toggleCart}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Lista de Productos (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <p>Tu carrito está vacío</p>
                                <button
                                    onClick={toggleCart}
                                    className="mt-4 text-orange-600 font-medium hover:underline"
                                >
                                    Ver Menú
                                </button>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.cartItemId} className="flex gap-4 border-b pb-4">
                                    {/* Imagen Miniatura */}
                                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin foto</div>
                                        )}
                                    </div>

                                    {/* Info Producto */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>

                                        {/* Renderizado de Salsas/Opciones (Si existen) */}
                                        {item.selectedOptions?.sauce && (
                                            <p className="text-xs text-orange-600 bg-orange-50 inline-block px-2 py-1 rounded mt-1">
                                                + {item.selectedOptions.sauce.name}
                                            </p>
                                        )}

                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-gray-500 text-sm">Cant: {item.quantity}</span>
                                            <span className="font-bold text-gray-800">${item.price * item.quantity}</span>
                                        </div>
                                    </div>

                                    {/* Botón Eliminar */}
                                    <button
                                        onClick={() => removeFromCart(item.cartItemId)}
                                        className="text-gray-400 hover:text-red-500 self-start"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer del Carrito (Total y Checkout) */}
                    {cart.length > 0 && (
                        <div className="p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600 font-medium">Total Estimado</span>
                                <span className="text-2xl font-bold text-green-600">${cartTotal}</span>
                            </div>
                            <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg active:scale-95 transform duration-150">
                                Iniciar Pedido
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}