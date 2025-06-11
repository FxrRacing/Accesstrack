import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('Auth callback received:', {
    origin,
    code: code ? 'present' : 'missing',
    next,
    url: request.url
  })

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Always redirect to the production URL in production
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.redirect('https://fxr-access-track.vercel.app' + next)
      }
      
      // In development, use the origin
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    console.error('Error exchanging code for session:', error)
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}