// Permission Types
export type PermissionType =| "view"| "create"| "edit"| "delete"| "approve"| "revoke"| "grant"

// Role Types
export type Role =
  | "management"
  | "sales"
  | "marketing"
  | "engineering"
  | "it"
  | "hr"
  | "accounting"
  | "admin"
  | "editor"
  | "viewer"
  | "support"
  | "other"
  | "super_admin"

// Permission Map Type
export type PermissionsByRole = Record<Role, (PermissionType | "*")[]>

// Props Type for PermissionsProvider
export interface PermissionsProviderProps {
  children: React.ReactNode
  requiredPermission: PermissionType
  replaceWith?: React.ReactNode
  placeholder?: React.ReactNode
} 