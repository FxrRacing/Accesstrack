import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type GradientCardProps = {
  title: string
  description: string
  badge: string
  icon: React.ReactNode
  children?: React.ReactNode // for button/form area
  gradientFrom?: string
  gradientTo?: string
  className?: string
}

export function GradientCard({
  title,
  description,
  badge,
  icon,
  children,
  gradientFrom = "from-blue-600",
  gradientTo = "to-indigo-700",
  className,
}: GradientCardProps) {
  return (
    <Card className={cn("overflow-hidden border-0 bg-gradient-to-br", gradientFrom, gradientTo, className)}>
      <div className="relative">
        <div className="absolute top-4 right-4 text-white/10">
          {icon}
        </div>
        <CardContent className="relative z-10 p-6 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">{badge}</Badge>
          </div>
          <CardTitle className="text-2xl font-bold mb-1 text-white">{title}</CardTitle>
          <CardDescription className="text-white/90 mb-4 text-sm">
            {description}
          </CardDescription>
          {children && <div className="mt-auto">{children}</div>}
        </CardContent>
      </div>
    </Card>
  )
}
