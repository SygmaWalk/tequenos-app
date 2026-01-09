'use client'

import { useState } from 'react'
import { Product } from '@/lib/types'
import { useCart } from '@/context/CartContext'

interface ProductModalProps {
    product: Product | null
    isOpen: boolean
    onClose: () => void
}

// Simulamos salsas (luego vendrán de Supabase)
const MOCK_SALSAS = [
    { id: 's1', name: 'Salsa de Ajo', price: 0 },
    { id: 's2', name: 'Salsa Tártara', price: 0 },
    { id: 's3', name: 'Ketchup', price: 0 },
    { id: 's4', name: 'Salsa de Maíz', price: 100 }, // Ejemplo con costo extra
]

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const { addToCart } = useCart()
    const [selectedSauceId, setSelectedSauceId] = useState<string>('')

    if (!isOpen || !product) return null

    const handleAddToCart = () => {
        // Buscamos el objeto de la salsa seleccionada
        const sauce = MOCK_SALSAS.find(s => s.id === selectedSauceId)

        // Convertimos la salsa a formato Product (un truco rápido para el tipo)
        const sauceAsProduct: Product = sauce ? {
            id: sauce.id,
            name: sauce.name,
            price: sauce.price,
            description: 'Salsa extra',
            image_url: null,
            category: 'salsa'
        } : undefined as any

        // Agregamos al carrito con la opción
        addToCart(product, { sauce: sauceAsProduct })
        onClose()
        setSelectedSauceId('') // Reseteamos selección
    }

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
            {/* Overlay oscuro */}
            <div
                className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Tarjeta del Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">

                {/* Header con Imagen */}
                <div className="h-32 bg-orange-100 relative">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-orange-300">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-gray-600 hover:text-red-500"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800">{product.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{product.description}</p>

                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            Elige tu Salsa
                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Obligatorio</span>
                        </h4>

                        <div className="space-y-2">
                            {MOCK_SALSAS.map((salsa) => (
                                <label
                                    key={salsa.id}
                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedSauceId === salsa.id
                                        ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500'
                                        : 'border-gray-200 hover:border-orange-200'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="salsa"
                                            value={salsa.id}
                                            checked={selectedSauceId === salsa.id}
                                            onChange={(e) => setSelectedSauceId(e.target.value)}
                                            className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                                        />
                                        <span className="ml-3 text-gray-700 font-medium">{salsa.name}</span>
                                    </div>
                                    {salsa.price > 0 && (
                                        <span className="text-sm text-gray-500">+${salsa.price}</span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t pt-4">
                        <div className="text-2xl font-bold text-gray-800">
                            ${product.price}
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedSauceId} // Bloqueamos si no eligió salsa
                            className={`px-6 py-3 rounded-lg font-bold text-white transition-colors ${selectedSauceId
                                ? 'bg-orange-600 hover:bg-orange-700 shadow-lg'
                                : 'bg-gray-300 cursor-not-allowed'
                                }`}
                        >
                            Agregar al Pedido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}