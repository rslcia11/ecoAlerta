"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, X, LogIn } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Características", href: "#features" },
    { label: "Categorías", href: "#categories" },
    { label: "Seguridad", href: "#security" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 ${isScrolled ? "py-3 bg-white/90 backdrop-blur-2xl shadow-sm border-b border-gray-100" : "py-6 bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group transition-all">
            <div className="w-11 h-11 bg-eco-primary rounded-2xl flex items-center justify-center shadow-lg shadow-eco-primary/25 group-hover:rotate-12 transition-transform duration-500">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-2xl tracking-tighter text-gray-900">
                Eco<span className="text-eco-primary">Alerta</span>
              </span>
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 group-hover:text-eco-primary transition-colors">Sistema de Reporte Ciudadano</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100 backdrop-blur-md">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-white transition-all cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 font-bold hover:text-gray-900 px-5 transition-all">
                <LogIn className="w-4 h-4 mr-2" />
                Ingresar
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 h-11 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-gray-200">
                Unirse
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2.5 bg-gray-100/80 rounded-xl text-gray-900 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-b border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-10 space-y-8">
              <div className="grid gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-2xl font-black text-gray-900 hover:text-eco-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="pt-8 border-t border-gray-100 flex flex-col gap-4">
                <Link href="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-gray-200 font-bold text-lg">Iniciar Sesión</Button>
                </Link>
                <Link href="/register" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-gray-200">Comenzar Gratis</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
