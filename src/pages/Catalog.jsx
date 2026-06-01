import { useState } from 'react'
import { useProducts } from '../context/ProductsContext'
import FilterBar from '../components/FilterBar'
import ProductCard from '../components/ProductCard'

export default function Catalog() {
  const { products, loading } = useProducts()
  const [activeFilter, setActiveFilter] = useState('todos')
  const [search, setSearch] = useState('')

  const filtered = products.filter(p => {
    const matchCat = activeFilter === 'todos' || p.category === activeFilter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Catálogo Mayorista
          </h1>
          <p className="text-gray-500">
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''} disponibles
          </p>
        </div>

        <FilterBar
          active={activeFilter}
          onFilter={setActiveFilter}
          search={search}
          onSearch={setSearch}
        />

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-500">
            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            Cargando productos…
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg font-medium">No se encontraron productos</p>
            <p className="text-gray-600 text-sm mt-1">Probá con otros filtros o términos de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}
