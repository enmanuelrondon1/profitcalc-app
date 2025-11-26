//src/app/(routes)/projects/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Database } from "@/lib/supabase/database.types";
import { ProjectsView } from "./components/ProjectsView";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  type Project = Database["public"]["Tables"]["projects"]["Row"];

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="sticky z-40 border-b top-16 border-primary/10 bg-background/95 backdrop-blur-xl">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold sm:text-4xl text-foreground">
                Tus Proyectos
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-12">
        <ProjectsView user={user} initialProjects={projects || []} />
      </div>
    </div>
  );
}