//src/app/(routes)/login/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/projects");
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 pt-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center"></div>
        <LoginForm />
      </div>
    </div>
  );
}
