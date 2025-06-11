import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {  Suspense } from "react";
import { SkeletonCard } from "@/components/skeleton-card";
import {  Role, PermissionsByRole, PermissionsProviderProps } from '@/types/permissions'



// 1) Enumerate our known permission keys for type safety


// 3) Central map: for each role, list the allowed permission keys.
//    A '*' means "everything" — used here only for super_admin.
export const permissionsByRole: PermissionsByRole = {
  super_admin: ["*"],

  admin:       ["view", "create", "edit", "delete", "revoke", "grant"],
  editor:      ["view", "create", "edit"],
  viewer:      ["view"],

  management:  ["view", "approve"],
  sales:       ["view", "create"],
  marketing:   ["view", "create"],
  engineering: ["view", "edit"],
  it:          ["view", "edit", "create"],
  hr:          ["view"],
  accounting:  ["view"],
  support:     ["view", "edit"],

  other:       [],   // no permissions by default
};


  
export default async function PermissionsProvider({
  children,
  requiredPermission,
  replaceWith = null,
  placeholder = <SkeletonCard />,
}: PermissionsProviderProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // 1) Redirect to login if not authenticated
  if (error || !data?.user) {
    redirect("/login");
  }

  // 2) Grab the role out of your metadata
  const userRole = data.user.user_metadata.role as Role;

  // 3) Lookup allowed actions for that role
  const allowed = permissionsByRole[userRole] || [];

  // 4) Check for wildcard or specific permission
  const hasPermission =
    allowed.includes("*") || allowed.includes(requiredPermission);

  // 5) If they don't have it, show either:
  //    • the custom replaceWith, or
  //    • a "disabled" version of the real children
  
  if (!hasPermission) {
    if (replaceWith) {
      return <>{replaceWith}</>;
    }
    // default "disabled" wrapper
    return (
      <div
        aria-disabled="true"
        style={{
          opacity: 0.5,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {children}
      </div>
    );
  }

  // 6) Otherwise wrap in Suspense so your async children can stream in—
  //    using placeholder as the fallback
  return <Suspense fallback={placeholder}>{children}</Suspense>;
}