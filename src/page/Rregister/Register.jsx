import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserRound, Mail, Lock, ArrowRight } from 'lucide-react'
import { AuthLayout, Field, PasswordField, SubmitButton } from '../Authprovider/Authprovider.jsx'


function strengthOf(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const levels = [
  { label: 'Too short', color: 'bg-slate-200', text: 'text-slate-500' },
  { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' },
  { label: 'Fair', color: 'bg-amber-400', text: 'text-amber-600' },
  { label: 'Good', color: 'bg-emerald-400', text: 'text-emerald-600' },
  { label: 'Strong', color: 'bg-emerald-600', text: 'text-emerald-700' },
]

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)

  const score = password.length < 8 ? 0 : strengthOf(password)
  const level = levels[score]

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: call your registration API here with { name, email, password }
    alert('Registration API এখনো connect করা হয়নি।')
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join FairChain BD and help bring transparency to essential goods."
      panelTitle="Join the effort to make prices easier to trust."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          id="name"
          label="Full name"
          icon={UserRound}
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />

        <Field
          id="register-email"
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
          id="register-password"
          label="Password"
          icon={Lock}
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          hint={
            <div className="mt-3" aria-live="polite">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((n) => (
                  <span
                    key={n}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      n <= score ? level.color : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className={`mt-2 text-xs font-medium ${password ? level.text : 'text-slate-400'}`}>
                {password ? level.label : 'Use 8+ characters with letters, numbers and symbols'}
              </p>
            </div>
          }
        />

        <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-6 text-slate-600">
          <input
            type="checkbox"
            required
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-emerald-600"
          />
          <span>
            I agree to the{' '}
            <Link to="/terms" className="font-semibold text-emerald-700 hover:underline">Terms of use</Link> and{' '}
            <Link to="/privacy" className="font-semibold text-emerald-700 hover:underline">Privacy policy</Link>.
          </span>
        </label>

        <SubmitButton>
          Create account <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
        </SubmitButton>
      </form>
    </AuthLayout>
  )
}