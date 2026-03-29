import { FullTask } from "@/lib/types";

export function exportTasksToCSV(tasks: FullTask[], filename = "tasks-export.csv") {
  const headers = [
    "ID",
    "Title",
    "Status",
    "Priority",
    "DueDate",
    "EstimatedMinutes",
    "AttachmentsCount",
    "CreatedAt",
  ];

  const rows = tasks.map((t) => [
    t.id,
    `"${(t.title || "").replace(/"/g, '""')}"`,
    t.status,
    t.priority,
    t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : "",
    t.duration || "",
    t.attachments?.length || 0,
    new Date(t.createdAt).toISOString(),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportTasksToJSON(tasks: FullTask[], filename = "tasks-export.json") {
  const data = JSON.stringify(tasks, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
