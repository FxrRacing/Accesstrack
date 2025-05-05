'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error logging out:', error)
    redirect('/error')
  }
  revalidatePath('/', 'layout')
  redirect('/')
}


export async function login(prevState: {message: string, success: boolean}, formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  if (typeof data.email !== 'string' || data.email.trim() === '') {
    return { message: 'Email is required', success: false }
  }
  if (typeof data.password !== 'string' || data.password.trim() === '') {
    return { message: 'Password is required', success: false }
  }

  try {
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) {
      console.error('Error logging in:', error)
      return { message: 'Incorrect email address and/or password. Try again or contact support if you need help.', success: false }
    }revalidatePath('/', 'layout')
    redirect('/dashboard/')
    return { message: 'Logged in', success: true }
  } catch (error) {
    console.error('Error logging in:', error)
    return { message: 'Error logging in, please try again or contact support if you need help.', success: false }
  }

  

  
}


export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Error signing up:', error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard/')
}



