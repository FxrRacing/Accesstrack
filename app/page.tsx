

export default function Home() {
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold">Welcome to the Atrack</h1>
      <div className="flex flex-row gap-4">
        <a href="/users" className="text-blue-500 hover:underline">🚀 Users</a>
        <a href="/software" className="text-blue-500 hover:underline">🚀 Software</a>
        <a href="/shared-accounts" className="text-blue-500 hover:underline">🚀 Shared Accounts</a>
        <a href="/keys&codes" className="text-blue-500 hover:underline">🚀 Keys and Codes</a>
      </div>

     
    </div>
  );
}
