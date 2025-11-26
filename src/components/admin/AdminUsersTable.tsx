//src/components/admin/AdminUserTable.tsx

"use client";

import { useState } from "react";
import { getUserProjects, deleteUserProjects, changeUserRole } from "@/app/(routes)/admin/actions";
import { AdminProjectsModal } from "./AdminProjectsModal";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, AlertCircle, Copy, Check, Crown, Shield, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Project } from "@/lib/types";

interface AdminUser {
  user_id: string;
  email: string | null;
  created_at: string | null;
  role: "user" | "admin" | "moderator";
}

interface AdminUsersTableProps {
  users: AdminUser[];
}

export function AdminUsersTable({ users: initialUsers }: AdminUsersTableProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyingEmail, setCopyingEmail] = useState<string | null>(null);

  const handleCopy = (text: string, type: "id" | "email", userId: string) => {
    navigator.clipboard.writeText(text);
    if (type === "id") {
      setCopiedId(userId);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopyingEmail(userId);
      setTimeout(() => setCopyingEmail(null), 2000);
    }
    toast.success(`${type === "id" ? "ID" : "Email"} copiado`);
  };

  const handleChangeRole = async (userId: string, newRole: "user" | "admin" | "moderator") => {
    try {
      setLoading(true);
      await changeUserRole(userId, newRole);
      
      // Actualizar el estado local en lugar de recargar la página
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userId 
            ? { ...user, role: newRole }
            : user
        )
      );
      
      toast.success("Rol actualizado");
    } catch (error) {
      toast.error("Error al cambiar el rol");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProjects = async (user: AdminUser) => {
    try {
      setLoading(true);
      const data = await getUserProjects(user.user_id);
      setProjects(data as Project[]);
      setSelectedUser(user);
      setShowProjectsModal(true);
    } catch (error) {
      toast.error("Error al cargar proyectos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    try {
      setLoading(true);
      await deleteUserProjects(user.user_id);
      
      // Actualizar el estado local en lugar de recargar la página
      setUsers(prevUsers => prevUsers.filter(u => u.user_id !== user.user_id));
      
      toast.success("Usuario y sus proyectos eliminados");
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Error al eliminar usuario");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (user: AdminUser) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case "admin":
        return { icon: Crown, label: "Administrador", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" };
      case "moderator":
        return { icon: Shield, label: "Moderador", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" };
      default:
        return { icon: User, label: "Usuario", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-900/30" };
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Grid responsivo de usuarios */}
        <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2">
          {users.map((user) => {
            const roleConfig = getRoleConfig(user.role);
            const RoleIcon = roleConfig.icon;

            return (
              <div key={user.user_id} className="p-5 card-premium hover-lift">
                {/* Header con rol */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {/* Email */}
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-semibold text-foreground">
                        {user.email || "Sin email"}
                      </p>
                      <button
                        onClick={() => handleCopy(user.email || "", "email", user.user_id)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Copiar email"
                      >
                        {copyingEmail === user.user_id ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        )}
                      </button>
                    </div>

                    {/* User ID */}
                    <div className="flex items-center gap-2 mb-3">
                      <code className="font-mono text-xs text-muted-foreground">
                        {user.user_id.substring(0, 16)}...
                      </code>
                      <button
                        onClick={() => handleCopy(user.user_id, "id", user.user_id)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Copiar ID completo"
                      >
                        {copiedId === user.user_id ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Badge del rol */}
                  <div className={`${roleConfig.bg} rounded-full p-2`}>
                    <RoleIcon className={`${roleConfig.color} w-5 h-5`} />
                  </div>
                </div>

                {/* Selector de rol */}
                <div className="pb-4 mb-4 border-b border-border/50">
                  <label className="block mb-2 text-xs font-semibold text-muted-foreground">
                    Cambiar rol
                  </label>
                  <Select value={user.role} onValueChange={(value) => handleChangeRole(user.user_id, value as "user" | "admin" | "moderator")} disabled={loading}>
                    <SelectTrigger className="w-full text-sm h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuario</SelectItem>
                      <SelectItem value="moderator">Moderador</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fecha de registro */}
                <p className="mb-4 text-xs text-muted-foreground">
                  Registrado:{" "}
                  <span className="font-medium text-foreground">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString("es-ES") : "N/A"}
                  </span>
                </p>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProjects(user)}
                    disabled={loading}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Proyectos
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(user)}
                    disabled={loading}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de proyectos */}
      {selectedUser && (
        <AdminProjectsModal
          user={{
            user_id: selectedUser.user_id,
            created_at: selectedUser.created_at || new Date().toISOString(),
          }}
          projects={projects}
          open={showProjectsModal}
          onOpenChange={setShowProjectsModal}
        />
      )}

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              ¿Eliminar usuario?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará a <strong>{userToDelete?.email}</strong> y <strong>TODOS sus proyectos y costos</strong> de forma permanente.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-3 text-sm border rounded-lg bg-destructive/10 border-destructive/30 text-destructive">
            <strong>Email:</strong> {userToDelete?.email || "Sin email"}
            <br />
            <strong>Rol:</strong> {getRoleConfig(userToDelete?.role || "user").label}
          </div>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar usuario
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}