import { Link } from 'react-router-dom'
import { ArrowRight, Package, Truck, BadgeCheck } from 'lucide-react'
import { WHATSAPP_NUMBER } from '../config'

const stats = [
  { icon: Package,    color: 'text-green-400',  bg: 'bg-green-500/15',  value: '50+',    label: 'Productos' },
  { icon: Truck,      color: 'text-amber-400',  bg: 'bg-amber-500/15',  value: '48hs',   label: 'Envío express' },
  { icon: BadgeCheck, color: 'text-green-400',  bg: 'bg-green-500/15',  value: '100%',   label: 'Garantizado' },
]

export default function Hero() {
  return (
    <section
      className="hero-bg relative flex items-center pt-16 overflow-hidden"
      style={{ minHeight: 'clamp(480px, 56vw, 88vh)' }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
      {/* Green glow bottom — mobile only */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-green-600/40 via-green-900/20 to-transparent pointer-events-none" />
      {/* Bottom fade into page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060d08] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-xl">

          {/* Badge */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src="/logo.png"
              alt="STB Mates"
              className="h-16 w-16 object-contain drop-shadow-xl"
              style={{ filter: 'invert(1)' }}
            />
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-green-400 font-medium">Distribución Mayorista</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
            El proveedor<br />
            que{' '}
            <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 bg-clip-text text-transparent">
              buscabas
            </span>
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Mates y bombillas al por mayor. Precios imbatibles,
            calidad garantizada. Ideal para revendedores y emprendedores.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Link to="/catalogo" className="btn-primary gap-2 text-base px-7 py-3.5">
              Ver Catálogo <ArrowRight size={18} />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline gap-2 text-base px-7 py-3.5"
            >
              Consultar por WhatsApp
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4">
            {stats.map(({ icon: Icon, color, bg, value, label }) => (
              <div key={label} className="flex items-center gap-3 glass rounded-2xl px-4 py-3 border border-white/[0.07]">
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <div className="text-base font-bold text-white leading-none">{value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
