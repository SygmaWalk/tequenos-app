export default function Footer() {
    return (
        <footer className="bg-brand-blue text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* Columna 1 */}
                    <div>
                        <h5 className="text-xl font-bold text-brand-yellow mb-4">Tequeños Gavidia</h5>
                        <p className="text-blue-100 leading-relaxed">
                            Sabor venezolano auténtico. Hechos con amor y los mejores ingredientes para compartir en familia.
                        </p>
                    </div>

                    {/* Columna 2 */}
                    <div>
                        <h5 className="text-xl font-bold text-brand-yellow mb-4">Contacto</h5>
                        <ul className="space-y-3 text-blue-100">
                            <li className="flex items-center gap-2">
                                <span>📍</span> 25 de Mayo, Provincia de Buenos Aires.
                            </li>
                            <li className="flex items-center gap-2">
                                <span>📱</span> +54 9 11 37736159
                            </li>

                        </ul>
                    </div>

                    {/* Columna 3 */}
                    <div>
                        <h5 className="text-xl font-bold text-brand-yellow mb-4">Síguenos</h5>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-brand-blue transition-all">
                                IG
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-brand-blue transition-all">
                                FB
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-blue-800 pt-8 text-center text-blue-200 text-sm">
                    &copy; 2025 Tequeños Gavidia. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    )
}