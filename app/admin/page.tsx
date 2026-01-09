'use client'

export default function AdminDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-brand-blue mb-6">Panel de Administración</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tarjeta de Resumen 1 */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-brand-yellow">
                    <h3 className="text-gray-500 font-bold">Pedidos Hoy</h3>
                    <p className="text-3xl font-bold text-gray-800">0</p>
                </div>

                {/* Tarjeta de Resumen 2 */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-brand-blue">
                    <h3 className="text-gray-500 font-bold">Productos Activos</h3>
                    <p className="text-3xl font-bold text-gray-800">Cargando...</p>
                </div>

                {/* Acciones Rápidas */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 font-bold mb-4">Acciones</h3>
                    <button className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                        + Nuevo Producto
                    </button>
                </div>
            </div>
        </div>
    )
}