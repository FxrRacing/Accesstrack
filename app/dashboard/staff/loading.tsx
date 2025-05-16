import { Skeleton } from "@/components/ui/skeleton"
export function GradientCardSkeleton() {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[250px] w-[700px] rounded-xl" />
      </div>
    )
  }
  export function DataTableSkeleton() {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    )
  }
  
  
  export default function Loading() {
      return (
          <>
          <main className="flex-1 ">
          <div className="container mx-auto px-4 py-8">
              <h2 className="text-3xl font-bold mb-6">Staff</h2>
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <GradientCardSkeleton />
                <GradientCardSkeleton />
              </div>
              <DataTableSkeleton />
          </div>
          </main>
          </>
      )
  }