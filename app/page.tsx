'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'
import { Product } from '@/lib/types'
import ProductModal from '@/components/ProductModal'

// NUEVOS COMPONENTES
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Footer from '@/components/Footer'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  // ESTADOS PARA EL MODAL
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*')
        if (error) console.error(error)
        else setProducts(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-brand-cream/20"> {/* Fondo general suave */}

      {/* 1. HERO SECTION (Tu diseño original migrado) */}
      <Hero />

      {/* 2. FEATURES (Tus 3 iconos) */}
      <Features />

      {/* 3. SECCIÓN PRODUCTOS */}
      <div id="menu-section" className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-brand-blue mb-4">Nuestros Productos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de tequeños, combos y salsas artesanales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: Product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
              {/* Imagen con efecto zoom */}
              <div className="h-56 overflow-hidden relative">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Sin imagen</div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                  <span className="text-lg font-bold text-green-600 bg-green-50 px-2 py-1 rounded">${product.price}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>

                <button
                  className="w-full bg-brand-yellow text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-sm"
                  onClick={() => handleProductClick(product)}
                >
                  Agregar al Pedido
                </button>
              </div>
            </div>
          ))}
        </div>

        {loading && <p className="text-center text-gray-500 mt-10">Cargando delicias...</p>}
      </div>

      {/* 4. FOOTER */}
      <Footer />

      {/* MODAL */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </main>
  )
}