'use client'

import Link from 'next/link'

export default function AuthCodeError() {
    return (
        <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border-t-4 border-red-500">
                <h1 className="text-3xl font-bold text-red-600 mb-2">Error de Autenticación</h1>
                <p className="text-gray-500 mb-8">No pudimos completar el proceso de login con Google.</p>

                <Link
                    href="/login"
                    className="w-full block bg-brand-blue text-white font-medium py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
                >
                    Volver al Login
                </Link>
            </div>
        </div>
    )
}
