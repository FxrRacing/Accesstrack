import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
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
<div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
          <Skeleton className="h-[50px] w-[50px] rounded-xl" />
            <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-6 w-[150px]" />
            
          </div>
          
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[100px] rounded-xl" />
            <Skeleton className="h-10 w-[100px] rounded-xl" />
            <Skeleton className="h-10 w-[100px] rounded-xl" />
           
          </div>
        </div>


        <main className="flex-1 ">
        <div className="container mx-auto px-4 py-8">
            
            <DataTableSkeleton />
        </div>
        </main>
        </>
    )
}