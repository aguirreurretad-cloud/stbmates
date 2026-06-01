import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import ProductImage from './ProductImage'

const categoryGradients = {
  calabaza:  'from-amber-900 to-amber-700',
  madera:    'from-stone-700 to-stone-500',
  cuero:     'from-amber-900 to-orange-700',
  bombillas: 'from-zinc-700 to-zinc-500',
  combos:    'from-emerald-800 to-emerald-600',
  accesorios:'from-violet-800 to-violet-600',
}

const categoryLabels = {
  calabaza: 'Calabaza', madera: 'Algarrobo', acero: 'Acero',
  cuero: 'Cuero', bombillas: 'Bombillas', combos: 'Combos', accesorios: 'Accesorios',
}

// Normaliza variación: string legacy → { name, price: 0 }
const normalizeVar = v => typeof v === 'string' ? { name: v, price: 0 } : v

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart()
  const gradient = categoryGradients[product.category] || 'from-zinc-800 to-zinc-600'

  // Images array (soporte para múltiples fotos + compat con campo image)
  const images = product.images?.length > 0
    ? product.images
    : product.image ? [product.image] : []
  const [imgIdx, setImgIdx] = useState(0)

  const hasColors     = product.colors?.length > 0
  const variations    = (product.variations || []).map(normalizeVar)
  const hasVariations = variations.length > 0

  const [selectedColor,     setSelectedColor]     = useState(hasColors     ? product.colors[0] : null)
  const [selectedVariation, setSelectedVariation] = useState(hasVariations ? variations[0]      : null)

  // Precio efectivo: si la variación tiene precio propio lo usa, sino el base
  const effectivePrice = selectedVariation?.price > 0 ? selectedVariation.price : product.price

  const varName    = selectedVariation?.name || ''
  const cartId     = `${product.id}-${selectedColor?.hex || ''}-${varName}`
  const inCart     = cart.find(i => i.cartId === cartId)
  const outOfStock = product.inStock === false

  const handleAdd = () => {
    if (outOfStock) return
    addToCart({ ...product, price: effectivePrice }, selectedColor, selectedVariation)
  }

  const prevImg = (e) => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length) }
  const nextImg = (e) => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length) }

  return (
    <div className="glass glass-hover rounded-2xl overflow-hidden group flex flex-col">

      {/* Image / carousel */}
      <div className={`relative h-80 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden flex-shrink-0`}>
        {images.length > 0 ? (
          <>
            <ProductImage
              key={imgIdx}
              src={images[imgIdx]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Arrows — solo si hay más de 1 foto */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-full cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-full cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={16} />
                </button>
                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={e => { e.stopPropagation(); setImgIdx(i) }}
                      className={`rounded-full transition-all cursor-pointer ${
                        i === imgIdx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-500 select-none">🧉</span>
        )}

        <span className="absolute top-3 left-3 text-xs font-medium bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
          {categoryLabels[product.category] || product.category}
        </span>
        {outOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-sm font-bold text-white bg-red-500/90 px-4 py-1.5 rounded-full tracking-wide">
              Sin Stock
            </span>
          </div>
        )}
        {!outOfStock && inCart && (
          <span className="absolute top-3 right-3 text-xs font-medium bg-green-500 text-white px-2.5 py-1 rounded-full">
            En pedido
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
        )}

        {/* Colors */}
        {hasColors && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1.5">Color: <span className="text-gray-300">{selectedColor?.name}</span></p>
            <div className="flex flex-wrap gap-1.5">
              {product.colors.map(c => (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => setSelectedColor(c)}
                  className="w-6 h-6 rounded-full transition-all duration-150 cursor-pointer flex-shrink-0"
                  style={{
                    backgroundColor: c.hex,
                    boxShadow: selectedColor?.hex === c.hex
                      ? '0 0 0 2px #060d08, 0 0 0 3.5px white'
                      : '0 0 0 1px rgba(255,255,255,0.15)',
                    transform: selectedColor?.hex === c.hex ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Variations */}
        {hasVariations && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1.5">Variación:</p>
            <div className="flex flex-wrap gap-1.5">
              {variations.map(v => (
                <button
                  key={v.name}
                  onClick={() => setSelectedVariation(v)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-150 cursor-pointer ${
                    selectedVariation?.name === v.name
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'glass border-white/10 text-gray-400 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {v.name}{v.price > 0 ? ` · $${v.price.toLocaleString('es-AR')}` : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price + Add */}
        <div className="flex items-end justify-between mt-auto pt-2">
          <div>
            <div className="text-xl font-bold text-green-400">
              ${effectivePrice.toLocaleString('es-AR')}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              por {product.unit || 'unidad'}
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl transition-all duration-200 border ${
              outOfStock
                ? 'bg-white/[0.03] border-white/[0.06] text-gray-600 cursor-not-allowed'
                : inCart
                  ? 'bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500 hover:text-white hover:border-green-500 cursor-pointer'
                  : 'bg-white/[0.06] border-white/[0.1] text-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500 cursor-pointer'
            }`}
          >
            <Plus size={15} />
            {outOfStock ? 'Sin stock' : inCart ? 'Agregar más' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}
