'use'
import { logout } from "@/app/login/actions";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ModeToggle } from "./theme-mode";

export default async function Nav() {
    const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
 
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
            <li>
                <form action={logout}>
                <button className="text-red-500" type="submit">Logout</button>
                </form>
              
            </li>
            <li>
               <ModeToggle />
            </li>
            </ul>
        </nav>
    );
}