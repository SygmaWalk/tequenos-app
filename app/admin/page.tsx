'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AlertTriangle, TrendingUp, ShoppingBag, Package, Phone, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
    const [lowStockItems, setLowStockItems] = useState<any[]>([])
    const [stats, setStats] = useState({
        productsCount: 0,
        ordersToday: 0,
        totalRevenue: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true)

                // 1. TRAER DATOS (Ahora sin RLS, esto no fallará)
                const { data: suppliesData, error: suppliesError } = await supabase
                    .from('supplies')
                    .select('*')

                if (suppliesError) throw suppliesError

                const { data: suppliersData, error: suppliersError } = await supabase
                    .from('suppliers')
                    .select('id, name, whatsapp_number')

                if (suppliersError) throw suppliersError

                // 2. UNIR DATOS MANUALMENTE
                const suppliersMap = (suppliersData || []).reduce((acc: any, supplier: any) => {
                    acc[supplier.id] = supplier
                    return acc
                }, {})

                // Filtramos items con stock bajo
                const lowStockData = (suppliesData || [])
                    .filter((item: any) => item.current_stock <= item.min_stock)
                    .map((item: any) => ({
                        ...item,
                        suppliers: item.supplier_id ? suppliersMap[item.supplier_id] : null
                    }))

                setLowStockItems(lowStockData)

                // 3. OTRAS MÉTRICAS
                const { count: productsCount } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_active', true)

                setStats({
                    productsCount: productsCount || 0,
                    ordersToday: 0,
                    totalRevenue: 0
                })

            } catch (error: any) {

            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Hola, Jose 👋</h1>
                    <p className="text-sm text-gray-500">Resumen de tu negocio</p>
                </div>
                <span className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full shadow-sm">
                    {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
            </div>

            {/* --- SECCIÓN DE ALERTAS --- */}
            {lowStockItems.length > 0 ? (
                <div className="mb-8 bg-white border-l-4 border-red-500 rounded-xl p-6 shadow-sm relative overflow-hidden">

                    {/* Círculo animado de "Peligro" */}
                    <div className="absolute top-4 right-4 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Alerta de Stock Crítico</h3>
                            <p className="text-sm text-gray-500">
                                Hay <span className="font-bold text-red-600">{lowStockItems.length} insumos</span> por debajo del mínimo.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                        {lowStockItems.map((item) => (
                            <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-bold text-gray-800 truncate pr-2">{item.name}</p>
                                    <Link href="/admin/inventory" className="text-gray-400 hover:text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 mb-3 shadow-sm">
                                    <span className="text-[10px] uppercase font-bold text-gray-400">Stock</span>
                                    <div className="text-xs font-mono">
                                        <span className="text-red-600 font-bold text-lg">{item.current_stock}</span>
                                        <span className="text-gray-400"> / {item.min_stock}</span>
                                    </div>
                                </div>

                                {/* BOTÓN WHATSAPP */}
                                {item.suppliers && item.suppliers.whatsapp_number ? (
                                    <a
                                        href={`https://wa.me/${item.suppliers.whatsapp_number}?text=Hola, necesito reponer: ${item.name}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-sm shadow-green-200"
                                    >
                                        <Phone className="w-3 h-3" /> PEDIR POR WHATSAPP
                                    </a>
                                ) : (
                                    <div className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-500 py-2 rounded-lg text-xs font-bold cursor-not-allowed">
                                        SIN PROVEEDOR
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Estado sin alertas (Todo OK)
                <div className="mb-8 bg-green-50 border border-green-100 rounded-xl p-6 flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full text-green-600">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-green-800">Inventario Saludable</h3>
                        <p className="text-sm text-green-600">No hay alertas de stock por el momento.</p>
                    </div>
                </div>
            )}

            {/* --- TARJETAS DE ESTADÍSTICAS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-brand-blue rounded-lg">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Pedidos Hoy</h3>
                            <p className="text-2xl font-bold text-gray-800">{stats.ordersToday}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Ingresos del Mes</h3>
                            <p className="text-2xl font-bold text-gray-800">$0.00</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-yellow-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Productos Activos</h3>
                            <p className="text-2xl font-bold text-gray-800">{stats.productsCount}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}