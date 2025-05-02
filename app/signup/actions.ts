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
  if (process.env.NODE_ENV !== "production") {
    const supabase = await createClient()
    const {data, error} = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
       scopes: 'email profile',
       redirectTo: 'http://localhost:3000/auth/callback',
      }
    })
    if (data.url) {
      redirect(data.url) // use the redirect API for your server framework
    }
    if (error) {
      console.error('Error signing in with Azure:', error)
      redirect('/error')
    }
  }
  console.log("this should not be happening")
  const {data, error} = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
     scopes: 'email profile',
     redirectTo: 'http://localhost:3000/auth/callback',
    }
  })

  console.log(data)
  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }

  if(error){
    console.error('Error signing in with Azure:', error)
    redirect('/error')
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}