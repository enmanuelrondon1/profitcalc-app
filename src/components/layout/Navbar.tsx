// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { LogoFull } from "@/components/layout/LogoSystem";
import {
  Menu,
  X,
  Home,
  FolderOpen,
  Receipt,
  TrendingUp,
  Calculator,
  Crown,
  Shield,
  Lock,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user: User | null;
  userRole?: "user" | "admin" | "moderator";
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    description: "Vista general de tus finanzas",
  },
  {
    title: "Proyectos",
    href: "/projects",
    icon: FolderOpen,
    description: "Gestiona tus proyectos",
  },
  {
    title: "Costos",
    href: "/costs",
    icon: Receipt,
    description: "Controla tus costos",
  },
  {
    title: "Análisis",
    href: "/analysis",
    icon: TrendingUp,
    description: "Visualiza análisis detallados",
  },
];

const getRoleConfig = (role?: string) => {
  switch (role) {
    case "admin":
      return {
        icon: Crown,
        label: "Administrador",
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-900/30",
        badge:
          "bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-300",
      };
    case "moderator":
      return {
        icon: Shield,
        label: "Moderador",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-900/30",
        badge:
          "bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-300",
      };
    default:
      return {
        icon: Lock,
        label: "Usuario",
        color: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-100 dark:bg-gray-900/30",
        badge:
          "bg-gray-500/20 border-gray-500/30 text-gray-700 dark:text-gray-300",
      };
  }
};

export function Navbar({ user, userRole = "user" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const roleConfig = getRoleConfig(userRole);
  const RoleIcon = roleConfig.icon;

  // Solución para el error de hidratación
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [userMenuOpen]);

  if (!mounted) {
    return null; // Evita la hidratación hasta que el componente esté montado
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-primary/10 bg-background/95 backdrop-blur-xl shadow-lg shadow-primary/5"
          : "bg-background/80 backdrop-blur-md border-b border-transparent"
      )}
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-primary/3 via-transparent to-accent/3" />

      <div className="relative layout-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0 gap-4">
            <LogoFull size="md" href="/" />

            {/* Divider */}
            <div className="hidden w-px h-6 sm:block bg-gradient-to-b from-transparent via-border/50 to-transparent" />

            {/* Role Badge - Desktop */}
            {user && userRole !== "user" && (
              <div
                className={cn(
                  "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border",
                  roleConfig.badge
                )}
              >
                <RoleIcon className="w-4 h-4" />
                <span className="text-xs font-semibold">
                  {roleConfig.label}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="items-center hidden gap-2 md:flex">
            {user &&
              navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    asChild
                    className={cn(
                      "transition-smooth relative group text-foreground/70 hover:text-foreground",
                      "hover:bg-primary/10 rounded-lg",
                      isActive && "text-primary bg-primary/10 font-semibold"
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.title}</span>

                      {/* Active indicator - Animated underline */}
                      {isActive && (
                        <div className="absolute bottom-0 h-1 rounded-t-full left-3 right-3 bg-gradient-to-r from-primary via-primary to-accent" />
                      )}
                    </Link>
                  </Button>
                );
              })}

            {/* Admin Link - Only for admin and moderator */}
            {user && (userRole === "admin" || userRole === "moderator") && (
              <>
                <div className="w-px h-6 mx-2 bg-gradient-to-b from-transparent via-border/50 to-transparent" />
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "transition-smooth relative group text-foreground/70 hover:text-foreground",
                    "hover:bg-amber-500/10 rounded-lg",
                    pathname === "/admin" &&
                      "text-amber-600 dark:text-amber-400 bg-amber-500/10 font-semibold"
                  )}
                >
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    <Crown className="w-4 h-4" />
                    <span className="text-sm">Admin</span>

                    {pathname === "/admin" && (
                      <div className="absolute bottom-0 h-1 rounded-t-full left-3 right-3 bg-gradient-to-r from-amber-500 to-amber-400" />
                    )}
                  </Link>
                </Button>
              </>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {user ? (
              <>
                {/* Desktop Actions */}
                <div className="items-center hidden gap-2 md:flex">
                  {/* New Project Button */}
                  <Button asChild className="btn-primary group">
                    <Link
                      href="/projects/new"
                      className="flex items-center gap-2"
                    >
                      <Calculator className="w-4 h-4" />
                      <span className="text-sm">Nuevo</span>
                    </Link>
                  </Button>

                  {/* User Menu - Desktop */}
                  <div className="relative user-menu-container">
                    <Button
                      variant="ghost"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10"
                    >
                      <Avatar
                        className={cn(
                          "transition-smooth h-8 w-8 ring-2",
                          "ring-primary/20 hover:ring-primary/50"
                        )}
                      >
                        <AvatarImage
                          src={user.user_metadata?.avatar_url}
                          alt={user.user_metadata?.name ?? user.email}
                        />
                        <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                          {user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        userMenuOpen && "rotate-180"
                      )} />
                    </Button>

                    {/* User Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 w-64 mt-2 duration-200 origin-top-right animate-in fade-in">
                        <div className="p-4 border rounded-lg shadow-lg bg-background/95 backdrop-blur-md">
                          {/* User Info */}
                          <div className="flex items-center gap-3 pb-4 mb-4 border-b">
                            <Avatar className="w-12 h-12">
                              <AvatarImage
                                src={user.user_metadata?.avatar_url}
                                alt={user.user_metadata?.name ?? user.email}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                                {user.email?.[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold truncate">
                                {user.user_metadata?.name || "Usuario"}
                              </div>
                              <div className="text-sm truncate text-muted-foreground">
                                {user.email}
                              </div>
                              <div className={cn(
                                "text-xs font-medium mt-1 flex items-center gap-1",
                                roleConfig.color
                              )}>
                                <RoleIcon className="w-3 h-3" />
                                {roleConfig.label}
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="space-y-1">
                            <Button
                              variant="ghost"
                              className="justify-start w-full"
                              asChild
                            >
                              <Link href="/profile" className="flex items-center gap-2">
                                <UserIcon className="w-4 h-4" />
                                <span>Mi Perfil</span>
                              </Link>
                            </Button>
                            
                            <Button
                              variant="ghost"
                              className="justify-start w-full"
                              asChild
                            >
                              <Link href="/settings" className="flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                <span>Configuración</span>
                              </Link>
                            </Button>

                            <div className="pt-2 mt-2 border-t">
                              <LogoutButton 
                                variant="destructive" 
                                className="justify-start w-full"
                              >
                                <LogOut className="w-4 h-4" />
                                <span>Cerrar Sesión</span>
                              </LogoutButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={cn(
                    "inline-flex items-center justify-center w-10 h-10 transition-all duration-200",
                    "rounded-lg md:hidden hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50",
                    mobileMenuOpen && "bg-primary/20"
                  )}
                  aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5 animate-in rotate-in" />
                  ) : (
                    <Menu className="w-5 h-5 animate-in fade-in" />
                  )}
                </button>
              </>
            ) : (
              <Button asChild className="btn-primary">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Mejorado */}
      {user && (
        <div
          className={cn(
            "md:hidden transition-all duration-300 overflow-hidden bg-background/95 backdrop-blur-xl border-t border-primary/10",
            mobileMenuOpen ? "max-h-[500px]" : "max-h-0"
          )}
        >
          <nav className="py-4 space-y-2 layout-container">
            {/* Información del usuario - Móvil */}
            <div className="px-4 py-3 mb-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user.user_metadata?.avatar_url}
                    alt={user.user_metadata?.name ?? user.email}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {user.user_metadata?.name || "Usuario"}
                  </div>
                  <div className="text-sm truncate text-muted-foreground">
                    {user.email}
                  </div>
                  <div className={cn("text-xs font-medium mt-1 flex items-center gap-1", roleConfig.color)}>
                    <RoleIcon className="w-3 h-3" />
                    {roleConfig.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Navegación principal */}
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    asChild
                    className={cn(
                      "justify-start w-full text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-smooth h-12",
                      isActive && "text-primary bg-primary/10 font-semibold"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <Icon className="flex-shrink-0 w-5 h-5" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                      )}
                    </Link>
                  </Button>
                );
              })}
            </div>

            {/* Sección Admin */}
            {userRole === "admin" || userRole === "moderator" ? (
              <>
                <div className="h-px my-3 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "justify-start w-full text-foreground/70 hover:text-foreground hover:bg-amber-500/10 transition-smooth h-12",
                    pathname === "/admin" &&
                      "text-amber-600 dark:text-amber-400 bg-amber-500/10 font-semibold"
                  )}
                >
                  <Link href="/admin" className="flex items-center gap-3">
                    <Crown className="flex-shrink-0 w-5 h-5" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">Panel Admin</div>
                      <div className="text-xs text-muted-foreground">
                        Gestiona usuarios y proyectos
                      </div>
                    </div>
                    {pathname === "/admin" && (
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </Link>
                </Button>
              </>
            ) : null}

            {/* Acciones rápidas */}
            <div className="pt-3 mt-3 border-t border-border/50">
              <div className="grid grid-cols-2 gap-2">
                <Button asChild className="h-10 btn-primary">
                  <Link href="/projects/new" className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    <span className="text-sm">Nuevo Proyecto</span>
                  </Link>
                </Button>
                
                <LogoutButton 
                  variant="outline" 
                  className="h-10 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Salir</span>
                </LogoutButton>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}