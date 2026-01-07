import { supabase } from '@/lib/supabase'

// Definimos la "forma" de tus datos (TypeScript)
interface Product {
  id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
}

export default async function Home() {
  // 1. Consulta a la base de datos (Backend Logic en el Frontend)
  // Nota: Next.js hace esto en el servidor, así que es seguro y rápido.
  const { data: products, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error('Error cargando productos:', error)
  }

  // 2. Renderizado (UI)
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-8 text-orange-600">
        Tequeños App - Menú
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto">
        {products?.map((product: Product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
          >
            {/* --- ZONA DE IMAGEN --- */}
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              /* Placeholder opcional si no hay imagen (un cuadro gris) */
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}

            {/* --- ZONA DE TEXTO (Con padding p-6) --- */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                {product.description}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">
                  ${product.price}
                </span>
                <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm font-medium transition-colors">
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <div className="text-center mt-20">
          <p className="text-xl text-gray-500">No hay productos disponibles por ahora.</p>
          <p className="text-sm text-gray-400">Vuelve a intentar más tarde.</p>
        </div>
      )}
    </main>
  )
}