import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Package, Factory, Truck, Boxes, Store, ShieldCheck, TrendingUp, MapPin } from 'lucide-react'

const chain = [Package, Factory, Truck, Boxes, Store]

const points = [
  { icon: ShieldCheck, text: 'Trace essential goods from importer to retailer' },
  { icon: TrendingUp, text: 'AI price forecasts and unusual-price alerts' },
  { icon: MapPin, text: 'Monitoring across all 64 districts' },
]

function Logo({ light = false, large = false }) {
  return (
    <Link
      to="/home"
      className="group inline-flex items-center gap-3.5 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      aria-label="FairChain BD Home"
    >
      <span className="relative">
        {light && <span className="absolute -inset-2 rounded-3xl bg-emerald-400/30 blur-xl" aria-hidden="true" />}
        <span
          className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-emerald-500 to-teal-700 ring-1 ring-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_24px_-8px_rgba(5,150,105,0.7)] transition duration-300 group-hover:-rotate-3 group-hover:scale-105 ${
            large ? 'h-14 w-14' : 'h-11 w-11'
          }`}
        >
          <svg viewBox="0 0 44 44" fill="none" className={large ? 'h-10 w-10' : 'h-8 w-8'} aria-hidden="true">
            <path d="M22 6.5L35.5 14.25V29.75L22 37.5L8.5 29.75V14.25L22 6.5Z" fill="white" fillOpacity="0.14" stroke="white" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M22 6.5L35.5 14.25L22 22L8.5 14.25L22 6.5Z" fill="white" fillOpacity="0.28" />
            <path d="M8.9 14.5L22 22L35.1 14.5M22 22V37" stroke="white" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="22" cy="22" r="3.6" fill="#A7F3D0" stroke="white" strokeWidth="1.5" />
            <circle cx="22" cy="6.5" r="1.9" fill="white" />
            <circle cx="35.5" cy="29.75" r="1.9" fill="white" />
            <circle cx="8.5" cy="29.75" r="1.9" fill="white" />
          </svg>
        </span>
      </span>

      <span className="flex flex-col">
        <span className="flex items-center gap-2">
          <span className={`font-extrabold leading-none tracking-tight ${large ? 'text-2xl' : 'text-xl'} ${light ? 'text-white' : 'text-slate-900'}`}>
            FairChain
          </span>
          <span
            className={`rounded-md px-1.5 py-1 text-[11px] font-bold leading-none ${
              light ? 'bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/30' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            BD
          </span>
        </span>
        <span className={`mt-1.5 text-xs font-medium ${light ? 'text-emerald-200/70' : 'text-slate-500'}`}>
          Transparent supply chain
        </span>
      </span>
    </Link>
  )
}

export function AuthLayout({ title, subtitle, panelTitle, children, footer }) {
  return (
    <main className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-[1fr_1.05fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-emerald-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.08) 1px, transparent 0)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-teal-400/15 blur-3xl" />

        <div className="relative"><Logo light large /></div>

        <div className="relative max-w-md">
          <div className="flex items-center">
            {chain.map((Icon, i) => (
              <div key={i} className="flex items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-200 backdrop-blur">
                  <Icon size={21} />
                </span>
                {i < chain.length - 1 && <span className="h-px w-5 bg-gradient-to-r from-emerald-300/60 to-emerald-300/20" />}
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-3xl font-extrabold leading-tight tracking-tight">{panelTitle}</h2>

          <ul className="mt-8 space-y-4">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-emerald-50/90">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                  <Icon size={16} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-emerald-200/60">Building a more transparent supply chain in Bangladesh.</p>
      </aside>

      {/* Form panel */}
      <section className="relative flex items-center justify-center bg-slate-50 px-5 py-12 sm:px-8">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl lg:hidden" />
        <div className="relative w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-center text-sm text-slate-500">{footer}</p>
        </div>
      </section>
    </main>
  )
}

const wrapClass =
  'flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10'

export function Field({ id, label, icon: Icon, hint, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <div className={wrapClass}>
        <Icon size={18} className="shrink-0 text-slate-400" />
        <input id={id} className="w-full bg-transparent py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400" {...props} />
      </div>
      {hint}
    </div>
  )
}

export function PasswordField({ id, label, icon: Icon, hint, labelAside, ...props }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">{label}</label>
        {labelAside}
      </div>
      <div className={wrapClass}>
        <Icon size={18} className="shrink-0 text-slate-400" />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className="w-full bg-transparent py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="rounded-lg p-1.5 text-slate-400 transition hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint}
    </div>
  )
}

export function SubmitButton({ children }) {
  return (
    <button
      type="submit"
      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  )
}