'use client' // 1. Obligatorio para usar interactividad

import Link from 'next/link'
import { useState } from 'react' // 2. Hook para manejar el estado del menú
import { useCart } from '@/context/CartContext'

export default function Navbar() {
    // Estado: ¿El menú móvil está abierto? (Empieza cerrado = false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { toggleCart, cartCount } = useCart()
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">

                    {/* --- BLOQUE IZQUIERDO: BOTÓN HAMBURGUESA (Solo Móvil) --- */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)} // Al hacer click, invierte el valor
                            className="text-gray-600 hover:text-orange-600 focus:outline-none p-2"
                        >
                            {/* Cambiamos el icono según si está abierto o cerrado */}
                            {isMenuOpen ? (
                                // Icono "X" (Cerrar)
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                // Icono "Hamburguesa" (Abrir)
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* --- BLOQUE CENTRAL: LOGO --- */}
                    {/* En móvil lo centramos visualmente o a la izquierda junto al botón */}
                    <Link href="/" className="text-xl font-bold text-orange-600 truncate">
                        Tequeños Dugarte
                    </Link>

                    {/* --- BLOQUE DERECHO (Escritorio): MENÚ NORMAL --- */}
                    <div className="hidden md:flex space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
                            Inicio
                        </Link>
                        <Link href="/menu" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
                            Menú
                        </Link>
                        <Link href="/fidelidad" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">
                            Mis Puntos
                        </Link>
                    </div>

                    {/* --- BLOQUE EXTREMO DERECHO: CARRITO Y LOGIN --- */}
                    <div className="flex items-center space-x-3">
                        <button className="relative p-2 text-gray-600 hover:text-orange-500" onClick={toggleCart}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                {cartCount}
                            </span>
                        </button>

                        {/* El botón de login lo ocultamos en móvil si queremos ahorrar espacio, o lo dejamos icono */}
                        <Link href="/login" className="hidden md:block bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 text-sm font-medium">
                            Ingresar
                        </Link>
                    </div>
                </div>

                {/* --- MENÚ DESPLEGABLE MÓVIL (Solo se ve si isMenuOpen es true) --- */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 bg-white absolute top-16 left-0 w-full shadow-lg flex flex-col px-4 space-y-2 animate-fade-in-down">
                        <Link
                            href="/"
                            className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md font-medium"
                            onClick={() => setIsMenuOpen(false)} // Cerramos menú al hacer click
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/menu"
                            className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Menú Completo
                        </Link>
                        <Link
                            href="/fidelidad"
                            className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Mis Puntos
                        </Link>
                        <hr className="my-2 border-gray-100" />
                        <Link
                            href="/login"
                            className="block w-full text-center bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Ingresar / Registrarse
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}