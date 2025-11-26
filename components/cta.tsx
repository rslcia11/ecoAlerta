import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-r from-eco-primary via-eco-secondary to-eco-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">¿Listo para proteger Loja?</h2>

          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Únete a cientos de ciudadanos que ya están contribuyendo a un futuro más verde y sostenible para nuestra
            ciudad.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-white text-eco-primary hover:bg-gray-100 font-semibold flex items-center justify-center gap-2 h-12"
            >
              Descargar la app
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 font-semibold h-12 bg-transparent"
            >
              Ir a la plataforma
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-12 border-t border-white/20">
            {["Reportes en tiempo real", "Totalmente gratuito", "Protección de privacidad"].map((item) => (
              <div key={item} className="flex items-center gap-3 justify-center text-white">
                <Check className="w-5 h-5" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
