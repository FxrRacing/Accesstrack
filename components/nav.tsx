import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Nav() {
    const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  console.log('User data:', data)
  if (error || !data?.user) {
    redirect('/login')
  }

    return (
        <nav className="flex flex-row items-center gap-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <ul className="flex flex-row gap-4">
            <li className="text-base font-bold">
                <Link href="/dashboard">Home</Link>
            </li>
            <li>
                <Link href="/dashboard/software">Software</Link>
            </li>
            <li>
                <Link href="/dashboard/shared-accounts">Shared Accounts</Link>
            </li>
            <li>
                <Link href="/dashboard/keys&codes">Keys and Codes</Link>
            </li>
            <li>
                <Link href="/dashboard/users">Users</Link>
            </li>
            <li>
                <p>Logged in as : {data.user.email}</p>
            </li>
            </ul>
        </nav>
    );
}