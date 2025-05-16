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
        <Skeleton className="h-[800px] w-full rounded-xl" />
      </div>
    )
  }
  
  
  export default function Loading() {
      return (
          <>
          <main className="flex-1 ">
          <div className="container mx-auto px-4 py-8">
              
              <DataTableSkeleton />
          </div>
          </main>
          </>
      )
  }