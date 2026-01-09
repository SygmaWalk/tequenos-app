import Link from 'next/link'

export default function Hero() {
    return (
        // Fondo con tu gradiente original
        <section className="py-20 bg-linear-to-br from-brand-cream via-brand-yellow to-brand-cream overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12">

                    {/* TEXTO (Columna Izquierda) */}
                    <div className="md:w-1/2 text-center md:text-left z-10">
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
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                            <Link href="/nosotros" className="border-2 border-brand-blue text-brand-blue px-8 py-3 rounded-lg font-bold hover:bg-brand-blue hover:text-white transition-colors">
                                Conocer Más
                            </Link>
                        </div>
                    </div>

                    {/* IMAGEN (Columna Derecha) */}
                    <div className="md:w-1/2 relative">
                        <div className="relative z-10 transform hover:rotate-1 transition-transform duration-500">
                            {/* Usamos un div con sombra fuerte para simular tu estilo */}
                            <img
                                src="/queso.gif"
                                alt="Deliciosos Tequeños"
                                className="rounded-2xl shadow-2xl w-full object-cover border-4 border-white"
                            />

                            {/* Badge Flotante "Clientes Felices" */}
                            <div className="absolute -bottom-6 -right-6 bg-brand-red text-white p-4 rounded-xl shadow-xl hidden md:block animate-bounce-slow">
                                <p className="text-xs opacity-90">Más de</p>
                                <p className="text-3xl font-bold">10,000</p>
                                <p className="text-xs opacity-90">clientes felices</p>
                            </div>
                        </div>

                        {/* Decoración de fondo (blob) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/30 blur-3xl rounded-full -z-10"></div>
                    </div>

                </div>
            </div>
        </section>
    )
}