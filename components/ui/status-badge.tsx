import { Badge } from "@/components/ui/badge"
import { StatusTypes } from "@/types/types";
import clsx from "clsx"

type EmploymentStatus = "active" | "inactive" | "onboarding" | "terminated"

const statusStyles: Record<EmploymentStatus, { text: string; textColor: string; bgColor: string; dotColor: string }> = {
  active: {
    text: "Active",
    textColor: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-600/10 dark:bg-green-400/10",
    dotColor: "bg-green-600 dark:bg-green-400",
  },
  inactive: {
    text: "Inactive",
    textColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-600/10 dark:bg-red-400/10",
    dotColor: "bg-red-600 dark:bg-red-400",
  },
  onboarding: {
    text: "Onboarding",
    textColor: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-600/10 dark:bg-yellow-400/10",
    dotColor: "bg-yellow-600 dark:bg-yellow-400",
  },
  terminated: {
    text: "Terminated",
    textColor: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-600/10 dark:bg-gray-400/10",
    dotColor: "bg-gray-600 dark:bg-gray-400",
  },
}

export function StatusBadge({ status }: { status: StatusTypes }) {
  const style = statusStyles[status as StatusTypes]
  if (!style) {
    return <Badge className="rounded-full bg-muted text-muted-foreground border-none">
        <span className="size-1.5 rounded-full bg-muted-foreground mr-2" aria-hidden="true" />
        {status}
      </Badge>
  }

  return (
    <Badge
      className={clsx(
        "rounded-full border-none focus-visible:outline-none focus-visible:ring-1",
        style.bgColor,
        style.textColor
      )}
    >
      <span className={clsx("size-1.5 rounded-full mr-2", style.dotColor)} aria-hidden="true" />
      {style.text}
    </Badge>
  )
}
