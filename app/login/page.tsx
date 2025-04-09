import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <form className='flex flex-col gap-4 w-auto bg-slate-400' method="post">
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <br />
      <button formAction={signup}>Sign up</button>
    </form>
  )
}