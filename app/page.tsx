import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";



export default async function Home() {
  
  
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user) {
    redirect('/login')
  }else{
    redirect('/dashboard')
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold">Welcome to the Atrack</h1>
      <div className="flex flex-row gap-4">
        <Link href="/dashboard/users" className="text-blue-500 hover:underline" prefetch={true}>🚀 Users</Link>
        <Link href="/dashboard/software" className="text-blue-500 hover:underline" prefetch={true}>🚀 Software</Link>
        <Link href="/dashboard/shared-accounts" className="text-blue-500 hover:underline" prefetch={true}>🚀 Shared Accounts</Link>
        <Link href="/dashboard/keys&codes" className="text-blue-500 hover:underline" prefetch={true}>🚀 Keys and Codes</Link>
      </div>

     
    </div>
  );
}
