//src/components/layout/Header.tsx
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { getUserRole } from "@/lib/adminUtils";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Obtener el rol del usuario si está autenticado
  let userRole: "user" | "admin" | "moderator" = "user";
  if (user) {
    try {
      userRole = await getUserRole(user.id);
    } catch (error) {
      console.error("Error obteniendo rol del usuario:", error);
    }
  }

  return <Navbar user={user} userRole={userRole} />;
}