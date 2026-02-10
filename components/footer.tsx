import { ShieldCheck, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Github } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-24 border-t border-white/5 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-eco-primary/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          {/* Brand & Mission */}
          <div className="col-span-1 md:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-eco-primary rounded-xl flex items-center justify-center shadow-lg shadow-eco-primary/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tighter">
                Eco<span className="text-eco-primary">Alerta</span>
              </span>
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
              Potenciando la vigilancia ciudadana para una comunidad más segura, protegida y consciente. El cambio empieza con tu reporte.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Github, label: "Github" }
              ].map((social) => {
                const Icon = social.icon
                return (
                  <button
                    key={social.label}
                    className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center hover:bg-eco-primary hover:text-white border border-white/10 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h3 className="font-bold text-gray-100 uppercase tracking-widest text-xs">Plataforma</h3>
            <ul className="space-y-4 text-gray-400 font-bold text-sm">
              <li><Link href="/" className="hover:text-eco-primary transition-colors">Inicio</Link></li>
              <li><Link href="/login" className="hover:text-eco-primary transition-colors">Mapa de Reportes</Link></li>
              <li><Link href="/register" className="hover:text-eco-primary transition-colors">Únete a la Red</Link></li>
              <li><Link href="/login" className="hover:text-eco-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-8">
            <h3 className="font-bold text-gray-100 uppercase tracking-widest text-xs">Ubicación</h3>
            <div className="space-y-4 text-gray-400 text-sm font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-eco-primary shrink-0" />
                <span>Ecuador <br />Cobertura de Servicio Nacional</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-eco-primary shrink-0" />
                <span>contacto@ecoalerta.ec</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-eco-primary shrink-0" />
                <span>+593 (07) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-xs font-bold">
          <p>© 2026 ECO ALERTA · PLATAFORMA CIUDADANA</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-eco-primary transition-colors tracking-widest uppercase">Privacidad</Link>
            <Link href="#" className="hover:text-eco-primary transition-colors tracking-widest uppercase">Términos</Link>
            <Link href="#" className="hover:text-eco-primary transition-colors tracking-widest uppercase">LOPDP</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
