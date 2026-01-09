'use client'
import Link from 'next/link'

export default function Hero() {
    return (
        // Quitamos overflow-hidden por si acaso corta el sidebar
        <section className="relative py-20 bg-gradient-to-br from-brand-cream via-brand-yellow to-brand-cream">
            <div className="container mx-auto px-4 relative"> {/* Quitamos z-index aquí */}
                <div className="flex flex-col md:flex-row items-center gap-12">

                    {/* TEXTO: Quitamos z-index explícitos innecesarios */}
                    <div className="md:w-1/2 text-center md:text-left">
                        {/* ... (tu contenido de texto sigue igual) ... */}
                        <span className="inline-block bg-brand-yellow text-gray-900 px-4 py-1 rounded-full text-sm font-bold mb-4 shadow-sm">
                            ¡Auténtico sabor venezolano! 🇻🇪
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-brand-blue mb-6 leading-tight">
                            El mejor tequeño que probarás
                        </h1>
                        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                            Disfruta de nuestros tequeños artesanales, preparados con queso venezolano de la más alta calidad.
                            Perfectos para cualquier ocasión.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button
                                onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-brand-yellow text-gray-900 px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-yellow-400 transition-transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Ver Productos
                            </button>
                            <Link href="/nosotros" className="border-2 border-brand-blue text-brand-blue px-8 py-3 rounded-lg font-bold hover:bg-brand-blue hover:text-white transition-colors">
                                Conocer Más
                            </Link>
                        </div>
                    </div>

                    {/* IMAGEN: Aquí estaba el problema */}
                    <div className="md:w-1/2 relative">
                        {/* Quitamos 'transform' y 'hover:rotate' momentáneamente para probar. 
                 Si el error persiste, es esto. Si se arregla, luego buscamos otra forma de rotarlo. */}
                        <div className="relative transition-all duration-500">
                            <img
                                src="/queso.gif"
                                alt="Deliciosos Tequeños"
                                className="rounded-2xl shadow-2xl w-full object-cover border-4 border-white"
                            />

                            <div className="absolute -bottom-6 -right-6 bg-brand-red text-white p-4 rounded-xl shadow-xl hidden md:block animate-bounce-slow">
                                <p className="text-xs opacity-90">Más de</p>
                                <p className="text-3xl font-bold">10,000</p>
                                <p className="text-xs opacity-90">clientes felices</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}