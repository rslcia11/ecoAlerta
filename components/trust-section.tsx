import { Card } from "@/components/ui/card"
import { CheckCircle2, Award, Users, TrendingUp } from "lucide-react"

export function TrustSection() {
  const stats = [
    { icon: CheckCircle2, label: "Reportes Verificados", value: "1,200+" },
    { icon: Award, label: "Instituciones Asociadas", value: "12" },
    { icon: Users, label: "Ciudadanos Comprometidos", value: "850+" },
    { icon: TrendingUp, label: "Efectividad de Acción", value: "98%" },
  ]

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-eco-primary-dark mb-4">Confianza que actúa</h2>
          <p className="text-xl text-eco-gray-medium max-w-2xl mx-auto">
            Números que hablan de nuestro compromiso con Loja
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="border border-eco-gray-light text-center p-8 hover:shadow-lg transition-all">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-eco-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-eco-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-eco-primary mb-2">{stat.value}</div>
                <p className="text-eco-gray-medium font-medium">{stat.label}</p>
              </Card>
            )
          })}
        </div>

        {/* Partnerships */}
        <div className="mt-20 pt-20 border-t border-eco-gray-light">
          <h3 className="text-2xl font-bold text-eco-primary-dark text-center mb-12">
            Instituciones que respaldan Eco Alerta
          </h3>
          <div className="grid md:grid-cols-4 gap-8 items-center justify-items-center">
            {["Municipio Loja", "Min. del Ambiente", "CITES Loja", "Fundación Verde"].map((partner) => (
              <div
                key={partner}
                className="w-32 h-24 bg-eco-gray-light rounded-lg flex items-center justify-center text-eco-gray-medium font-semibold text-sm text-center hover:bg-eco-primary/5 transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
