import { Suspense } from "react";
import { UsersStats, SharedAccountsStats, SoftwareStats, OnboardingSoon, OffboardingSoon } from "./stats";

export default function Page() {
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
        <div className="flex flex-row gap-4">
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6">Onboarding Soon</h2>
                <Suspense fallback={<div>Loading Onboarding Soon ...</div>}>
                    <OnboardingSoon />
                </Suspense>
            </div>
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6">Offboarding Soon</h2>
                <Suspense fallback={<div>Loading Offboarding Soon ...</div>}>
                    <OffboardingSoon />
                </Suspense>
            </div>
        </div>
         
       
      </main>
    </>
  );
}
