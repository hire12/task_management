import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const workspaces = await prisma.workspace.findMany();
  const projects = await prisma.project.findMany();
  const tasks = await prisma.task.findMany();
  const subtasks = await prisma.subtask.findMany();
  const projectDocs = await prisma.projectDoc.findMany();
  const activityLogs = await prisma.activityLog.findMany();

  const payload = {
    workspaces,
    projects,
    tasks,
    subtasks,
    projectDocs,
    activityLogs,
  };

  fs.writeFileSync("/tmp/local_db_export.json", JSON.stringify(payload, null, 2));
  console.log(`Successfully exported:`);
  console.log(`- ${workspaces.length} Workspaces`);
  console.log(`- ${projects.length} Projects (including Sada)`);
  console.log(`- ${tasks.length} Tasks`);
  console.log(`- ${subtasks.length} Subtasks`);
  console.log(`- ${projectDocs.length} Docs`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
