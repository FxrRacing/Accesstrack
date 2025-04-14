'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signup(formData: FormData) {
    const supabase = await createClient()
  
    // type-casting here for convenience
    // in practice, you should validate your inputs

    
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
        data: {
          first_name: formData.get('firstName') as string,
          last_name: formData.get('lastName') as string,
        },
      },
    }
  
    const { error } = await supabase.auth.signUp(data)
  
    if (error) {
      console.error('Error signing up:', error)
      redirect('/error')
    }
  
    revalidatePath('/', 'layout')
    redirect('/')
  }