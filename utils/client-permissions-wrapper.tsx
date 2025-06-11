'use client'

import { SkeletonCard } from "@/components/skeleton-card";
import { createClient } from "@/utils/supabase/client";
import { PermissionsByRole, PermissionsProviderProps, Role } from "@/types/permissions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function ClientPermissionsWrapper({
  children,
  requiredPermission,
  replaceWith = null,
  placeholder = <SkeletonCard />,
}: PermissionsProviderProps) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data?.user) {
        
        return;
      }
      const userRole = data.user.user_metadata.role as Role;
      const allowedPermissions = permissionsByRole[userRole] || [];
      // '*' means all permissions
      setAllowed(allowedPermissions.includes("*") || allowedPermissions.includes(requiredPermission));
    });
  }, [requiredPermission, router]);

  if (allowed === null) return placeholder;
  if (!allowed) return replaceWith;
  return <>{children}</>;
}