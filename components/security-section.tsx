import { Shield, Lock, Eye, Users } from "lucide-react"

export function SecuritySection() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Datos Protegidos",
      description: "Encriptación end-to-end en todos tus reportes y datos personales",
    },
    {
      icon: Lock,
      title: "Autenticación Segura",
      description: "Verificación de dos factores y contraseñas robustas",
    },
    {
      icon: Eye,
      title: "Privacidad Garantizada",
      description: "Control total sobre quién ve tu información personal",
    },
    {
      icon: Users,
      title: "Verificación de Usuarios",
      description: "Sistema de confianza comunitario para reportes auténticos",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-eco-primary/5 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-eco-primary/10 px-4 py-2 rounded-full mb-4">
            <span className="text-eco-primary font-semibold text-sm">Seguridad y Confianza</span>
          </div>
          <h2 className="text-4xl font-bold text-eco-primary mb-4">Tu información está segura</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Protegemos tus datos con los más altos estándares de seguridad. Tu confianza es nuestra prioridad.
          </p>
        </div>

        {/* Security Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {securityFeatures.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white border-2 border-eco-primary/20 rounded-xl p-8 hover:border-eco-primary transition-colors"
            >
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-eco-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-eco-primary mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Info */}
        <div className="bg-eco-primary/10 border-l-4 border-eco-primary rounded-lg p-8">
          <h3 className="font-bold text-eco-primary mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Cumplimiento Normativo
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-eco-primary mb-2">GDPR</p>
              <p>Cumplimos con regulaciones europeas de protección de datos</p>
            </div>
            <div>
              <p className="font-semibold text-eco-primary mb-2">LGPD Ecuador</p>
              <p>Adheridos a la Ley Orgánica de Protección de Datos</p>
            </div>
            <div>
              <p className="font-semibold text-eco-primary mb-2">ISO 27001</p>
              <p>Certificación internacional en seguridad de información</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
