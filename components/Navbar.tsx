'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase' // Importamos Supabase
import { User } from '@supabase/supabase-js'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { toggleCart, cartCount } = useCart()

    // ESTADO PARA EL USUARIO
    const [user, setUser] = useState<User | null>(null)

    // EFECTO: Comprobar si hay usuario al cargar y escuchar cambios
    useEffect(() => {
        // 1. Verificamos sesión actual
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
        }
        getUser()

        // 2. Escuchamos si el usuario se loguea o desloguea en tiempo real
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    // Función para cerrar sesión
    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        window.location.href = "/" // Recargar al home
    }

    return (
        <nav className="bg-brand-blue shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20"> {/* Aumenté un poco la altura */}

                    {/* --- BLOQUE IZQUIERDO: HAMBURGUESA MÓVIL --- */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-brand-yellow focus:outline-none p-2"
                        >
                            {isMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* --- BLOQUE CENTRAL: LOGO --- */}
                    <Link href="/" className="flex items-center gap-2 group">
                        {/* Aquí asumimos que tu imagen está en la carpeta public como 'logo.png' */}
                        <div className="bg-white p-1 rounded-full">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-12 w-12 object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold text-white group-hover:text-brand-yellow transition-colors truncate hidden sm:block">
                            Tequeños Gavidia
                        </span>
                    </Link>

                    {/* --- BLOQUE DERECHO (Escritorio): MENÚ --- */}
                    <div className="hidden md:flex space-x-8">
                        <Link href="/" className="text-white hover:text-brand-yellow font-medium transition-colors">
                            Inicio
                        </Link>
                        <Link href="/menu" className="text-white hover:text-brand-yellow font-medium transition-colors">
                            Menú
                        </Link>

                        {/* Solo mostramos "Mis Puntos" si está logueado */}
                        {user && (
                            <Link href="/fidelidad" className="text-white hover:text-brand-yellow font-medium transition-colors">
                                Mis Puntos
                            </Link>
                        )}
                    </div>

                    {/* --- BLOQUE EXTREMO DERECHO: CARRITO Y LOGIN --- */}
                    <div className="flex items-center space-x-4">
                        {/* Carrito */}
                        <button onClick={toggleCart} className="relative p-2 text-white hover:text-brand-yellow transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-brand-blue bg-brand-yellow rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* LÓGICA DE USUARIO: ¿Está logueado? */}
                        {user ? (
                            <div className="hidden md:flex items-center gap-3">
                                <span className="text-sm text-brand-yellow font-medium">
                                    Hola, {user.user_metadata.full_name?.split(' ')[0] || 'Cliente'}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-brand-red hover:border-brand-red transition-all text-sm"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="hidden md:block bg-brand-yellow text-brand-blue px-4 py-2 rounded-lg hover:bg-white transition-colors text-sm font-bold">
                                Ingresar
                            </Link>
                        )}
                    </div>
                </div>

                {/* --- MENÚ MÓVIL DESPLEGABLE --- */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-brand-blue/30 bg-brand-blue absolute top-20 left-0 w-full shadow-xl flex flex-col px-4 space-y-2 z-50">
                        <Link href="/" className="block px-4 py-2 text-white hover:bg-white/10 rounded-md" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                        <Link href="/menu" className="block px-4 py-2 text-white hover:bg-white/10 rounded-md" onClick={() => setIsMenuOpen(false)}>Menú Completo</Link>

                        {user && (
                            <Link href="/fidelidad" className="block px-4 py-2 text-white hover:bg-white/10 rounded-md" onClick={() => setIsMenuOpen(false)}>Mis Puntos</Link>
                        )}

                        <hr className="border-white/20 my-2" />

                        {user ? (
                            <button
                                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                className="w-full text-left block px-4 py-2 text-brand-red bg-white/10 hover:bg-white/20 rounded-md font-bold"
                            >
                                Cerrar Sesión
                            </button>
                        ) : (
                            <Link href="/login" className="block w-full text-center bg-brand-yellow text-brand-blue px-4 py-2 rounded-md font-bold" onClick={() => setIsMenuOpen(false)}>
                                Ingresar / Registrarse
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}