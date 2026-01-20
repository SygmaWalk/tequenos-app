'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { X, Loader2, Save } from 'lucide-react'

interface AdminProductModalProps {
    isOpen: boolean
    onClose: () => void
    productToEdit: Product | null // Si es null, estamos creando. Si tiene datos, editamos.
    onSaved: () => void // Para recargar la lista al terminar
}

export default function AdminProductModal({ isOpen, onClose, productToEdit, onSaved }: AdminProductModalProps) {
    const [loading, setLoading] = useState(false)

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Tequeños', // Valor por defecto
        image_url: ''
    })

    // Cuando se abre el modal, decidimos si limpiar o llenar los datos
    useEffect(() => {
        if (productToEdit) {
            // Modo Edición
            setFormData({
                name: productToEdit.name,
                price: productToEdit.price.toString(),
                description: productToEdit.description || '',
                category: productToEdit.category || 'Tequeños',
                image_url: productToEdit.image_url || ''
            })
        } else {
            // Modo Creación (Reset)
            setFormData({
                name: '',
                price: '',
                description: '',
                category: 'Tequeños',
                image_url: ''
            })
        }
    }, [productToEdit, isOpen])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const productData = {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                category: formData.category,
                image_url: formData.image_url,
            }

            if (productToEdit) {
                // --- UPDATE ---
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productToEdit.id)

                if (error) throw error
            } else {
                // --- CREATE ---
                const { error } = await supabase
                    .from('products')
                    .insert([productData])

                if (error) throw error
            }

            // Si todo sale bien:
            onSaved() // Recargar lista de fondo
            onClose() // Cerrar modal
        } catch (error) {
            console.error('Error guardando:', error)
            alert('Error al guardar el producto')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">
                        {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Formulario Scrollable */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
                            placeholder="Ej: Tequeños de Queso (12 unid)"
                        />
                    </div>

                    {/* Precio y Categoría */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                            >
                                <option value="Tequeños">Tequeños</option>
                                <option value="Combos">Combos</option>
                                <option value="Salsas">Salsas</option>
                                <option value="Bebidas">Bebidas</option>
                            </select>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                            placeholder="Ingredientes, detalles..."
                        />
                    </div>

                    {/* URL de Imagen (Simple por ahora) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                        <input
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                            placeholder="https://..."
                        />
                        {formData.image_url && (
                            <div className="mt-2 w-full h-32 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                                <img src={formData.image_url} alt="Vista previa" className="h-full object-contain" />
                            </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">Por ahora copia el link de una imagen de internet (ej. Google Images)</p>
                    </div>

                    {/* Botón Guardar */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}