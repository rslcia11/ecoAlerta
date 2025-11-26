import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Zap } from "lucide-react"

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-eco-primary via-white to-eco-gray-light py-20 md:py-32 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-eco-accent opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-eco-secondary opacity-10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-eco-primary/10 px-4 py-2 rounded-full border border-eco-primary/20">
                <Zap className="w-4 h-4 text-eco-primary" />
                <span className="text-sm font-semibold text-eco-primary">Reporte en tiempo real</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-eco-primary-dark">
                Protege Loja, Ciudadano a Ciudadano
              </h1>

              <p className="text-xl text-eco-gray-dark leading-relaxed">
                Reporta fauna urbana y riesgos ambientales con un simple clic. Conecta con autoridades y comunidad para
                crear el cambio que Loja necesita.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-eco-primary hover:bg-eco-primary-dark text-white font-semibold flex items-center gap-2 h-12"
              >
                Comenzar a reportar
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-eco-primary text-eco-primary hover:bg-eco-primary/5 font-semibold h-12 bg-transparent"
              >
                Ver mapa de reportes
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-eco-gray-light">
              <div>
                <div className="text-2xl font-bold text-eco-primary">1,245+</div>
                <p className="text-sm text-eco-gray-medium">Reportes procesados</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-eco-primary">850+</div>
                <p className="text-sm text-eco-gray-medium">Ciudadanos activos</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-eco-primary">98%</div>
                <p className="text-sm text-eco-gray-medium">Tasa de respuesta</p>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative h-96 md:h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-eco-primary/20 to-eco-secondary/20 rounded-2xl blur-2xl" />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-eco-gray-light p-8 space-y-6 max-w-sm">
              <div className="flex items-center gap-3 bg-eco-success/10 p-4 rounded-lg border border-eco-success/20">
                <div className="w-3 h-3 bg-eco-success rounded-full" />
                <span className="text-sm font-semibold text-eco-gray-dark">Reporte activo en mapa</span>
              </div>

              <div className="space-y-3">
                <div className="h-32 bg-gradient-to-br from-eco-primary/20 to-eco-secondary/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-eco-primary" />
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-semibold text-eco-gray-dark">Avistamiento de fauna</p>
                <p className="text-eco-gray-medium">Calle Principal, Loja - Hace 2 minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
