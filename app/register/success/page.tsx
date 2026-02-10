"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, ShieldCheck, Mail, MapPin, AlertCircle, ArrowRight, Home, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

export default function SuccessPage() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setShowContent(true), 100)

    // Confetti celebratorio
    const duration = 3000
    const end = Date.now() + duration

    const colors = ["#064e3b", "#065f46", "#059669"]

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-primary-lighter via-white to-eco-secondary/10 flex items-center justify-center p-4">
      <div
        className={`max-w-2xl w-full transition-all duration-1000 transform ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-eco-primary/20 overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-eco-primary to-eco-secondary p-8 text-center relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            {/* Icono de éxito animado */}
            <div className="relative mb-6 flex justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
                <CheckCircle2 className="w-14 h-14 text-eco-success animate-scale-in" strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-3">¡Cuenta creada con éxito!</h1>
            <p className="text-lg text-white/90">Bienvenido a la comunidad Eco Alerta</p>
          </div>

          {/* Contenido */}
          <div className="p-8 space-y-6">
            {/* Mensaje de bienvenida */}
            <div className="bg-eco-success/10 border-2 border-eco-success/20 rounded-xl p-6 animate-fade-in-up">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-eco-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-eco-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-eco-gray-dark mb-2">¡Gracias por unirte!</h2>
                  <p className="text-eco-gray-dark leading-relaxed">
                    Tu cuenta ha sido creada exitosamente. Ahora puedes comenzar a reportar problemas ambientales en tu
                    ciudad y ayudar a cuidar nuestro planeta.
                  </p>
                </div>
              </div>
            </div>

            {/* Próximos pasos */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-eco-gray-dark flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-eco-primary" />
                Próximos pasos
              </h3>

              <div className="space-y-3">
                {/* Paso 1 */}
                <div className="flex items-start gap-4 p-4 bg-eco-primary/5 rounded-lg border border-eco-primary/10 hover:bg-eco-primary/10 transition-colors animate-fade-in-up delay-100">
                  <div className="w-8 h-8 bg-eco-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-eco-gray-dark mb-1 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-eco-primary" />
                      Verifica tu correo electrónico
                    </h4>
                    <p className="text-sm text-eco-gray-medium">
                      Te hemos enviado un correo de confirmación. Revisa tu bandeja de entrada.
                    </p>
                  </div>
                </div>

                {/* Paso 2 */}
                <div className="flex items-start gap-4 p-4 bg-eco-primary/5 rounded-lg border border-eco-primary/10 hover:bg-eco-primary/10 transition-colors animate-fade-in-up delay-200">
                  <div className="w-8 h-8 bg-eco-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-eco-gray-dark mb-1 flex items-center gap-2">
                      <LogIn className="w-4 h-4 text-eco-primary" />
                      Inicia sesión
                    </h4>
                    <p className="text-sm text-eco-gray-medium">
                      Accede con tu correo y contraseña para comenzar a usar la plataforma.
                    </p>
                  </div>
                </div>

                {/* Paso 3 */}
                <div className="flex items-start gap-4 p-4 bg-eco-primary/5 rounded-lg border border-eco-primary/10 hover:bg-eco-primary/10 transition-colors animate-fade-in-up delay-300">
                  <div className="w-8 h-8 bg-eco-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-eco-gray-dark mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-eco-primary" />
                      Crea tu primer reporte
                    </h4>
                    <p className="text-sm text-eco-gray-medium">
                      Explora el mapa y reporta cualquier problema ambiental que encuentres.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-eco-accent/20 border-2 border-eco-accent/40 rounded-xl p-4 animate-fade-in-up delay-400">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-eco-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-eco-gray-dark font-medium mb-1">¿Necesitas ayuda?</p>
                  <p className="text-sm text-eco-gray-medium">
                    Visita nuestra sección de ayuda o contáctanos en{" "}
                    <a href="mailto:soporte@ecoalerta.com" className="text-eco-primary font-medium hover:underline">
                      soporte@ecoalerta.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/login" className="flex-1">
                <Button className="w-full bg-eco-primary hover:bg-eco-primary-dark text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                  <LogIn className="w-5 h-5 mr-2" />
                  Iniciar sesión
                </Button>
              </Link>

              <Link href="/" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-2 border-eco-primary text-eco-primary hover:bg-eco-primary hover:text-white font-bold py-6 text-lg transition-all bg-transparent"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Ir al inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer con estadística motivacional */}
        <div className="mt-6 text-center animate-fade-in delay-500">
          <p className="text-sm text-eco-gray-medium">
            Ya somos <span className="text-eco-primary font-bold text-lg">1,247</span> ciudadanos vigilando activamente
            nuestro entorno ambiental
          </p>
        </div>
      </div>
    </div>
  )
}
