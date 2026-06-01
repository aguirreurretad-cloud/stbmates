import { Search } from 'lucide-react'
import { CATEGORIES } from '../data/products'

export default function FilterBar({ active, onFilter, search, onSearch }) {
  return (
    <div className="mb-8">
      {/* Search input */}
      <div className="relative mb-5">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Buscar productos..."
          className="input-field pl-11"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onFilter(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border ${
              active === cat.id
                ? 'bg-green-500 border-green-500 text-white shadow-[0_0_18px_rgba(34,197,94,0.35)]'
                : 'glass glass-hover text-gray-400 hover:text-white border-white/[0.08]'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
