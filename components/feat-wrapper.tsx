// 'use client';

// import { useState, useEffect, Suspense } from 'react';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { useDevToolsStore } from '@/lib/devtoolsStore';
// import { mockService } from '@/lib/mockService';



// export default function DevToolbar() {
//   const [open, setOpen] = useState(false);
//   const pathname = usePathname();
//   const params = useSearchParams();
  
//   const {
//     showJsonDump,
//     showIds,
//     mockMode,
//     showRouteInfo,
//     userRole,
//     toggle,
//     setRole,
//   } = useDevToolsStore();

//   useEffect(() => {
//     if (mockMode) {
//       // Enable mock API layer
//       mockService.startMocking();
//     }
//   }, [mockMode]);

//   if (process.env.NODE_ENV !== 'development') return null;

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//     <div className="fixed bottom-4 right-4 z-[9999]">
//       {open ? (
//         <div className="bg-white border shadow-lg rounded-lg w-80 p-4 text-sm space-y-3">
//           <div className="flex justify-between items-center">
//             <strong>DevTools</strong>
//             <button onClick={() => setOpen(false)}>✕</button>
//           </div>

//           <Toggle label="Show JSON Dump" value={showJsonDump} onClick={() => toggle('showJsonDump')} />
//           <Toggle label="Show IDs" value={showIds} onClick={() => toggle('showIds')} />
//           <Toggle label="Mock Mode" value={mockMode} onClick={() => toggle('mockMode')} />
//           <Toggle label="Show Route Info" value={showRouteInfo} onClick={() => toggle('showRouteInfo')} />

//           <div className="mt-2">
//             <label className="block text-xs font-semibold">Simulate User Role:</label>
//             <select
//               className="w-full border rounded px-2 py-1 mt-1"
//               value={userRole}
//               onChange={(e) => setRole(e.target.value as 'guest' | 'user' | 'admin')}
//             >
//               <option value="guest">Guest</option>
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>

//           <div className="text-right">
//             <button
//               className="bg-gray-200 text-xs px-2 py-1 rounded"
//               onClick={() => window.location.reload()}
//             >
//               Reload Page
//             </button>
//           </div>
//         </div>
//       ) : (
//         <button
//           onClick={() => setOpen(true)}
//           className="bg-black text-white px-3 py-1 rounded-full shadow-md"
//         >
//           🛠️ Dev
//         </button>
//       )}

//       {showRouteInfo && (
//         <div className="bg-black text-white text-xs mt-2 p-2 rounded">
//           <strong>Path:</strong> {pathname} <br />
//           <strong>Params:</strong> {params.toString()}
//         </div>
//       )}
//     </div>
//     </Suspense>
//   );
// }

// function Toggle({ label, value, onClick }: { label: string; value: boolean; onClick: () => void }) {
//   return (
//     <label className="flex justify-between items-center">
//       <span>{label}</span>
//       <input type="checkbox" checked={value} onChange={onClick} />
//     </label>
//   );
// }
