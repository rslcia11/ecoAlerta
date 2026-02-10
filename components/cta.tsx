"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-linear-to-br from-gray-900 to-eco-primary p-12 md:p-20 rounded-[3rem] text-center space-y-10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Spark */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="space-y-6 relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              ¿Quieres ser parte <br />
              del <span className="text-eco-primary">cambio</span>?
            </h2>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Tus reportes ayudan a las autoridades y a la comunidad a reaccionar más rápido ante emergencias ambientales. Regístrate hoy y contribuye a mejorar tu zona.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4 relative z-10">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-emerald-50 px-10 h-16 rounded-2xl text-lg font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
              >
                Crear mi cuenta
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-2 border-white/40 text-white hover:bg-white hover:text-gray-900 px-10 h-16 rounded-2xl text-lg font-bold shadow-2xl transition-all w-full sm:w-auto"
              >
                Acceso para Miembros
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 pt-12 border-t border-white/10 relative z-10">
            {["Validación oficial", "Totalmente gratuito"].map((item) => (
              <div key={item} className="flex items-center gap-3 justify-center text-white/80">
                <CheckCircle2 className="w-5 h-5 text-eco-primary" />
                <span className="text-sm font-bold uppercase tracking-wider">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
