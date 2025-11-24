//src/components/layout/Header.tsx
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <Navbar user={user} />;
}