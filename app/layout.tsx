import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/CartSideBar"; // Asegúrate que el nombre del archivo coincida (Mayúsculas/Minúsculas)

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tequeños Dugarte",
  description: "Los mejores tequeños de la zona",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* UN SOLO PROVIDER PARA GOBERNARLOS A TODOS */}
        <CartProvider>
          <Navbar />
          <CartSidebar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}