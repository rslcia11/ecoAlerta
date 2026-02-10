"use client"

import { Shield, Lock, Eye, Users, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export function SecuritySection() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Datos Protegidos",

    },
    {
      icon: Lock,
      title: "Acceso Seguro",

    },
    {
      icon: Eye,
      title: "Privacidad Total",

    },
    {
      icon: Users,
      title: "Confianza Ciudadana",

    },
  ]

  return (
    <section id="security" className="py-24 md:py-32 bg-gray-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-eco-primary/10 rounded-full blur-[120px] z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-eco-primary/10 px-4 py-2 rounded-full border border-eco-primary/20"
            >
              <Shield className="w-4 h-4 text-eco-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-eco-primary">Nuestra Prioridad</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
            >
              Arquitectura centrada en la <span className="text-eco-primary">Seguridad</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg leading-relaxed"
            >
              En Eco Alerta, no solo protegemos el medio ambiente; protegemos tu identidad y tu compromiso ciudadano con el entorno.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-4 pt-4"
            >
              {["Cumplimiento total con la LOPDP de Ecuador", "Infraestructura Cloud de alta disponibilidad", "Auditorías de seguridad periódicas"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 bg-eco-primary/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-eco-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-eco-primary/20 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-eco-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
