import { Link } from 'react-router-dom'
import { MessageCircle, MapPin, ArrowRight, Users, Package, Star, Truck } from 'lucide-react'

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
import { WHATSAPP_NUMBER, INSTAGRAM, ZONE } from '../config'

const stats = [
  { icon: Package,  value: '200+',  label: 'Referencias disponibles' },
  { icon: Users,    value: '200+',  label: 'Clientes en todo el país' },
  { icon: Star,     value: '100%',  label: 'Compromiso y calidad' },
  { icon: Truck,    value: 'Todo',  label: 'Argentina' },
]

const values = [
  {
    emoji: '🧉',
    title: 'Tradición',
    desc: 'Trabajamos con una tradición tan nuestra como el mate, desarrollando productos que conectan con la cultura argentina.',
  },
  {
    emoji: '🤝',
    title: 'Confianza',
    desc: 'Construimos vínculos comerciales basados en el cumplimiento, la responsabilidad y la atención cercana.',
  },
  {
    emoji: '🚀',
    title: 'Crecimiento',
    desc: 'Somos una fábrica en crecimiento, con mirada puesta en seguir desarrollando productos y acompañando a nuestros clientes.',
  },
  {
    emoji: '💰',
    title: 'Competitividad',
    desc: 'Precios mayoristas competitivos para que puedas ampliar tu oferta, diferenciarte y vender más.',
  },
]

export default function About() {
  return (
    <div className="pt-20">

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-green-600/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-amber-500/6 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-green-400 font-medium">Fábrica Mayorista</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Sobre{' '}
              <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 bg-clip-text text-transparent">
                nosotros
              </span>
            </h1>

            <p className="text-gray-300 text-xl leading-relaxed">
              Somos una fábrica dedicada a la producción y distribución mayorista de mates,
              bombillas y accesorios, con una propuesta pensada para revendedores, comercios
              y emprendedores de todo el país.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="glass rounded-2xl p-6 text-center border border-white/[0.06]">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia completa */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Nuestra historia</h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Contamos con más de 200 referencias disponibles, variedad de modelos,
                  materiales y estilos, y trabajamos constantemente para ofrecer productos
                  de buena calidad, excelente presentación y precios competitivos.
                </p>
                <p>
                  Nuestro objetivo es acompañar a cada cliente con una atención cercana,
                  rápida y responsable, brindando soluciones para que pueda ampliar su
                  oferta, diferenciarse y vender más.
                </p>
                <p>
                  Hoy llegamos a clientes en distintos puntos de {ZONE}, construyendo
                  vínculos comerciales basados en la confianza, el cumplimiento y la variedad.
                </p>
                <p>
                  Somos una fábrica en crecimiento, con compromiso, experiencia y una
                  mirada puesta en seguir desarrollando productos que conecten con una
                  tradición tan nuestra como el mate.
                </p>
              </div>

              <Link to="/catalogo" className="btn-primary inline-flex gap-2 mt-4">
                Ver Catálogo <ArrowRight size={18} />
              </Link>
            </div>

            {/* Photo */}
            <div className="relative">
              <div className="absolute -inset-4 bg-green-500/10 rounded-3xl blur-2xl pointer-events-none" />
              <img
                src="/about.jpg"
                alt="STB Mates — Fábrica"
                className="relative rounded-3xl w-full object-cover shadow-2xl border border-white/[0.08]"
                style={{ maxHeight: '520px' }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Nuestros valores</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Los principios que guían cada pedido, cada producto y cada vínculo comercial.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ emoji, title, desc }) => (
              <div key={title} className="glass glass-hover rounded-2xl p-6">
                <div className="text-3xl mb-4">{emoji}</div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-10 sm:p-14 border border-green-500/10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-green-500/8 rounded-full blur-[60px]" />
            </div>

            <div className="relative text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">Contactate con nosotros</h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                ¿Tenés alguna consulta sobre productos, precios o envíos? Estamos disponibles
                para ayudarte a armar tu pedido.
              </p>
            </div>

            <div className="relative flex flex-wrap justify-center gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-white transition-all hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle size={22} />
                <div className="text-left">
                  <div className="text-sm font-bold">WhatsApp</div>
                  <div className="text-xs opacity-80">Respondemos rápido</div>
                </div>
              </a>

              <a
                href={`https://instagram.com/${INSTAGRAM}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-white transition-all hover:scale-105 glass glass-hover border border-white/[0.1]"
                style={{ background: 'linear-gradient(135deg, rgba(225,48,108,0.2), rgba(193,53,132,0.15))' }}
              >
                <span className="text-pink-400"><InstagramIcon /></span>
                <div className="text-left">
                  <div className="text-sm font-bold">@{INSTAGRAM}</div>
                  <div className="text-xs text-gray-400">Seguinos en Instagram</div>
                </div>
              </a>

              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl glass border border-white/[0.1]">
                <MapPin size={22} className="text-green-400 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-bold text-white">Distribución</div>
                  <div className="text-xs text-gray-400">{ZONE}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
