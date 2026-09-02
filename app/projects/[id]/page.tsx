import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserWorkspaces } from "@/lib/workspace";
import { getProjectById } from "@/app/actions/projects";
import { ProjectView } from "./ProjectView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/auth/sign-in?callbackUrl=/projects/${id}`);
  }

  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  // Verify user owns or is a member of this project's workspace
  const workspaces = await getUserWorkspaces(session.user.id);
  const hasAccess = workspaces.some((w) => w.id === project.workspaceId) || project.isPublic;

  if (!hasAccess) {
    notFound();
  }

  return <ProjectView project={project as any} />;
}
