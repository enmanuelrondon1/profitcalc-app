import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { LoadingBar } from "@/components/ui/loading-bar";
import { NavigationProgress } from "@/components/ui/navigation-progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ProfitCalc",
    template: "%s | ProfitCalc"
  },
  description: "Calcula tus ganancias reales con análisis precisos de costos, márgenes y velocidad de retorno.",
  keywords: ["ganancias", "costos", "beneficios", "proyectos", "negocios", "cálculo financiero"],
  authors: [{ name: "ProfitCalc Team" }],
  openGraph: {
    title: "ProfitCalc - Calcula tus Ganancias Reales",
    description: "Optimiza tus proyectos con análisis precisos de costos, márgenes de beneficio y velocidad de retorno.",
    type: "website",
    locale: "es_ES",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Loading Bar for navigation */}
          <LoadingBar />
          
          {/* Navigation Progress Indicator */}
          <NavigationProgress />
          
          <div className="relative flex flex-col min-h-screen">
            {/* Navbar - Fixed at top */}
            <Header />
            
            {/* Main content with top padding for navbar */}
            <main className="flex-1 pt-16">
              {/* Background gradient overlay */}
              <div className="fixed inset-0 opacity-50 -z-10 bg-gradient-to-br from-background via-background to-accent/5" />
              
              {/* Content wrapper with proper spacing */}
              <div className="relative">
                {children}
              </div>
            </main>
          </div>
          
          {/* Toast notifications */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}