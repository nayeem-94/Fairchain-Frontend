import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Activity,
  Package,
  Factory,
  Truck,
  Store,
  Eye,
  CheckCircle2,
  Boxes,
  AlertTriangle,
  Landmark,
  Users,
  KeyRound,
  Cpu,
  Database,
  Server,
} from 'lucide-react'

/* ---------- data ---------- */

const stages = [
  {
    label: 'Importer',
    icon: Package,
    price: 100,
    text: 'Goods enter the market. Quantities, origin and the declared import price are recorded here.',
    records: ['Declared import price', 'Quantity received', 'Origin and batch'],
  },
  {
    label: 'Manufacturer',
    icon: Factory,
    price: 107,
    text: 'Raw goods are processed or packed. The record links each output batch to its inputs.',
    records: ['Input and output batch', 'Processing cost', 'Quantity produced'],
  },
  {
    label: 'Distributor',
    icon: Truck,
    price: 113,
    text: 'Products move between locations. Every transfer keeps its quantity and declared price.',
    records: ['Transfer between parties', 'District of dispatch', 'Declared selling price'],
  },
  {
    label: 'Wholesaler',
    icon: Boxes,
    price: 131,
    flagged: true,
    text: 'Bulk stock is sold to retailers. Large price steps here are compared with the expected range.',
    records: ['Stock held', 'Bulk selling price', 'Retailer allocation'],
  },
  {
    label: 'Retailer',
    icon: Store,
    price: 138,
    text: 'Goods reach consumers. The final shelf price closes the chain and completes the record.',
    records: ['Shelf price', 'Stock on hand', 'District of sale'],
  },
]

const history = [52, 53, 52, 55, 54, 57, 56, 60, 72, 63, 66, 64]
const forecast = [64, 66, 67, 69, 70, 72]
const band = 4

const products = [
  { name: 'Rice', trend: 'up', data: [40, 41, 43, 42, 45, 47, 49] },
  { name: 'Soybean oil', trend: 'flat', data: [60, 61, 60, 62, 61, 61, 62] },
  { name: 'Onion', trend: 'down', data: [58, 55, 52, 50, 47, 45, 44] },
  { name: 'Sugar', trend: 'up', data: [30, 30, 32, 33, 33, 35, 36] },
]

const roles = [
  {
    icon: Landmark,
    title: 'Regulators and government',
    text: 'Review price trends, open flagged records and see which districts need attention first.',
  },
  {
    icon: Users,
    title: 'Supply chain participants',
    text: 'Record stock, transfers and declared prices for your own stage, with access limited to your role.',
  },
  {
    icon: Eye,
    title: 'The public',
    text: 'Read price information and supply chain activity, so consumers can see what is happening in their market.',
  },
]

const stack = [
  { icon: Cpu, name: 'Prophet', text: 'Price forecasting' },
  { icon: Activity, name: 'Isolation Forest', text: 'Anomaly detection' },
  { icon: Server, name: 'Go REST API', text: 'Gin backend' },
  { icon: Database, name: 'PostgreSQL', text: 'Supabase database' },
  { icon: MapPin, name: 'Leaflet', text: 'OpenStreetMap maps' },
  { icon: KeyRound, name: 'JWT + RBAC', text: 'Role-based access' },
]

const overview = [
  { value: '5', label: 'supply chain stages tracked' },
  { value: '64', label: 'districts in scope' },
  { value: '2', label: 'AI models for forecasts and anomalies' },
  { value: '3', label: 'role types with scoped access' },
]

/* ---------- helpers ---------- */

const pathFrom = (pts, w, h, min, max, offset = 0, total = pts.length) =>
  pts
    .map((v, i) => {
      const x = ((i + offset) / (total - 1)) * w
      const y = h - ((v - min) / (max - min)) * h
      return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

function Sparkline({ data, color }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  return (
    <svg viewBox="0 0 80 28" className="h-7 w-20" aria-hidden="true">
      <path
        d={pathFrom(data, 80, 24, min, max)}
        transform="translate(0 2)"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PriceChart() {
  const W = 520
  const H = 210
  const total = history.length + forecast.length - 1
  const min = 40
  const max = 84
  const x = (i) => (i / (total - 1)) * W
  const y = (v) => H - ((v - min) / (max - min)) * H
  const start = history.length - 1

  const upper = forecast.map((v, i) => `${x(start + i).toFixed(1)},${y(v + band + i * 0.6).toFixed(1)}`)
  const lower = forecast
    .map((v, i) => `${x(start + i).toFixed(1)},${y(v - band - i * 0.6).toFixed(1)}`)
    .reverse()

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Illustrative price history with forecast and one flagged spike">
      <defs>
        <linearGradient id="fc-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 1, 2, 3].map((n) => (
        <line key={n} x1="0" x2={W} y1={(H / 3) * n} y2={(H / 3) * n} stroke="#e2e8f0" strokeDasharray="3 5" />
      ))}

      <polygon points={[...upper, ...lower].join(' ')} fill="#10b981" opacity="0.12" />

      <path
        d={`${pathFrom(history, W, H, min, max, 0, total)} L${x(start)},${H} L0,${H} Z`}
        fill="url(#fc-area)"
      />
      <path
        className="fc-draw"
        d={pathFrom(history, W, H, min, max, 0, total)}
        fill="none"
        stroke="#059669"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
      <path
        d={pathFrom(forecast, W, H, min, max, start, total)}
        fill="none"
        stroke="#059669"
        strokeWidth="2.5"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />

      <line x1={x(start)} x2={x(start)} y1="0" y2={H} stroke="#94a3b8" strokeDasharray="4 4" />

      <g className="fc-pop">
        <circle cx={x(8)} cy={y(72)} r="14" fill="#f43f5e" opacity="0.15" className="fc-pulse" />
        <circle cx={x(8)} cy={y(72)} r="6" fill="#f43f5e" stroke="white" strokeWidth="2.5" />
      </g>
    </svg>
  )
}

/* ---------- sections ---------- */

function Hero() {
  return (
    <section id="home" className="relative scroll-mt-24 overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgb(15 23 42 / 0.07) 1px, transparent 0)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 60% 30%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 60% 30%, black, transparent)',
        }}
      />
      <div className="pointer-events-none absolute -right-40 -top-32 h-[28rem] w-[28rem] rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-8 lg:pb-28 lg:pt-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 py-1.5 pl-2 pr-4 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur sm:text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
              <ShieldCheck size={14} />
            </span>
            Built for transparency in Bangladesh
          </div>

          <h1 className="mt-7 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem]">
            See where the price of essential goods really changes.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            FairChain BD follows goods from importer to retailer, forecasts prices
            and flags unusual jumps, so artificial price hikes are easier to find
            and act on.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 pl-7 pr-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/15 transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Get started
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-slate-900 transition group-hover:bg-white group-hover:text-emerald-700">
                <ArrowRight size={16} />
              </span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              See how it works <ArrowUpRight size={16} />
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
            {['Product traceability', 'AI price forecasts', 'District monitoring'].map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Price chart preview */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-emerald-200/50 to-teal-100/30 blur-2xl" />
          <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Retail price trend</p>
                <p className="mt-1 text-xs text-slate-500">History, forecast and flagged activity</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                Preview
              </span>
            </div>

            <div className="mt-5">
              <PriceChart />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2"><span className="h-0.5 w-5 rounded bg-emerald-600" />Recorded price</span>
              <span className="inline-flex items-center gap-2"><span className="h-2 w-5 rounded bg-emerald-500/20" />Forecast range</span>
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" />Flagged</span>
            </div>

            <div className="fc-pop absolute -bottom-6 -left-3 flex max-w-[16.5rem] items-start gap-3 rounded-2xl border border-rose-100 bg-white p-3.5 shadow-xl shadow-rose-900/10 sm:-left-8">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">Unusual price jump</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">Outside the expected range. Ready for review.</p>
              </div>
            </div>
          </div>
          <p className="mt-10 text-center text-[11px] text-slate-400">Illustrative preview. Not live supply chain data.</p>
        </div>
      </div>
    </section>
  )
}

function Overview() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/70">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-5 py-10 lg:grid-cols-4 lg:px-8">
        {overview.map((o, i) => (
          <div key={o.label} className={`px-2 lg:px-8 ${i ? 'lg:border-l lg:border-slate-200' : ''}`}>
            <dt className="text-4xl font-extrabold tracking-tight text-slate-900">{o.value}</dt>
            <dd className="mt-1 max-w-[12rem] text-sm leading-5 text-slate-500">{o.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function HowItWorks() {
  const [active, setActive] = useState(3)
  const stage = stages[active]
  const Icon = stage.icon
  const maxPrice = 150

  return (
    <section id="how-it-works" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            A price goes up. Which stage made it happen?
          </h2>
          <p className="mt-5 leading-7 text-slate-600">
            Each stage records what it received, what it sold and the price it declared.
            Put together, the records show how the price builds up from importer to retailer.
            Select a stage to see what it contributes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* Price build-up */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-bold text-slate-900">Price build-up along the chain</p>
              <p className="text-xs text-slate-500">Price index, importer = 100</p>
            </div>

            <div className="mt-8 flex h-64 items-end gap-2 sm:gap-4" role="tablist" aria-label="Supply chain stages">
              {stages.map((s, i) => {
                const SIcon = s.icon
                const selected = i === active
                return (
                  <button
                    key={s.label}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(i)}
                    className="group flex h-full flex-1 flex-col justify-end gap-2 text-center focus-visible:outline-none"
                  >
                    <span className={`text-xs font-bold transition ${selected ? 'text-slate-900' : 'text-slate-400'}`}>
                      {s.price}
                    </span>
                    <span
                      className={`relative block w-full rounded-t-xl transition-all duration-500 group-focus-visible:ring-2 group-focus-visible:ring-emerald-500 ${
                        s.flagged
                          ? selected ? 'bg-rose-500' : 'bg-rose-300 group-hover:bg-rose-400'
                          : selected ? 'bg-emerald-600' : 'bg-emerald-200 group-hover:bg-emerald-300'
                      }`}
                      style={{ height: `${(s.price / maxPrice) * 78}%` }}
                    >
                      {s.flagged && (
                        <span className="absolute -top-1 left-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-rose-500 text-white">
                          <AlertTriangle size={11} />
                        </span>
                      )}
                    </span>
                    <span className={`flex flex-col items-center gap-1 text-[11px] font-semibold sm:text-xs ${selected ? 'text-emerald-700' : 'text-slate-500'}`}>
                      <SIcon size={16} />
                      <span className="hidden sm:inline">{s.label}</span>
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-5 text-[11px] text-slate-400">Illustrative example. The flagged step is larger than the range the model expects.</p>
          </div>

          {/* Stage detail */}
          <div className="flex flex-col rounded-3xl bg-emerald-950 p-6 text-white sm:p-8">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                <Icon size={24} />
              </span>
              <div>
                <p className="text-xs text-emerald-300/80">Stage {active + 1} of {stages.length}</p>
                <h3 className="text-xl font-bold">{stage.label}</h3>
              </div>
            </div>

            <p className="mt-6 leading-7 text-emerald-50/80">{stage.text}</p>

            <p className="mt-7 text-sm font-semibold text-emerald-200">What gets recorded</p>
            <ul className="mt-3 space-y-3">
              {stage.records.map((r) => (
                <li key={r} className="flex items-center gap-3 text-sm text-emerald-50">
                  <CheckCircle2 size={17} className="shrink-0 text-emerald-400" />
                  {r}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex gap-2 pt-8">
              {stages.map((s, i) => (
                <span key={s.label} className={`h-1 flex-1 rounded-full transition ${i <= active ? 'bg-emerald-400' : 'bg-white/15'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DistrictMap() {
  const watch = [5, 22, 37, 48]
  const alert = [13]
  return (
    <div className="grid grid-cols-8 gap-2" role="img" aria-label="Illustrative status of 64 districts">
      {Array.from({ length: 64 }, (_, i) => (
        <span
          key={i}
          className={`aspect-square rounded-full ${
            alert.includes(i) ? 'bg-rose-500' : watch.includes(i) ? 'bg-amber-400' : 'bg-emerald-300'
          }`}
        />
      ))}
    </div>
  )
}

function Features() {
  const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus }
  const trendText = { up: 'Rising', down: 'Falling', flat: 'Stable' }
  const trendColor = { up: '#e11d48', down: '#059669', flat: '#64748b' }

  return (
    <section id="features" className="scroll-mt-24 bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            Everything you need to monitor essential goods in one place.
          </h2>
          <p className="mt-5 leading-7 text-slate-600">
            Records, forecasts and alerts work together, so each price can be traced and compared.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-6">
          {/* Forecast */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><TrendingUp size={21} /></span>
              <h3 className="text-lg font-bold text-slate-900">Price forecasting</h3>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">
              Prophet models learn each product's seasonal pattern and project the expected price range, so a real change stands out from a normal one.
            </p>
            <ul className="mt-6 divide-y divide-slate-100">
              {products.map((p) => {
                const TIcon = trendIcon[p.trend]
                return (
                  <li key={p.name} className="flex items-center justify-between gap-4 py-3.5">
                    <span className="w-28 text-sm font-semibold text-slate-800">{p.name}</span>
                    <Sparkline data={p.data} color={trendColor[p.trend]} />
                    <span className="inline-flex w-24 items-center justify-end gap-1.5 text-xs font-semibold text-slate-500">
                      <TIcon size={15} style={{ color: trendColor[p.trend] }} />
                      {trendText[p.trend]}
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="mt-3 text-[11px] text-slate-400">Illustrative values.</p>
          </article>

          {/* Anomaly */}
          <article className="flex flex-col rounded-3xl bg-slate-900 p-6 text-white sm:p-8 lg:col-span-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300"><AlertTriangle size={21} /></span>
            <h3 className="mt-5 text-lg font-bold">Anomaly detection</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Isolation Forest flags prices and stock movements that do not fit the usual pattern, so reviewers know where to look first.
            </p>
            <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Flagged for review</p>
              <p className="mt-1 text-sm font-semibold">Wholesale price step above expected range</p>
            </div>
          </article>

          {/* District */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><MapPin size={21} /></span>
            <h3 className="mt-5 text-lg font-bold text-slate-900">District monitoring</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">See activity across all 64 districts on an interactive map.</p>
            <div className="mt-6"><DistrictMap /></div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-300" />Normal</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" />Watch</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" />Alert</span>
            </div>
          </article>

          {/* Traceability */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck size={21} /></span>
            <h3 className="mt-5 text-lg font-bold text-slate-900">Traceable transactions</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Every movement keeps its quantity, parties and declared price, so a product can be followed from import to shelf.
            </p>
            <div className="mt-6 space-y-2">
              {['Batch received', 'Transferred', 'Sold to retailer'].map((t, i) => (
                <div key={t} className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><CheckCircle2 size={14} /></span>
                  <span className="flex-1 font-medium">{t}</span>
                  <span className="h-1.5 rounded-full bg-emerald-200" style={{ width: `${70 - i * 18}px` }} />
                </div>
              ))}
            </div>
          </article>

          {/* Inventory */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Boxes size={21} /></span>
            <h3 className="mt-5 text-lg font-bold text-slate-900">Inventory awareness</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Stock levels and product movement sit side by side, so unusual hoarding or shortages are easier to notice.
            </p>
            <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-slate-100">
              <span className="w-[46%] bg-emerald-500" />
              <span className="w-[24%] bg-emerald-300" />
              <span className="w-[12%] bg-amber-300" />
            </div>
            <div className="mt-3 flex justify-between text-[11px] text-slate-500">
              <span>In stock</span><span>In transit</span><span>Low</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function Roles() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:px-8">
        <div>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            One platform, the right view for everyone.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-slate-600">
            Role-based access keeps each person focused on what they need and protects records from changes by the wrong party.
          </p>
        </div>

        <ul className="divide-y divide-slate-200 border-y border-slate-200">
          {roles.map((r) => {
            const RIcon = r.icon
            return (
              <li key={r.title} className="flex gap-5 py-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <RIcon size={22} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{r.title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-7 text-slate-600">{r.text}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Why FairChain BD exists
            </h2>
            <p className="mt-5 leading-7 text-slate-600">
              When the price of rice, oil or onions jumps, it is hard to tell where the increase happened and whether it was justified. Information is scattered, and artificial price hikes are difficult to prove.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              FairChain BD brings records from every stage into one transparent system and uses AI to point out what deserves a closer look. The goal is simple: a fairer market for consumers across Bangladesh.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">Built with</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {stack.map((s) => {
                const SIcon = s.icon
                return (
                  <li key={s.name} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><SIcon size={19} /></span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.text}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function Cta() {
  return (
    <section className="px-3 pb-4 pt-6 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-emerald-950 px-6 py-16 text-white sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              Better visibility starts with better information.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-emerald-100/80">
              Create an account to explore product records, price monitoring and supply chain insights in one platform.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-emerald-950 transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
            >
              Get started <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <style>{`
        .fc-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: fc-draw 1.6s ease-out .2s forwards; }
        .fc-pop { opacity: 0; animation: fc-pop .5s ease-out 1.5s forwards; transform-origin: center; transform-box: fill-box; }
        .fc-pulse { animation: fc-pulse 2.2s ease-in-out 2s infinite; transform-origin: center; transform-box: fill-box; }
        @keyframes fc-draw { to { stroke-dashoffset: 0; } }
        @keyframes fc-pop { from { opacity: 0; transform: translateY(8px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes fc-pulse { 0%,100% { transform: scale(1); opacity: .15; } 50% { transform: scale(1.5); opacity: .05; } }
        @media (prefers-reduced-motion: reduce) {
          .fc-draw { animation: none; stroke-dashoffset: 0; }
          .fc-pop { animation: none; opacity: 1; }
          .fc-pulse { animation: none; }
        }
      `}</style>
      <main>
        <Hero />
        <Overview />
        <HowItWorks />
        <Features />
        <Roles />
        <About />
        <Cta />
      </main>
    </>
  )
}