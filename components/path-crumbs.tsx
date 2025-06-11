"use client"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Loader2 } from "lucide-react";

// Helper to fetch display name for a given segment (id)
async function fetchDisplayName(segment: string, parent: string | null) {
  // Example: if parent is 'software', fetch software name by id
  // You can expand this logic for other entities
  if (parent === "software") {
    const res = await fetch(`/api/software/${segment}/name`);
    if (res.ok) {
      const data = await res.json();
      return data.name || segment;
    }
  }
  if (parent === "users" || parent === "user") {
    const res = await fetch(`/api/users/${segment}/name`);
    if (res.ok) {
      const data = await res.json();
      return data.name || segment;
    }

  }
  if (parent === "shared-accounts") {
    const res = await fetch(`/api/shared-accounts/${segment}/name`);
    if (res.ok) {
      const data = await res.json();
      return data.name || segment;
    }
  }
  if (parent === "locations") {
    const res = await fetch(`/api/locations/${segment}/name`);
    if (res.ok) {
      const data = await res.json();
      return data.name || segment;
    }
  }
  if (parent === "departments") {
    const res = await fetch(`/api/departments/${segment}/name`);
    if (res.ok) {
      const data = await res.json();
      return data.name || segment;
    }
  }
  if (parent === "staff") {
    const res = await fetch(`/api/staff/${segment}/name`);
    if (res.ok) {
      const data = await res.json();
      return data.name || segment;
    }
  }
  // fallback
  return segment;
}

export default function PathCrumbs() {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter(Boolean);
  const [displayNames, setDisplayNames] = useState<(string | null)[]>(pathnames.map(() => null));

  useEffect(() => {
    let ignore = false;
    async function resolveNames() {
      const names = await Promise.all(
        pathnames.map(async (segment, idx) => {
          // If the segment is likely an id (uuid or number), try to fetch its display name
          const prev = pathnames[idx - 1] || null;
          if (/^[0-9a-fA-F-]{16,}$/.test(segment)) {
            return await fetchDisplayName(segment, prev);
          }
          // Otherwise, just use the segment
          return segment.charAt(0).toUpperCase() + segment.slice(1);
        })
      );
      if (!ignore) setDisplayNames(names);
    }
    resolveNames();
    return () => { ignore = true; };
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.map((segment, idx) => {
          const href = '/' + pathnames.slice(0, idx + 1).join('/');
          const isLast = idx === pathnames.length - 1;
          const name = displayNames[idx];
          return (
            <>
              <BreadcrumbSeparator key={`sep-${idx}`} />
              <BreadcrumbItem key={href}>
                {isLast ? (
                  <BreadcrumbPage>
                    {name === null ? <Loader2 className="inline h-4 w-4 animate-spin" /> : name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>
                    {name === null ? <Loader2 className="inline h-4 w-4 animate-spin" /> : name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}