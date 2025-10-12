import {
  Project,
  Task,
  Subtask,
  Workspace,
  ProjectDoc,
  ActivityLog,
  TemporalHorizon,
  ProjectStatus,
  TaskStatus,
  PriorityLevel,
  TaskAttachment,
} from "@prisma/client";

export type {
  Project,
  Task,
  Subtask,
  TaskAttachment,
  Workspace,
  ProjectDoc,
  ActivityLog,
  TemporalHorizon,
  ProjectStatus,
  TaskStatus,
  PriorityLevel,
};

export type FullProject = Project & {
  workspace?: Workspace;
  parent?: Project | null;
  subProjects?: (Project & {
    tasks?: Task[];
    _count?: { tasks: number; subProjects: number };
  })[];
  tasks?: (Task & {
    subtasks?: Subtask[];
    attachments?: TaskAttachment[];
  })[];
  docs?: ProjectDoc[];
  activityLogs?: ActivityLog[];
  _count?: {
    tasks: number;
    subProjects: number;
  };
};

export type FullTask = Task & {
  project?: Project;
  subtasks?: Subtask[];
  attachments?: TaskAttachment[];
};
