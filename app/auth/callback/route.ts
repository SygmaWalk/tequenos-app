import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    console.log("--- CALLBACK EJECUTADO ---")
    console.log("URL completa:", request.url)
    console.log("Search Params:", Array.from(searchParams.entries()))
    console.log("Código recibido:", code ? "SÍ" : "NO")
    console.log("Origen:", origin)

    if (code) {
        const cookieStore = await import('next/headers').then((mod) => mod.cookies())

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        const all = cookieStore.getAll()
                        console.log("Cookies antes de exchange:", all.map(c => c.name))
                        return all
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) => {
                                console.log("Guardando cookie:", name)
                                cookieStore.set(name, value, options)
                            })
                        } catch (e) {
                            console.error("Error guardando cookie:", e)
                        }
                    },
                },
            }
        )

        // Intercambio
        const { error, data } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error("--- ERROR EN INTERCAMBIO ---", error.message)
            return NextResponse.redirect(`${origin}/auth/auth-code-error`)
        }

        console.log("--- INTERCAMBIO EXITOSO ---")
        console.log("Usuario:", data.user?.email)
        console.log("Cookies después:", cookieStore.getAll().map(c => c.name))
        // ÉXITO
        return NextResponse.redirect(`${origin}${next}`)
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}