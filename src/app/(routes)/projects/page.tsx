import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Database } from "@/lib/supabase/database.types";
import Link from "next/link";
import { MoreVertical, Plus, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const formatDate = (date: string | null) => {
    if (!date) return "Reciente";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

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
            <Button asChild className="transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30">
              <Link href="/projects/new" className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nuevo</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-12">
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {(projects as Project[]).map((project) => (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="group"
              >
                <div className="h-full overflow-hidden transition-all duration-300 border rounded-xl border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                  {/* Card Header with gradient */}
                  <div className="relative h-2 bg-gradient-to-r from-primary via-accent to-primary/50" />
                  
                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold truncate transition-colors text-foreground group-hover:text-primary">
                          {project.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {project.description || "Sin descripción"}
                        </p>
                      </div>
                      <button className="p-1 transition-colors rounded-lg opacity-0 hover:bg-muted group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {project.total_cost !== null && (
                        <div className="p-3 border rounded-lg bg-muted/50 border-border/50">
                          <p className="text-xs font-medium text-muted-foreground">
                            Costo Total
                          </p>
                          <p className="mt-1 text-sm font-semibold text-foreground">
                            ${project.total_cost?.toFixed(2)}
                          </p>
                        </div>
                      )}
                      {project.profit !== null && (
                        <div className={`rounded-lg p-3 border ${
                          project.profit >= 0
                            ? "bg-success/10 border-success/30"
                            : "bg-destructive/10 border-destructive/30"
                        }`}>
                          <p className="text-xs font-medium text-muted-foreground">
                            Ganancia
                          </p>
                          <p className={`mt-1 text-sm font-semibold ${
                            project.profit >= 0 ? "text-success" : "text-destructive"
                          }`}>
                            ${project.profit?.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(project.created_at)}
                      </div>
                      {project.profit && project.total_cost && (
                        <div className="flex items-center gap-1 text-xs font-medium">
                          <TrendingUp className="w-3 h-3 text-success" />
                          <span className="text-success">
                            {((project.profit / project.total_cost) * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              No tienes proyectos aún
            </h2>
            <p className="max-w-sm mb-6 text-muted-foreground">
              Crea tu primer proyecto para comenzar a calcular tus ganancias y analizar tus negocios.
            </p>
            <Button asChild className="bg-gradient-to-r from-primary to-primary/80">
              <Link href="/projects/new" className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Primer Proyecto
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}