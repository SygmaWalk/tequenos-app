'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, ArrowLeft } from 'lucide-react' // Opcional: Icono para volver
import Link from 'next/link'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)

    const loginWithGoogle = async () => {
        try {
            setIsLoading(true)
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    // OJO: La redirección la manejaremos inteligentemente en el callback
                    redirectTo: `${location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            })
        } catch (error) {
            console.error('Error login:', error)
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-brand-cream/20 flex flex-col items-center justify-center p-4 relative">

            {/* Botón para volver al Home (útil para clientes) */}
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-brand-blue transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Volver al menú</span>
            </Link>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                {/* Encabezado Branding */}
                <div className="bg-brand-yellow p-8 text-center relative overflow-hidden">
                    {/* Patrón de fondo opcional o color sólido */}
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido!</h1>
                        <p className="text-gray-800 font-medium">Inicia sesión para gestionar tus pedidos</p>
                    </div>
                </div>

                {/* Cuerpo */}
                <div className="p-8 pt-10">
                    <button
                        onClick={loginWithGoogle}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 hover:border-brand-blue/50 hover:bg-blue-50/50 font-bold py-4 px-4 rounded-xl transition-all duration-200 group"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
                        ) : (
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26-1.19-.58z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        )}
                        <span className="group-hover:text-brand-blue transition-colors">
                            {isLoading ? 'Conectando...' : 'Continuar con Google'}
                        </span>
                    </button>

                    <p className="mt-8 text-center text-xs text-gray-400 leading-relaxed">
                        Al iniciar sesión, podrás guardar tus direcciones, ver tu historial de pedidos y acceder a promociones exclusivas.
                    </p>
                </div>
            </div>
        </main>
    )
}