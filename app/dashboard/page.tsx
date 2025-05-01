import { Suspense } from "react";
import { UsersStats, SharedAccountsStats, SoftwareStats } from "./stats";

export default function Page(){
    return (
        <>
          
            

            <main className="flex-1 ">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Overview</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
           <Suspense fallback={<div>Loading User Stats ...</div>}>
           <UsersStats />
           </Suspense>
           <Suspense fallback={<div>Loading Shared Accounts Stats ...</div>}>
           <SharedAccountsStats />
           </Suspense>
           <Suspense fallback={<div>Loading Software Stats ...</div>}>
            <SoftwareStats />
           </Suspense>
          </div>
          </div>
          </main>
        </>
    );
}


