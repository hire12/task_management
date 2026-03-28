export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export const PERMISSIONS = {
  // Workspace / Team management
  MANAGE_WORKSPACE: ["owner", "admin"],
  DELETE_WORKSPACE: ["owner"],
  MANAGE_MEMBERS: ["owner", "admin"],
  INVITE_MEMBERS: ["owner", "admin"],
  
  // Projects
  CREATE_PROJECT: ["owner", "admin", "member"],
  EDIT_PROJECT: ["owner", "admin", "member"],
  DELETE_PROJECT: ["owner", "admin"],
  SHARE_PROJECT: ["owner", "admin"],
  
  // Tasks & Board
  CREATE_TASK: ["owner", "admin", "member"],
  EDIT_TASK: ["owner", "admin", "member"],
  MOVE_TASK: ["owner", "admin", "member"],
  DELETE_TASK: ["owner", "admin", "member"],
  UPLOAD_ATTACHMENT: ["owner", "admin", "member"],
  
  // Read Only
  VIEW_BOARD: ["owner", "admin", "member", "viewer"],
  VIEW_SPECS: ["owner", "admin", "member", "viewer"],
  VIEW_ATTACHMENTS: ["owner", "admin", "member", "viewer"],
};

export function hasPermission(role: WorkspaceRole, permissionKey: keyof typeof PERMISSIONS): boolean {
  const allowedRoles = PERMISSIONS[permissionKey];
  return allowedRoles.includes(role);
}

export function isViewer(role: WorkspaceRole): boolean {
  return role === "viewer";
}
