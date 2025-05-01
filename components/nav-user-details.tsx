import { createClient } from "@/utils/supabase/server"



export default async function NavUserDetails() {
    const supabase = await createClient()
    const user = await supabase.auth.getUser()

    return (
      
            <p>{user.data.user?.email}</p>
       
    )
}