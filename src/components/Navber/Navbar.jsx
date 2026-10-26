import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Menu, X, ArrowUpRight, ChevronRight } from 'lucide-react'

const navLinks = [
    { name: 'Home', href: '/home', section: 'home' },
    { name: 'How it works', href: '/home#how-it-works', section: 'how-it-works' },
    { name: 'Features', href: '/home#features', section: 'features' },
    { name: 'About', href: '/home#about', section: 'about' },
]

const sectionIds = navLinks.map((l) => l.section)

function BrandLogo({ onClick }) {
    return (
        <Link
            to="/home"
            onClick={onClick}
            className="group flex shrink-0 items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            aria-label="FairChain BD Home"
        >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-700 shadow-lg shadow-emerald-600/25 ring-1 ring-white/30 transition duration-300 group-hover:rotate-[-4deg] group-hover:scale-105">
                <svg viewBox="0 0 44 44" fill="none" className="h-7 w-7" aria-hidden="true">
                    <path
                        d="M10 13.5L22 7L34 13.5V28L22 35L10 28V13.5Z"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M10.5 14L22 20.5L33.5 14M22 20.5V34"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                    />
                    <circle cx="22" cy="20.5" r="3.2" fill="#A7F3D0" />
                    <circle cx="10.5" cy="14" r="2" fill="white" />
                    <circle cx="33.5" cy="14" r="2" fill="white" />
                </svg>
                <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-lime-300" />
            </span>

            <span className="flex flex-col leading-none">
                <span className="text-[18px] font-extrabold tracking-tight text-slate-900">
                    FairChain<span className="text-emerald-600"> BD</span>
                </span>
                <span className="mt-1 hidden text-[11px] font-medium text-slate-500 sm:block">
                    Transparent supply chain
                </span>
            </span>
        </Link>
    )
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [progress, setProgress] = useState(0)
    const [activeSection, setActiveSection] = useState('home')
    const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false })

    const location = useLocation()
    const navigate = useNavigate()
    const trackRef = useRef(null)
    const itemRefs = useRef({})

    const onHome = location.pathname === '/home'
    const closeMenu = () => setIsOpen(false)

    /* Smooth scroll to a section (or navigate to /home first) */
    const handleSectionClick = (event, item) => {
        event.preventDefault()
        closeMenu()

        if (!onHome) {
            navigate(item.href)
            return
        }

        if (item.section === 'home') {
            window.history.pushState(null, '', '/home')
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setActiveSection('home')
            return
        }

        const target = document.getElementById(item.section)
        if (target) {
            window.history.pushState(null, '', item.href)
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setActiveSection(item.section)
        } else {
            window.location.hash = item.section
        }
    }

    /* When arriving from another page with a #hash, scroll to it */
    useEffect(() => {
        if (!onHome || !location.hash) return
        const id = location.hash.slice(1)
        const timer = setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 80)
        return () => clearTimeout(timer)
    }, [location.pathname, location.hash, onHome])

    /* Scroll state: floating style, scroll-spy, progress bar */
    useEffect(() => {
        let frame = 0

        const update = () => {
            frame = 0
            setScrolled(window.scrollY > 12)

            const max = document.documentElement.scrollHeight - window.innerHeight
            setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0)

            // A section becomes active once its top passes 40% of the viewport
            const line = window.innerHeight * 0.4
            const found = sectionIds
                .map((id) => ({ id, el: document.getElementById(id) }))
                .filter((s) => s.el)

            let current = 'home'
            for (const s of found) {
                if (s.el.getBoundingClientRect().top <= line) current = s.id
            }

            // At the very bottom, short last sections (like About) never reach
            // the line, so activate the last section on the page instead
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
            if (atBottom && found.length > 1) current = found[found.length - 1].id

            setActiveSection(current)
        }

        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update)
        }

        update()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
            if (frame) cancelAnimationFrame(frame)
        }
    }, [location.pathname])

    /* Sliding indicator under the active link */
    useLayoutEffect(() => {
        const measure = () => {
            const el = itemRefs.current[activeSection]
            if (!onHome || !el) {
                setIndicator((prev) => ({ ...prev, visible: false }))
                return
            }
            setIndicator({ left: el.offsetLeft, width: el.offsetWidth, visible: true })
        }
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [activeSection, onHome, scrolled])

    /* Mobile menu: lock scroll, close on Escape / route change */
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        const onKey = (e) => e.key === 'Escape' && setIsOpen(false)
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKey)
        }
    }, [isOpen])

    useEffect(() => {
        setIsOpen(false)
    }, [location.pathname])

    const isActive = (item) => onHome && activeSection === item.section

    return (
        <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
            <div
                className={`mx-auto transition-all duration-500 ease-out ${
                    scrolled ? 'max-w-5xl' : 'max-w-7xl'
                }`}
            >
                <nav
                    aria-label="Main navigation"
                    className={`relative flex items-center justify-between gap-4 overflow-hidden border px-3 transition-all duration-500 sm:px-4 ${
                        scrolled
                            ? 'h-16 rounded-full border-white/60 bg-white/75 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.25)] backdrop-blur-xl'
                            : 'h-[72px] rounded-3xl border-transparent bg-transparent'
                    }`}
                >
                    <BrandLogo onClick={closeMenu} />

                    {/* Desktop links */}
                    <div
                        ref={trackRef}
                        className="relative hidden items-center rounded-full bg-slate-900/[0.04] p-1 ring-1 ring-slate-900/[0.05] md:flex"
                    >
                        <span
                            aria-hidden="true"
                            className="absolute bottom-1 top-1 rounded-full bg-white shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 ease-out motion-reduce:transition-none"
                            style={{
                                left: indicator.left,
                                width: indicator.width,
                                opacity: indicator.visible ? 1 : 0,
                            }}
                        />
                        {navLinks.map((item) => {
                            const active = isActive(item)
                            return (
                                <a
                                    key={item.name}
                                    ref={(el) => (itemRefs.current[item.section] = el)}
                                    href={item.href}
                                    onClick={(e) => handleSectionClick(e, item)}
                                    aria-current={active ? 'true' : undefined}
                                    className={`relative z-10 rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 lg:px-5 ${
                                        active
                                            ? 'text-emerald-700'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {item.name}
                                </a>
                            )
                        })}
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden items-center gap-1.5 md:flex">
                        <Link
                            to="/login"
                            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                                location.pathname === '/login'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-slate-700 hover:bg-slate-900/5'
                            }`}
                        >
                            Log in
                        </Link>

                        <Link
                            to="/register"
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-slate-900 py-2.5 pl-5 pr-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition duration-300 hover:bg-emerald-600 hover:shadow-emerald-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                        >
                            Get started
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-slate-900 transition duration-300 group-hover:bg-white group-hover:text-emerald-700">
                                <ArrowUpRight
                                    size={15}
                                    strokeWidth={2.5}
                                    className="transition-transform duration-300 group-hover:rotate-12"
                                />
                            </span>
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={isOpen}
                        aria-controls="mobile-navigation"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/5 text-slate-800 transition hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:hidden"
                    >
                        {isOpen ? <X size={21} /> : <Menu size={21} />}
                    </button>

                    {/* Reading progress */}
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-x-6 bottom-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-opacity duration-300 ${
                            scrolled && onHome ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ transform: `scaleX(${progress})` }}
                    />
                </nav>

                {/* Mobile panel */}
                <div
                    id="mobile-navigation"
                    aria-hidden={!isOpen}
                    className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out motion-reduce:transition-none md:hidden ${
                        isOpen
                            ? 'mt-2 grid-rows-[1fr] opacity-100'
                            : 'pointer-events-none grid-rows-[0fr] opacity-0'
                    }`}
                >
                    <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.3)] backdrop-blur-xl">
                        <div className="p-3">
                            <div className="flex flex-col gap-1">
                                {navLinks.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        tabIndex={isOpen ? 0 : -1}
                                        onClick={(e) => handleSectionClick(e, item)}
                                        className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-semibold transition ${
                                            isActive(item)
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'text-slate-700 hover:bg-slate-900/5'
                                        }`}
                                    >
                                        {item.name}
                                        <ChevronRight
                                            size={17}
                                            className={isActive(item) ? 'text-emerald-600' : 'text-slate-400'}
                                        />
                                    </a>
                                ))}
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2.5 border-t border-slate-100 pt-3">
                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                    tabIndex={isOpen ? 0 : -1}
                                    className="flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={closeMenu}
                                    tabIndex={isOpen ? 0 : -1}
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                                >
                                    Get started
                                    <ArrowUpRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}