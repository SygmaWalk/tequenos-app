'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Archive, AlertTriangle, Loader2 } from 'lucide-react'

// Definimos el tipo (Corregido: usa min_stock)
type Supply = {
    id: string
    name: string
    current_stock: number
    min_stock: number
    category: string
}

export default function InventoryPage() {
    const [supplies, setSupplies] = useState<Supply[]>([])
    const [loading, setLoading] = useState(true)

    const fetchSupplies = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('supplies')
                .select('*')
                .order('name')

            if (error) throw error
            setSupplies(data || [])
        } catch (error) {
            console.error('Error cargando inventario:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSupplies()
    }, [])

    // Función para actualizar stock rápido (+10 / -10)
    const updateStock = async (id: string, current: number, amount: number) => {
        try {
            const newStock = current + amount
            if (newStock < 0) return

            const { error } = await supabase
                .from('supplies')
                .update({ current_stock: newStock })
                .eq('id', id)

            if (error) throw error

            // Actualizar UI localmente
            setSupplies(supplies.map(s => s.id === id ? { ...s, current_stock: newStock } : s))
        } catch (error) {
            alert('Error actualizando stock')
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventario y Papelería</h1>
                    <p className="text-gray-500 text-sm">Gestiona tus cajas, bolsas e insumos.</p>
                </div>
                <button
                    onClick={() => alert('Pronto haremos el modal para crear nuevos insumos')}
                    className="bg-brand-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Insumo
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center text-brand-blue"><Loader2 className="animate-spin" /></div>
                ) : supplies.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No hay insumos. ¡Corre el script SQL de seed primero!
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Item</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Categoría</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Stock Actual</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Estado</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm text-right">Ajuste Rápido</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {supplies.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-2">
                                        <Archive className="w-4 h-4 text-gray-400" />
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs capitalize">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-lg">
                                        {item.current_stock}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Lógica de Alerta corregida */}
                                        {item.current_stock <= item.min_stock ? (
                                            <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded w-fit">
                                                <AlertTriangle className="w-3 h-3" /> Bajo Stock
                                            </span>
                                        ) : (
                                            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">OK</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => updateStock(item.id, item.current_stock, -1)} className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">-1</button>
                                            <button onClick={() => updateStock(item.id, item.current_stock, 10)} className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">+10</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}