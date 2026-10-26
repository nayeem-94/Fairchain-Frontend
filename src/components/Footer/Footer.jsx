import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin } from 'lucide-react'

export const CONTACT_EMAIL = 'contact@fairchainbd.example' // TODO: replace with your real email

const columns = [
  {
    title: 'Platform',
    links: [
      { name: 'How it works', to: '/home#how-it-works' },
      { name: 'Features', to: '/home#features' },
      { name: 'About', to: '/home#about' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'FAQ', to: '/faq' },
      { name: 'Contact us', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy policy', to: '/privacy' },
      { name: 'Terms of use', to: '/terms' },
    ],
  },
]

const linkClass =
  'rounded text-sm text-slate-600 transition hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-slate-50 ">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-14 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link to="/home" className="inline-flex items-center gap-3" aria-label="FairChain BD Home">
              <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-700 shadow-lg shadow-emerald-600/25">
                <svg viewBox="0 0 44 44" fill="none" className="h-7 w-7" aria-hidden="true">
                  <path d="M10 13.5L22 7L34 13.5V28L22 35L10 28V13.5Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M10.5 14L22 20.5L33.5 14M22 20.5V34" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
                  <circle cx="22" cy="20.5" r="3.2" fill="#A7F3D0" />
                </svg>
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                FairChain<span className="text-emerald-600"> BD</span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              An AI-powered platform that brings transparency to the supply chain of essential goods in Bangladesh.
            </p>

            <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-emerald-600" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-emerald-700">{CONTACT_EMAIL}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={16} className="text-emerald-600" />
                Bangladesh
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="text-sm font-bold text-slate-900">{col.title}</h2>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.name}>
                      <Link to={l.to} className={linkClass}>{l.name}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="text-sm font-bold text-slate-900">Get started</h2>
              <ul className="mt-4 space-y-3">
                <li><Link to="/login" className={linkClass}>Log in</Link></li>
                <li>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                  >
                    Create account <ArrowUpRight size={14} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FairChain BD. All rights reserved.</p>
          <p>Building a more transparent supply chain in Bangladesh.</p>
        </div>
      </div>
    </footer>
  )
}