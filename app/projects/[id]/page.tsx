import { notFound } from "next/navigation";
import { getProjectById } from "@/app/actions/projects";
import { ProjectView } from "./ProjectView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return <ProjectView project={project as any} />;
}
