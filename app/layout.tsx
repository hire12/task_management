import type { Metadata } from "next";
import "./globals.css";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserWorkspaces, ensurePersonalWorkspace } from "@/lib/workspace";
import { getProjects } from "@/app/actions/projects";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: "Orbit — Project & Future OS",
  description: "A modular, recursive workspace for current execution and future pipelines.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let activeWorkspaceId = "";
  let workspaceProjects: { id: string; title: string; parentId: string | null }[] = [];

  if (session?.user) {
    let workspaces = await getUserWorkspaces(session.user.id);
    if (workspaces.length === 0) {
      await ensurePersonalWorkspace(session.user.id, session.user.name || "Personal");
      workspaces = await getUserWorkspaces(session.user.id);
    }
    const defaultWorkspace = workspaces[0];
    activeWorkspaceId = defaultWorkspace?.id || "";
    if (activeWorkspaceId) {
      const allProjects = await getProjects(activeWorkspaceId);
      workspaceProjects = allProjects.map((p) => ({
        id: p.id,
        title: p.title,
        parentId: p.parentId,
      }));
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <Shell
          workspaceId={activeWorkspaceId}
          projects={workspaceProjects}
        >
          {children}
        </Shell>
      </body>
    </html>
  );
}
