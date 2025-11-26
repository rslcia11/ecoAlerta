import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Categories } from "@/components/categories"
import { TrustSection } from "@/components/trust-section"
import { SecuritySection } from "@/components/security-section"
import { Testimonials } from "@/components/testimonials"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Eco Alerta | Sistema de Reporte Ambiental Ciudadano",
  description:
    "Reporta fauna urbana y riesgos ambientales en Loja. Plataforma ciudadana para proteger nuestro entorno.",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <Categories />
        <TrustSection />
        <SecuritySection />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
