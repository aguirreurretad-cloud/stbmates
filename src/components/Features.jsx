import { Link } from 'react-router-dom'
import { Zap, Shield, RefreshCw, HeartHandshake } from 'lucide-react'

const features = [
  {
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    title: 'Pedidos Rápidos',
    desc: 'Armá tu pedido en minutos y envialo por WhatsApp. Sin formularios ni esperas.',
  },
  {
    icon: Shield,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    title: 'Calidad Garantizada',
    desc: 'Todos los productos pasan control de calidad antes de salir. Sin sorpresas.',
  },
  {
    icon: RefreshCw,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    title: 'Stock Actualizado',
    desc: 'Catálogo siempre al día. Sabés en todo momento qué hay disponible.',
  },
  {
    icon: HeartHandshake,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    title: 'Soporte Real',
    desc: 'Te ayudamos a armar tu negocio. Asesoramiento de persona a persona.',
  },
]

export default function Features() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Más que un proveedor, somos tu socio en el negocio del mate.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="glass glass-hover rounded-2xl p-6">
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-5`}>
                <Icon size={22} className={color} />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="glass rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden border border-green-500/10">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-green-500/8 rounded-full blur-[60px]" />
          </div>
          <div className="relative">
            <div className="text-4xl mb-4">🧉</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¿Listo para emprender?
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto text-lg">
              Explorá nuestro catálogo, armá tu pedido y contactanos por WhatsApp. Así de simple.
            </p>
            <Link to="/catalogo" className="btn-primary inline-flex gap-2 text-base px-8 py-4">
              Ver Catálogo Completo
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
