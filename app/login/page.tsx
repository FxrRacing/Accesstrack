import { login, signup } from './actions'
import { LoginForm } from './form'
import { GalleryVerticalEnd } from "lucide-react"


//collect first name, last name, email, password, phone number

export default function LoginPage() {
  return (
    <>
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Access Track
        </a>
        <LoginForm />
      </div>
    </div>
    
    <form className='flex flex-col gap-4 w-auto bg-slate-400' method="post">
      <h1 className="text-2xl font-bold">Login</h1>
      <label htmlFor="firstName">First Name:</label>
      <input id="firstName" name="firstName" type="text" required />
      <label htmlFor="lastName">Last Name:</label>
      <input id="lastName" name="lastName" type="text" required />
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="phone">Phone:</label>
      <input id="phone" name="phone" type="tel" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <br />
      <button formAction={signup}>Sign up</button>
    </form>
    </>
  )
}