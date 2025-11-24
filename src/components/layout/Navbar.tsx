"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { LogoFull } from "@/components/layout/LogoSystem";
import { Menu, X, Home, FolderOpen, Receipt,  TrendingUp, Calculator } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user: User | null;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    description: "Vista general de tus finanzas"
  },
  {
    title: "Proyectos",
    href: "/projects",
    icon: FolderOpen,
    description: "Gestiona tus proyectos"
  },
  {
    title: "Costos",
    href: "/costs",
    icon: Receipt,
    description: "Controla tus costos"
  },
  {
    title: "Análisis",
    href: "/analysis",
    icon: TrendingUp,
    description: "Visualiza análisis detallados"
  },
];

export function Navbar({ user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled 
        ? "border-b border-primary/10 bg-background/90 backdrop-blur-xl shadow-sm" 
        : "bg-background/70 backdrop-blur-md"
    )}>
      {/* Gradient overlay subtle */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative flex items-center justify-between h-16 layout-container">
        
        {/* Logo Premium */}
        <div className="flex-shrink-0">
          <LogoFull size="md" href="/" />
        </div>

        {/* Desktop Navigation */}
        <nav className="items-center hidden gap-1 md:flex">
          {user && navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  "transition-smooth text-foreground/70 hover:text-foreground hover:bg-primary/10 relative group",
                  isActive && "text-primary bg-primary/10"
                )}
              >
                <Link href={item.href} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.title}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
                  )}
                  
                  {/* Hover tooltip */}
                  <div className="absolute px-2 py-1 mb-2 text-xs text-white transition-opacity transform -translate-x-1/2 bg-gray-900 rounded opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100 whitespace-nowrap">
                    {item.description}
                  </div>
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {user ? (
            <>
              {/* Desktop Actions */}
              <div className="items-center hidden gap-2 md:flex">
                <Button 
                  asChild
                  className="btn-primary group"
                >
                  <Link href="/projects/new" className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    <span>Nuevo Proyecto</span>
                  </Link>
                </Button>

                {/* User Menu */}
                <div className="flex items-center gap-2 pl-2 border-l border-border/50">
                  <div className="relative group">
                    <Avatar className="cursor-pointer transition-smooth h-9 w-9 ring-2 ring-primary/20 hover:ring-primary/50">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.name ?? user.email}
                      />
                      <AvatarFallback className="font-semibold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* User tooltip */}
                    <div className="absolute right-0 px-3 py-2 mb-2 text-sm text-white transition-opacity bg-gray-900 rounded opacity-0 pointer-events-none bottom-full group-hover:opacity-100 whitespace-nowrap">
                      <div className="font-medium">{user.user_metadata?.name || 'Usuario'}</div>
                      <div className="text-xs text-gray-300">{user.email}</div>
                    </div>
                  </div>
                  <LogoutButton />
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center w-10 h-10 transition-colors duration-200 rounded-lg md:hidden hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </>
          ) : (
            <Button 
              asChild
              className="btn-primary"
            >
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {user && (
        <div className={cn(
          "md:hidden transition-all duration-300 overflow-hidden",
          mobileMenuOpen ? "max-h-64 border-t border-primary/10 bg-background/90 backdrop-blur-xl" : "max-h-0"
        )}>
          <nav className="py-4 space-y-1 layout-container">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  asChild
                  className={cn(
                    "justify-start w-full text-foreground/70 hover:text-foreground hover:bg-primary/10",
                    isActive && "text-primary bg-primary/10"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </Link>
                </Button>
              );
            })}
            
            <div className="pt-2 mt-2 border-t border-border/50">
              <Button 
                asChild
                className="justify-start w-full btn-primary"
              >
                <Link href="/projects/new" className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  <span>Nuevo Proyecto</span>
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}