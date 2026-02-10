"use client"

import { Card } from "@/components/ui/card"
import { Trash2, TreePine, Droplets, Volume2, Dog, Wind, Home, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const categories = [
  {
    id: 5,
    icon: Dog,
    title: "Fauna Urbana",
    description: "Animales heridos, abandonos o avistamientos de fauna en riesgo.",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: 1,
    icon: Trash2,
    title: "Basura",
    description: "Vertido de basura ilegal y acumulación de residuos.",
    color: "from-emerald-500 to-green-600",
  },
  {
    id: 2,
    icon: TreePine,
    title: "Deforestación",
    description: "Tala ilegal de bosques y degradación de ecosistemas locales.",
    color: "from-green-600 to-teal-700",
  },
  {
    id: 3,
    icon: Droplets,
    title: "Agua",
    description: "Contaminación de ríos, quebradas o fallas en el suministro.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 4,
    icon: Volume2,
    title: "Ruido",
    description: "Contaminación acústica excesiva en zonas residenciales.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: 6,
    icon: Wind,
    title: "Aire",
    description: "Emisiones tóxicas y mala calidad del aire en la ciudad.",
    color: "from-gray-500 to-slate-700",
  },
]

export function Categories() {
  return (
    <section id="categories" className="py-24 md:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block bg-eco-primary/10 px-4 py-2 rounded-full mb-4"
            >
              <span className="text-eco-primary font-bold text-xs uppercase tracking-widest">Enfoque</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight"
            >
              Explora las <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">Categorías</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/register" className="text-eco-primary font-bold flex items-center gap-2 group hover:underline underline-offset-4">
              Ver todos los tipos
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group relative bg-gray-50/50 border-gray-100 hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-all duration-500 rounded-[2.5rem] p-10 h-full flex flex-col justify-between overflow-hidden cursor-pointer">
                  {/* Hover Background Glow */}
                  <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-linear-to-br ${category.color} opacity-0 group-hover:opacity-5 blur-[80px] transition-opacity duration-700`} />

                  <div className="relative z-10 space-y-6">
                    <div className={`w-16 h-16 bg-linear-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-rotate-6 transition-transform duration-500`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-8 mt-auto flex items-center gap-2 text-xs font-bold text-gray-400 group-hover:text-eco-primary transition-colors">
                    <span>REPORTAR AHORA</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0" />
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
