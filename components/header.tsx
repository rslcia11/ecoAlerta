"use client"

import { useState } from "react"
import { Menu, X, AlertCircle, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: "Inicio", href: "#" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Categorías", href: "#categorias" },
    { label: "Sobre nosotros", href: "#sobre" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-eco-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-eco-primary rounded-full flex items-center justify-center shadow-md">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:inline font-bold text-xl text-eco-primary">Eco Alerta</span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-eco-gray-dark hover:text-eco-primary font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Ver Reportes - Secondary Action */}
            <Button
              variant="outline"
              className="hidden sm:inline-flex border-eco-primary text-eco-primary hover:bg-eco-primary hover:text-white transition-all bg-transparent"
            >
              Ver reportes
            </Button>

            {/* Login Button */}
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex text-eco-primary hover:bg-eco-primary/10">
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar sesión
              </Button>
            </Link>

            {/* Crear Cuenta - Primary Action */}
            <Link href="/register">
              <Button className="hidden sm:inline-flex bg-eco-primary hover:bg-eco-primary-dark text-white font-bold shadow-md">
                Crear cuenta
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-eco-primary/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-eco-primary" /> : <Menu className="w-6 h-6 text-eco-primary" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t-2 border-eco-primary pt-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-eco-gray-dark hover:bg-eco-primary/10 hover:text-eco-primary rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}

            <div className="space-y-2 pt-2">
              <Button
                variant="outline"
                className="w-full border-eco-primary text-eco-primary hover:bg-eco-primary hover:text-white bg-transparent"
              >
                Ver reportes
              </Button>
              <Link href="/login">
                <Button variant="ghost" className="w-full text-eco-primary hover:bg-eco-primary/10">
                  <LogIn className="w-4 h-4 mr-2" />
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="w-full bg-eco-primary hover:bg-eco-primary-dark text-white font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Crear cuenta
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
