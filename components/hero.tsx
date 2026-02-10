"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, ShieldCheck, Activity, Globe } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-white">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-eco-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[url('/patterns/grid.svg')] opacity-[0.03]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-eco-primary/5 px-4 py-2 rounded-full border border-eco-primary/10 shadow-sm backdrop-blur-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-eco-primary">Poder Ciudadano en tus manos</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] text-gray-900 tracking-tight">
                Eco <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-800 to-teal-900">Alerta</span>, <br />
                Reporte Ciudadano.
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                La plataforma inteligente para reportar riesgos ambientales y fauna urbana. Conecta, actúa y transforma nuestra ciudad hacia un futuro más verde.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 h-14 rounded-2xl text-lg font-bold shadow-xl hover:shadow-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                >
                  Unirse ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 px-8 h-14 rounded-2xl text-lg font-bold backdrop-blur-sm w-full sm:w-auto"
                >
                  Ver reportes
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center lg:items-start p-4 rounded-2xl bg-gray-50/50 border border-gray-100 backdrop-blur-sm">
                <div className="p-2 bg-eco-primary/10 rounded-lg mb-2">
                  <ShieldCheck className="w-5 h-5 text-eco-primary" />
                </div>
                <p className="text-xs font-bold text-gray-900">Validación Real</p>
                <p className="text-[10px] text-gray-500">Módulo 10 Seguro</p>
              </div>
              <div className="flex flex-col items-center lg:items-start p-4 rounded-2xl bg-gray-50/50 border border-gray-100 backdrop-blur-sm">
                <div className="p-2 bg-blue-500/10 rounded-lg mb-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs font-bold text-gray-900">Geolocalizado</p>
                <p className="text-[10px] text-gray-500">Precisión en tu reporte</p>
              </div>
              <div className="flex flex-col items-center lg:items-start p-4 rounded-2xl bg-gray-50/50 border border-gray-100 backdrop-blur-sm">
                <div className="p-2 bg-emerald-500/10 rounded-lg mb-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs font-bold text-gray-900">Acción Proactiva</p>
                <p className="text-[10px] text-gray-500">Impacto Geoubicado</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Illustration: Glass Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 bg-white/40 backdrop-blur-2xl border border-white p-6 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
              {/* Fake Dashboard UI */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="h-2 w-32 bg-gray-200 rounded-full" />
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/80 p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: `${i * 150}ms` }}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${i === 1 ? 'bg-orange-100 text-orange-600' : i === 2 ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {i === 1 ? <MapPin className="w-6 h-6" /> : i === 2 ? <ShieldCheck className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="h-3 w-2/3 bg-gray-200 rounded-full" />
                        <div className="h-2 w-1/3 bg-gray-100 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floaties */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-32 h-32 bg-eco-primary/20 rounded-full blur-2xl"
              />
            </div>

            {/* Background Accent */}
            <div className="absolute -inset-4 bg-linear-to-tr from-eco-primary/20 via-blue-400/10 to-transparent rounded-[40px] -z-10 blur-xl px-20" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
