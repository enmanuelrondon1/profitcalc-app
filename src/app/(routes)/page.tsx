// src/app/(routes)/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Zap,
  BarChart3,
  Calculator,
  Shield,
  Users,
  Star,
  CheckCircle,
  HelpCircle,
  ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/projects");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_50%)]" />

        <div className="relative flex items-center justify-center flex-1 px-4 py-16 sm:py-24 lg:py-32">
          <div className="w-full max-w-4xl">
            <div className="relative space-y-8 sm:space-y-10">
              {/* Announcement badge */}
              <div className="flex justify-center">
                <Badge className="bg-profit-10 text-profit border-profit/30 hover:bg-profit/20">
                  <Zap className="w-3 h-3 mr-1" />
                  Nueva versión con análisis financieros avanzados
                </Badge>
              </div>

              {/* Main heading */}
              <div className="space-y-6 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-foreground">Calcula tus</span>
                  <span className="block text-transparent bg-gradient-to-r from-profit via-primary to-accent bg-clip-text">
                    Ganancias Reales
                  </span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg leading-relaxed sm:text-xl text-muted-foreground">
                  La herramienta definitiva para calcular costos, márgenes y
                  beneficios de tus proyectos de forma sencilla y eficiente.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="btn-primary group">
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2"
                  >
                    Comenzar Ahora
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="btn-secondary"
                >
                  <Link href="#features">
                    Ver Características
                    <ArrowDown className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Social proof */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">4.9/5</span> -
                  Más de 500 emprendedores confían en ProfitCalc
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section id="features" className="section-spacing">
        <div className="layout-container">
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <Badge className="mb-4 bg-primary-10 text-primary border-primary/30">
              Características
            </Badge>
            <h2 className="mb-4 title-section">
              Todo lo que necesitas para gestionar tus finanzas
            </h2>
            <p className="max-w-2xl mx-auto subtitle-section">
              ProfitCalc ofrece herramientas avanzadas para que tengas el
              control total de tus proyectos y finanzas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="card-premium group">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 transition-transform rounded-lg bg-primary/10 group-hover:scale-110">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Análisis Detallado
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Obtén análisis precisos de costos y beneficios para tomar
                  decisiones informadas.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-profit" />
                    <span>Análisis de rentabilidad</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-profit" />
                    <span>Proyecciones de crecimiento</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-profit" />
                    <span>Informes personalizables</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-premium group">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 transition-transform rounded-lg bg-success/10 group-hover:scale-110">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Márgenes Optimizados
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Calcula y optimiza tus márgenes de beneficio para maximizar la
                  rentabilidad.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-profit" />
                    <span>Cálculo de márgenes exactos</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-profit" />
                    <span>Comparación con la industria</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-profit" />
                    <span>Recomendaciones de optimización</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-premium group">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 transition-transform rounded-lg bg-accent/10 group-hover:scale-110">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Velocidad de Retorno
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Calcula rápidamente cuándo recuperarás tu inversión y
                  empezarás a generar ganancias.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-profit" />
                    <span>Cálculo de ROI</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-profit" />
                    <span>Análisis de punto de equilibrio</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-profit" />
                    <span>Proyecciones temporales</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-spacing bg-muted/30">
        <div className="layout-container">
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <Badge className="mb-4 bg-primary-10 text-primary border-primary/30">
              Testimonios
            </Badge>
            <h2 className="mb-4 title-section">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="max-w-2xl mx-auto subtitle-section">
              Descubre cómo ProfitCalc ha transformado la forma en que los
              emprendedores gestionan sus finanzas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  &ldquo;ProfitCalc ha cambiado completamente la forma en que gestiono
                  mis proyectos. Ahora puedo tomar decisiones basadas en datos
                  reales.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <span className="text-sm font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">Juan Díaz</p>
                    <p className="text-sm text-muted-foreground">
                      Desarrollador Web
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  &ldquo;La interfaz es increíblemente intuitiva y los análisis
                  financieros son precisos. Me ha ayudado a optimizar mis
                  márgenes de beneficio.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
                    <span className="text-sm font-semibold">MG</span>
                  </div>
                  <div>
                    <p className="font-medium">María García</p>
                    <p className="text-sm text-muted-foreground">
                      Consultora de Negocios
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  &ldquo;Como emprendedor, necesito herramientas que me ahorren
                  tiempo. ProfitCalc es exactamente eso: rápido, preciso y fácil
                  de usar.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10">
                    <span className="text-sm font-semibold">CR</span>
                  </div>
                  <div>
                    <p className="font-medium">Carlos Rodríguez</p>
                    <p className="text-sm text-muted-foreground">
                      Fundador de Startup
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="layout-container">
          <Card className="overflow-hidden card-premium">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
            <CardContent className="relative p-8 text-center md:p-12">
              <div className="max-w-2xl mx-auto space-y-6">
                <Badge className="bg-profit-10 text-profit border-profit/30">
                  <Calculator className="w-3 h-3 mr-1" />
                  Comienza Gratis
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  ¿Listo para tomar el control de tus finanzas?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Únete a cientos de emprendedores que ya están optimizando sus
                  proyectos con ProfitCalc.
                </p>
                <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center">
                  <Button asChild size="lg" className="btn-primary group">
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2"
                    >
                      Comenzar Ahora
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="btn-secondary"
                  >
                    <Link href="#faq">Ver Preguntas Frecuentes</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-spacing bg-muted/30">
        <div className="layout-container">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-primary-10 text-primary border-primary/30">
                <HelpCircle className="w-3 h-3 mr-1" />
                Preguntas Frecuentes
              </Badge>
              <h2 className="mb-4 title-section">
                ¿Tienes preguntas? Tenemos respuestas
              </h2>
              <p className="subtitle-section">
                Todo lo que necesitas saber sobre ProfitCalc.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="border-none card-premium"
              >
                <AccordionTrigger className="px-6 py-4 text-left">
                  ¿Es ProfitCalc gratuito?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Sí, ProfitCalc ofrece un plan gratuito con características
                  básicas perfectas para emprendedores que están comenzando.
                  También tenemos planes de pago con funcionalidades avanzadas
                  para empresas más grandes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="border-none card-premium"
              >
                <AccordionTrigger className="px-6 py-4 text-left">
                  ¿Mis datos están seguros?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Absolutamente. Utilizamos encriptación de última generación y
                  seguimos las mejores prácticas de seguridad para proteger tus
                  datos. Tu información financiera está completamente segura con
                  nosotros.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="border-none card-premium"
              >
                <AccordionTrigger className="px-6 py-4 text-left">
                  ¿Puedo exportar mis informes?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Sí, todos nuestros planes te permiten exportar tus informes en
                  formato PDF y CSV. Los planes de pago también ofrecen
                  exportación en Excel y formatos personalizados.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="border-none card-premium"
              >
                <AccordionTrigger className="px-6 py-4 text-left">
                  ¿ProfitCalc se integra con otras herramientas?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Sí, ProfitCalc se integra con herramientas populares como
                  QuickBooks, Xero y muchas plataformas de contabilidad. También
                  ofrecemos una API para integraciones personalizadas en
                  nuestros planes empresariales.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-background/95 backdrop-blur-xl">
        <div className="py-12 layout-container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold">ProfitCalc</span>
              </div>
              <p className="text-sm text-muted-foreground">
                La herramienta definitiva para calcular costos, márgenes y
                beneficios de tus proyectos.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Producto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/features"
                    className="transition-colors hover:text-foreground"
                  >
                    Características
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="transition-colors hover:text-foreground"
                  >
                    Precios
                  </Link>
                </li>
                <li>
                  <Link
                    href="/integrations"
                    className="transition-colors hover:text-foreground"
                  >
                    Integraciones
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Recursos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="transition-colors hover:text-foreground"
                  >
                    Guías
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api"
                    className="transition-colors hover:text-foreground"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="transition-colors hover:text-foreground"
                  >
                    Sobre nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-foreground"
                  >
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="transition-colors hover:text-foreground"
                  >
                    Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-8 mt-12 border-t border-border/50 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ProfitCalc. Todos los derechos
              reservados.
            </p>
            <div className="flex items-center gap-4">
              <Badge className="bg-profit-10 text-profit border-profit/30">
                <Shield className="w-3 h-3 mr-1" />
                100% Seguro
              </Badge>
              <Badge className="bg-primary-10 text-primary border-primary/30">
                <Users className="w-3 h-3 mr-1" />
                500+ Usuarios
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
