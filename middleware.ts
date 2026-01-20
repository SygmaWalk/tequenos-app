import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    let res = NextResponse.next({
        request: {
            headers: req.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
                    res = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        res.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 1. Obtenemos el usuario validado por Supabase
    const { data: { user } } = await supabase.auth.getUser()

    // 2. CONFIGURACIÓN DE SEGURIDAD
    // Define aquí tu email de administrador
    const ADMIN_EMAIL = 'sygmawalk@gmail.com'

    // 3. Protección de rutas /admin
    if (req.nextUrl.pathname.startsWith('/admin')) {
        // Si no hay usuario, o el email no es el tuyo -> Fuera
        if (!user || user.email !== ADMIN_EMAIL) {
            // Redirigir al login
            const url = req.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    // Si el usuario ya está logueado y trata de entrar al login, mándalo al admin
    if (user && req.nextUrl.pathname === '/login') {
        // Opcional: solo si es admin
        if (user.email === ADMIN_EMAIL) {
            const url = req.nextUrl.clone()
            url.pathname = '/admin'
            return NextResponse.redirect(url)
        }
    }

    return res
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/login', // Agregamos login para redireccionar si ya existe sesión
    ],
}