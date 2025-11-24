//src/app/projects/new/page.tsx
import { ProjectForm } from "@/components/projects/ProjectForm";

export default function NewProjectPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-4 sm:p-24">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create a New Project</h1>
          <p className="mt-2 text-gray-600">Fill in the details to get started.</p>
        </div>
        <ProjectForm />
      </div>
    </main>
  );
}