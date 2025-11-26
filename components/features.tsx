import { Card } from "@/components/ui/card"
import { AlertTriangle, Map, Bell, Users, TrendingUp, Lock } from "lucide-react"

const features = [
  {
    icon: AlertTriangle,
    title: "Reportes Rápidos",
    description: "Reporta incidentes ambientales en segundos con información geolocalizada",
  },
  {
    icon: Map,
    title: "Mapa Interactivo",
    description: "Visualiza todos los reportes en tiempo real en un mapa de Loja",
  },
  {
    icon: Bell,
    title: "Alertas Automáticas",
    description: "Recibe notificaciones de situaciones críticas cerca de tu ubicación",
  },
  {
    icon: Users,
    title: "Comunidad Activa",
    description: "Conecta con ciudadanos y autoridades comprometidas con el cambio",
  },
  {
    icon: TrendingUp,
    title: "Estadísticas",
    description: "Accede a datos que impulsan decisiones ambientales",
  },
  {
    icon: Lock,
    title: "Privacidad Protegida",
    description: "Reporta de forma anónima si lo deseas, tus datos están seguros",
  },
]

export function Features() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-eco-primary-dark mb-4">
            Características que marcan la diferencia
          </h2>
          <p className="text-xl text-eco-gray-medium max-w-2xl mx-auto">
            Herramientas poderosas diseñadas para empoderar a la ciudadanía
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="border border-eco-gray-light hover:shadow-lg hover:border-eco-primary/30 transition-all duration-300 group"
              >
                <div className="p-8 space-y-4">
                  <div className="w-12 h-12 bg-eco-primary/10 rounded-lg flex items-center justify-center group-hover:bg-eco-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-eco-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-eco-primary-dark">{feature.title}</h3>
                  <p className="text-eco-gray-medium leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
