import { Link } from 'react-router-dom'
import { ArrowRight, Quote } from 'lucide-react'
import { useReferences } from '../context/ReferencesContext'
import { WHY_US } from '../data/references'
import ProductImage from '../components/ProductImage'

export default function References() {
  const { testimonials, screenshots, celebrities } = useReferences()

  return (
    <div className="pt-20">

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-green-600/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-amber-500/6 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">Clientes reales</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Ellos ya{' '}
            <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 bg-clip-text text-transparent">
              confían en nosotros
            </span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-8">
            Emprendedores y comercios de todo el país que eligieron STB Mates como su proveedor mayorista.
          </p>
          <Link to="/catalogo" className="btn-primary inline-flex gap-2">
            Ver catálogo <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ¿Por qué comprarnos? */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">¿Por qué comprarnos?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Razones concretas para elegirnos como tu proveedor mayorista.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_US.map(({ emoji, title, desc }) => (
              <div key={title} className="glass glass-hover rounded-2xl p-6 flex gap-4">
                <span className="text-3xl flex-shrink-0">{emoji}</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Famosos con nuestros mates */}
      {celebrities.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4 border border-amber-500/20">
                <span className="text-amber-400 text-sm font-medium">⭐ Figuras públicas</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Los eligen los mejores</h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Estos mates ya los piden. Sumalos a tu negocio y vendé lo que la gente busca.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {celebrities.map(c => (
                <div key={c.id} className="glass glass-hover rounded-2xl overflow-hidden group">
                  <div className="relative h-72 bg-white/[0.03] overflow-hidden">
                    <ProductImage
                      src={c.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="font-bold text-white text-lg leading-tight">{c.name}</div>
                      {c.description && (
                        <div className="text-gray-300 text-sm mt-0.5">{c.description}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonios */}
      {testimonials.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">Lo que dicen nuestros clientes</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map(t => (
                <div key={t.id} className="glass rounded-2xl p-6 flex flex-col">
                  <Quote size={24} className="text-green-500/40 mb-4 flex-shrink-0" />
                  <p className="text-gray-300 leading-relaxed flex-1 italic mb-5">"{t.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/[0.08]">
                      {t.image
                        ? <ProductImage src={t.image} className="w-full h-full object-cover" />
                        : <span className="text-base font-semibold text-green-400">{t.name.charAt(0)}</span>
                      }
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.business}{t.city ? ` · ${t.city}` : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Screenshots de clientes felices */}
      {screenshots.length > 0 && (
        <section className="py-16 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">Clientes felices 🧉</h2>
              <p className="text-gray-500">Capturas reales de nuestros compradores.</p>
            </div>
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {screenshots.map(s => (
                <div key={s.id} className="break-inside-avoid glass rounded-2xl overflow-hidden border border-white/[0.06]">
                  <ProductImage src={s.image} className="w-full h-auto block" />
                  {s.caption && (
                    <p className="text-xs text-gray-500 px-3 py-2">{s.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
