import { createBrowserClient } from '@supabase/ssr'

// Función para crear el cliente en el navegador
export const createClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

// Exportamos una instancia única para usar en Componentes de Cliente (como tu Home o Login)
export const supabase = createClient()