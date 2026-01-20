'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { Plus, Pencil, Trash2, Loader2, ImageOff } from 'lucide-react'
// NUEVO: Importar el modal
import AdminProductModal from '@/components/AdminProductModal'

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    // NUEVO: Estados para manejar el Modal
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('name', { ascending: true }) // Ordenar por nombre

            if (error) throw error
            setProducts(data || [])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleDelete = async (id: string | number) => {
        if (!window.confirm('¿Seguro que quieres eliminarlo?')) return
        try {
            const { error } = await supabase.from('products').delete().eq('id', id)
            if (error) throw error
            setProducts(products.filter(p => String(p.id) !== String(id)))
        } catch (error) {
            alert('Error al eliminar')
        }
    }

    // NUEVO: Funciones para abrir el modal
    const handleCreate = () => {
        setEditingProduct(null) // Modo Crear
        setIsModalOpen(true)
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product) // Modo Editar
        setIsModalOpen(true)
    }

    // NUEVO: Qué pasa cuando el modal guarda con éxito
    const handleProductSaved = () => {
        fetchProducts() // Recargamos la lista desde la BD
        // (Opcional: Podríamos actualizar el estado localmente para ser más rápidos, pero esto es más seguro)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
                    <p className="text-gray-500 text-sm">Gestiona tu catálogo</p>
                </div>
                <button
                    onClick={handleCreate} // Usamos la nueva función
                    className="bg-brand-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Producto
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center text-brand-blue">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No hay productos. ¡Crea el primero!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-gray-500 text-sm">Producto</th>
                                    <th className="px-6 py-4 font-medium text-gray-500 text-sm">Precio</th>
                                    <th className="px-6 py-4 font-medium text-gray-500 text-sm">Categoría</th>
                                    <th className="px-6 py-4 font-medium text-gray-500 text-sm text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageOff className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-800 block">{product.name}</span>
                                                    {/* Mostrar descripción corta si existe */}
                                                    <span className="text-xs text-gray-400 truncate max-w-[200px] block">{product.description}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">${product.price}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-brand-blue">
                                                {product.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)} // Botón Editar
                                                    className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* NUEVO: Aquí vive el Modal, invisible hasta que isModalOpen sea true */}
            <AdminProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productToEdit={editingProduct}
                onSaved={handleProductSaved}
            />
        </div>
    )
}