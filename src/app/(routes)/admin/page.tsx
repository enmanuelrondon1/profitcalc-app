//src/app/(routes)/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "./actions";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

// Tipo específico para usuarios admin con rol tipado
type UserRole = "user" | "admin" | "moderator";

interface AdminUser {
  user_id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const data = await getAllUsers();
        
        // Validar y transformar los datos para asegurar que el role sea válido
        const validRoles: UserRole[] = ["user", "admin", "moderator"];
        const validatedUsers = (data as unknown[]).map((user) => {
          // tratar cada entrada como parcial de AdminUser y normalizar campos mínimos
          const u = user as Partial<AdminUser> & { id?: string };
          return {
            user_id: u.user_id ?? u.id ?? "",
            email: u.email ?? "",
            role: validRoles.includes(u.role as UserRole) ? (u.role as UserRole) : "user",
            created_at: u.created_at ?? new Date().toISOString(),
          } as AdminUser;
        });
        
        setUsers(validatedUsers);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/projects">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold">
                  <Users className="w-6 h-6 text-primary" />
                  Panel de Administración
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gestiona usuarios y proyectos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {error && (
          <div className="p-4 mb-6 border rounded-lg bg-destructive/10 border-destructive/30">
            <p className="font-medium text-destructive">Error: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Cargando usuarios...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No hay usuarios registrados</p>
          </div>
        ) : (
          <AdminUsersTable users={users} />
        )}
      </div>
    </div>
  );
}