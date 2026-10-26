import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { AuthLayout, Field, PasswordField, SubmitButton } from '../Authprovider/Authprovider.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: call your login API here with { email, password }
    alert('Login API এখনো connect করা হয়নি।')
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue monitoring essential goods across Bangladesh."
      panelTitle="Clear records. Fair prices. One platform."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-emerald-700 hover:underline">
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          id="email"
          label="Email address"
          icon={Mail}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <PasswordField
          id="password"
          label="Password"
          icon={Lock}
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
          />
          Keep me signed in
        </label>

        <SubmitButton>
          Sign in <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
        </SubmitButton>
      </form>
    </AuthLayout>
  )
}