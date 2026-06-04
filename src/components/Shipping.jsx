import { Clock, MapPin } from 'lucide-react'

const carriers = [
  { id: 'correo',   name: 'Correo Argentino', tagline: 'Correo Argentino', logo: '/logo-correo.png'   },
  { id: 'viacargo', name: 'Via Cargo',         tagline: 'Via Cargo',        logo: '/logo-viacargo.png' },
]

export default function Shipping() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="glass rounded-3xl p-8 sm:p-10 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock size={17} className="text-amber-400" />
                <span className="text-amber-400 font-semibold text-sm">Envío en 72 horas</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Hacemos envíos con</h2>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto glass px-4 py-2 rounded-full border border-green-500/20">
              <MapPin size={14} className="text-green-400" />
              <span className="text-sm text-green-400">Todo el país</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {carriers.map(c => (
              <div key={c.id} className="glass glass-hover rounded-2xl p-6 flex items-center gap-5">
                <img
                  src={c.logo}
                  alt={c.name}
                  className="h-10 object-contain object-left flex-shrink-0"
                  style={{ maxWidth: '160px' }}
                  onError={e => { e.currentTarget.replaceWith(Object.assign(document.createElement('span'), { textContent: c.name, className: 'font-bold text-white text-base' })) }}
                />
                <div className="text-sm text-gray-500">{c.tagline}</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-600 mt-5 text-center">
            Los tiempos pueden variar según la zona. Consultá por WhatsApp para más info.
          </p>
        </div>

      </div>
    </section>
  )
}
