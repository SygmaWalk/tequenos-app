import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // OBTENER USUARIO
    const { data: { user } } = await supabase.auth.getUser()

    // --- ZONA DE DEBUGGING (MIRA TU TERMINAL) ---
    if (request.nextUrl.pathname.startsWith('/admin')) {
        console.log("--- INTENTO DE ACCESO A ADMIN ---")
        console.log("Usuario detectado:", user ? user.email : "NINGUNO")
        console.log("Email esperado:", 'sygmawalk@gmail.com') // <--- VERIFICA QUE ESTE SEA TU EMAIL EXACTO
    }
    // ---------------------------------------------

    // TU EMAIL DE ADMIN
    const ADMIN_EMAIL = 'sygmawalk@gmail.com' // <--- ASEGURATE QUE SEA EXACTO (minusculas, sin espacios)

    // REGLA 1: No hay usuario
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        console.log("RECHAZADO: No hay sesión")
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // REGLA 2: Usuario incorrecto
    if (request.nextUrl.pathname.startsWith('/admin') && user?.email !== ADMIN_EMAIL) {
        console.log("RECHAZADO: El email no coincide")
        return NextResponse.redirect(new URL('/', request.url))
    }

    return response
}

export const config = {
    matcher: ['/admin/:path*'],
}