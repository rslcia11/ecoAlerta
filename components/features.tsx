"use client"

import { Card } from "@/components/ui/card"
import { ShieldCheck, Map, Zap, UserCircle, BarChart3, Fingerprint } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Fingerprint,
    title: "Validación Oficial",
    description: "Sistema integrado de validación de cédula (Módulo 10) para asegurar la veracidad de cada reporte.",
    color: "bg-eco-primary",
  },
  {
    icon: Map,
    title: "Mapa de Incidentes",
    description: "Visualización geoespacial en tiempo real de todos los riesgos detectados cerca de ti.",
    color: "bg-blue-600",
  },
  {
    icon: Zap,
    title: "Feed en Vivo",
    description: "Noticias e incidentes de tu comunidad al instante, filtrados por tu cercanía.",
    color: "bg-amber-500",
  },
  {
    icon: UserCircle,
    title: "Perfil Ciudadano",
    description: "Gestiona tus reportes, edita tu información y mantén un historial de tu impacto ambiental.",
    color: "bg-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Estadísticas Reales",
    description: "Análisis basado en datos reales recolectados por la ciudadanía para la toma de decisiones.",
    color: "bg-indigo-600",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad Total",
    description: "Tus datos están protegidos bajo estándares de seguridad modernos y la LOPDP de Ecuador.",
    color: "bg-gray-900",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block bg-eco-primary/10 px-4 py-2 rounded-full mb-4"
          >
            <span className="text-eco-primary font-bold text-xs uppercase tracking-widest">Capacidades</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight"
          >
            Herramientas para una <span className="text-eco-primary">Gestión Eficiente</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Nuestra tecnología facilita la comunicación directa entre ciudadanos y entidades responsables para una respuesta ágil ante riesgos.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card
                  className="group relative h-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 bg-white rounded-3xl overflow-hidden p-8"
                >
                  {/* Decorative Gradient */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${feature.color} opacity-[0.03] rounded-bl-full transition-all group-hover:scale-150 duration-700`} />

                  <div className="relative space-y-6">
                    <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center shadow-lg shadow-${feature.color}/20 transition-transform group-hover:scale-110 duration-500`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-eco-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
