import { AlertCircle, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-eco-gray-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-eco-primary rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg">Eco Alerta</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Plataforma ciudadana para reportar y actuar sobre riesgos ambientales en Loja.
            </p>
            <div className="flex gap-3 pt-4">
              {[Facebook, Twitter, Instagram].map((Icon) => (
                <button
                  key={Icon.name}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-eco-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-bold">Plataforma</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              {["Reportar", "Ver reportes", "Estadísticas", "API"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-eco-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-bold">Empresa</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              {["Sobre nosotros", "Blog", "Empleos", "Prensa"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-eco-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-bold">Contacto</h3>
            <div className="space-y-3 text-white/70 text-sm">
              <div className="flex items-center gap-2 hover:text-eco-primary transition-colors cursor-pointer">
                <Mail className="w-4 h-4" />
                <span>info@ecoalerta.ec</span>
              </div>
              <div className="flex items-center gap-2 hover:text-eco-primary transition-colors cursor-pointer">
                <Phone className="w-4 h-4" />
                <span>+593 7 1234567</span>
              </div>
              <div className="flex items-center gap-2 hover:text-eco-primary transition-colors cursor-pointer">
                <MapPin className="w-4 h-4" />
                <span>Loja, Ecuador</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-sm">
          <p>&copy; 2025 Eco Alerta. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-eco-primary transition-colors">
              Términos de servicio
            </a>
            <a href="#" className="hover:text-eco-primary transition-colors">
              Política de privacidad
            </a>
            <a href="#" className="hover:text-eco-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
