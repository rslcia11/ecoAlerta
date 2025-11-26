import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Leaf, Trash2, Flame, Bird, TreePine } from "lucide-react"

const categories = [
  {
    icon: Bird,
    title: "Fauna Urbana",
    description: "Avistamientos de animales en la ciudad, abandonos o comportamientos inusuales",
    color: "bg-eco-secondary",
    reports: 342,
  },
  {
    icon: Trash2,
    title: "Contaminación",
    description: "Acumulación de basura en ríos, calles y espacios públicos",
    color: "bg-eco-warning",
    reports: 287,
  },
  {
    icon: Flame,
    title: "Quemas Ilegales",
    description: "Reporte de quema de residuos y materiales peligrosos",
    color: "bg-eco-error",
    reports: 156,
  },
  {
    icon: TreePine,
    title: "Deforestación",
    description: "Tala ilegal de árboles y degradación de ecosistemas",
    color: "bg-eco-primary-dark",
    reports: 198,
  },
  {
    icon: Leaf,
    title: "Contaminación de Agua",
    description: "Problemas en ríos, fuentes y sistemas de agua potable",
    color: "bg-eco-secondary",
    reports: 223,
  },
  {
    icon: AlertTriangle,
    title: "Otros Riesgos",
    description: "Situaciones ambientales o sanitarias no clasificadas",
    color: "bg-eco-accent",
    reports: 99,
  },
]

export function Categories() {
  return (
    <section className="py-20 md:py-28 bg-eco-gray-light/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-eco-primary-dark mb-4">Categorías de reportes</h2>
          <p className="text-xl text-eco-gray-medium max-w-2xl mx-auto">
            Selecciona el tipo de incidente ambiental que deseas reportar
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card
                key={index}
                className="border border-eco-gray-light hover:shadow-xl hover:border-eco-primary/50 transition-all duration-300 cursor-pointer hover:translate-y-[-4px] group overflow-hidden"
              >
                <div className="p-8 space-y-6">
                  <div
                    className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-eco-primary-dark">{category.title}</h3>
                    <p className="text-eco-gray-medium text-sm leading-relaxed">{category.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-eco-gray-light">
                    <Badge variant="secondary" className="bg-eco-primary/10 text-eco-primary hover:bg-eco-primary/20">
                      {category.reports} reportes
                    </Badge>
                    <span className="text-xs text-eco-gray-medium">{"→"}</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
