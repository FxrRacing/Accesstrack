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




export async function signinWithAzure(){
  const supabase = await createClient()
  
  // Determine the redirect URL based on environment
  const redirectUrl = 'https://fxr-access-track.vercel.app/auth/callback'

  //console.log("Using redirect URL:", redirectUrl)
  
  const {data, error} = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email profile',
      redirectTo: redirectUrl,
    }
  })

  if (error) {
    console.error('Error signing in with Azure:', error)
    redirect('/error')
  }

  if (data?.url) {
    //console.log("Redirecting to:", data.url)
    redirect(data.url)
  }

  // If we get here, something went wrong
  console.error('No redirect URL received from Azure OAuth')
  redirect('/error')
}