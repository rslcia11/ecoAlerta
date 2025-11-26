import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "María García",
    role: "Ciudadana, Centro Loja",
    avatar: "👩‍🌾",
    content: "Gracias a Eco Alerta pude reportar la quema de residuos cerca de mi casa. ¡La respuesta fue inmediata!",
    rating: 5,
  },
  {
    name: "Carlos López",
    role: "Oficial Ambiental",
    avatar: "👨‍💼",
    content: "Los reportes son precisos, detallados y llegan en tiempo real. Facilita mucho nuestra gestión.",
    rating: 5,
  },
  {
    name: "Daniela Ruiz",
    role: "Activista Ambiental",
    avatar: "♀️",
    content: "Finalmente tenemos una herramienta que empodera a la comunidad. Loja está cambiando.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-eco-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-eco-primary-dark mb-4">Lo que dicen nuestros usuarios</h2>
          <p className="text-xl text-eco-gray-medium max-w-2xl mx-auto">
            Historias reales de ciudadanos que están marcando la diferencia
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-eco-primary/20 p-8 hover:shadow-lg transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-eco-warning text-eco-warning" />
                ))}
              </div>

              <p className="text-eco-gray-dark leading-relaxed mb-6">{testimonial.content}</p>

              <div className="flex items-center gap-4">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-bold text-eco-primary-dark">{testimonial.name}</p>
                  <p className="text-sm text-eco-gray-medium">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
