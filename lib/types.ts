// src/lib/types.ts

// El producto tal cual viene de la Base de Datos
export interface Product {
    id: string
    name: string
    price: number
    description: string | null
    image_url: string | null
    category: string // 'comida', 'salsa', 'combo'
}

// Un ítem DENTRO del carrito (puede tener opciones seleccionadas)
export interface CartItem extends Product {
    cartItemId: string; // ID único temporal (porque puedo tener 2 combos iguales con salsas distintas)
    quantity: number;
    selectedOptions?: { // Aquí guardaremos las salsas seleccionadas
        sauce?: Product; // Guardamos el objeto salsa completo para saber su ID y descontar stock luego
        extras?: Product[];
    };
}