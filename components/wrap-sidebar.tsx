import { redirect } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { createClient } from "@/utils/supabase/server";


export default async  function WrapSidebar() {
    const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user) {
    redirect('/login')
  } 
 
    return (
        <>
        <AppSidebar variant="inset"  user={data.user}/>
       
        </>
)
}


        

