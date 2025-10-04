import type { Metadata } from "next";
import "./globals.css";
import { getWorkspaces, getProjects } from "@/app/actions/projects";
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
  const workspaces = await getWorkspaces();
  const defaultWorkspace = workspaces[0];
  const allProjects = await getProjects(defaultWorkspace?.id);

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
          workspaceId={defaultWorkspace?.id || ""}
          projects={allProjects.map((p) => ({
            id: p.id,
            title: p.title,
            parentId: p.parentId,
          }))}
        >
          {children}
        </Shell>
      </body>
    </html>
  );
}
