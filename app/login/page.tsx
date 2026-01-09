'use client'

import { supabase } from '@/lib/supabase'

export default function LoginPage() {

    const handleLogin = async () => {
        // Aquí llamamos a Google con la configuración que hiciste
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Redirige al callback de autenticación
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) alert('Error: ' + error.message)
    }

    return (
        <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border-t-4 border-brand-blue">
                <h1 className="text-3xl font-bold text-brand-blue mb-2">Bienvenido</h1>
                <p className="text-gray-500 mb-8">Accede para gestionar tus pedidos y puntos</p>

                <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        className="w-6 h-6"
                        alt="Google"
                    />
                    Continuar con Google
                </button>
            </div>
        </div>
    )
}