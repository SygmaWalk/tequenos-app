'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
// Agregamos 'Archive' a los iconos importados
import { LayoutDashboard, Package, ShoppingBag, Menu, X, LogOut, Home, Archive } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Función para cerrar sesión
    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    // Lista de Menú actualizada con "Inventario"
    const menuItems = [
        { name: 'Resumen', href: '/admin', icon: LayoutDashboard },
        { name: 'Productos', href: '/admin/products', icon: Package },
        { name: 'Inventario', href: '/admin/inventory', icon: Archive }, // <--- NUEVO
        { name: 'Pedidos', href: '/admin/orders', icon: ShoppingBag },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

            {/* 1. BARRA SUPERIOR MOVIL */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
                <span className="font-bold text-brand-blue text-lg">Tequeños Admin</span>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* 2. OVERLAY OSCURO (Móvil) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* 3. SIDEBAR */}
            <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
      `}>
                {/* Cabecera Sidebar */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center h-20">
                    <div>
                        <h1 className="text-xl font-bold text-brand-blue">Tequeños Admin</h1>
                        <p className="text-xs text-gray-400">Panel de Control</p>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden p-1 text-gray-400 hover:text-red-500"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Links de Navegación */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-brand-blue/10 text-brand-blue'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer del Sidebar: ACCIONES DE SALIDA */}
                <div className="p-4 border-t border-gray-100 space-y-2 bg-gray-50/50">

                    {/* Link para volver a la tienda pública sin desloguearse */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:text-brand-blue hover:shadow-sm rounded-lg transition-all"
                    >
                        <Home className="w-5 h-5" />
                        Ir a la Tienda
                    </Link>

                    {/* Botón de Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* 4. CONTENIDO PRINCIPAL */}
            <main className="flex-1 overflow-auto p-4 md:p-8 pt-6">
                {children}
            </main>
        </div>
    )
}