const items = [
  {
    emoji: '📦',
    title: 'Stock cuando lo necesitás',
    desc: 'No te quedás colgado justo cuando estabas vendiendo bien.',
  },
  {
    emoji: '🔒',
    title: 'Garantía de verdad',
    desc: 'Si algo llega fallado, te lo cambio o te devuelvo la plata.',
  },
  {
    emoji: '🚀',
    title: 'Arrancás con poco',
    desc: 'No necesitás una inversión enorme para empezar a vender.',
  },
]

export default function PainPoints() {
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-10">
          Lo que un buen proveedor tiene que cumplir
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map(({ emoji, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-6 border border-green-500/10 flex gap-4 items-start">
              <span className="text-3xl flex-shrink-0">{emoji}</span>
              <div>
                <p className="text-white font-semibold mb-1">{title}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
