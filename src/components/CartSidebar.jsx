import { X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { WHATSAPP_NUMBER, STORE_NAME, MIN_ORDER } from '../config'

function buildWhatsAppMessage(cart, totalPrice) {
  const lines = cart.map(item => {
    const extras = [
      item.selectedColor         ? `Color: ${item.selectedColor.name}`          : null,
      item.selectedVariation?.name ? `Variación: ${item.selectedVariation.name}` : null,
    ].filter(Boolean).join(', ')
    const subtotal = item.price * item.qty
    return `• ${item.name}${extras ? ` (${extras})` : ''} x ${item.qty} = $${subtotal.toLocaleString('es-AR')}`
  })
  return [
    `¡Hola ${STORE_NAME}! Quiero hacer el siguiente pedido mayorista:`,
    '',
    ...lines,
    '',
    `💰 *TOTAL: $${totalPrice.toLocaleString('es-AR')}*`,
    '',
    '¡Aguardo confirmación! 🧉',
  ].join('\n')
}

export default function CartSidebar() {
  const { cart, isOpen, setIsOpen, updateQty, removeFromCart, totalPrice } = useCart()
  const meetsMinimum = totalPrice >= MIN_ORDER
  const remaining = MIN_ORDER - totalPrice

  const handleWhatsApp = () => {
    if (!meetsMinimum) return
    const msg = encodeURIComponent(buildWhatsAppMessage(cart, totalPrice))
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'rgba(6, 13, 8, 0.97)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
          <h2 className="font-bold text-lg text-white">Tu Pedido</h2>
          <button onClick={() => setIsOpen(false)} className="glass glass-hover p-2 rounded-xl cursor-pointer text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <span className="text-5xl mb-4">🧉</span>
              <p className="text-gray-400 font-medium">Tu pedido está vacío</p>
              <p className="text-sm text-gray-600 mt-1">Explorá el catálogo y agregá productos</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartId} className="glass rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                    {/* Color + variation tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {item.selectedColor && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <span className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20" style={{ backgroundColor: item.selectedColor.hex }} />
                          {item.selectedColor.name}
                        </span>
                      )}
                      {item.selectedVariation?.name && (
                        <span className="text-xs text-gray-400 glass px-2 py-0.5 rounded-full">
                          {item.selectedVariation.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">${item.price.toLocaleString('es-AR')} c/u</p>
                  </div>
                  <button onClick={() => removeFromCart(item.cartId)} className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0 mt-0.5">
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.cartId, item.qty - 1)} className="w-7 h-7 glass glass-hover rounded-lg flex items-center justify-center cursor-pointer text-gray-400 hover:text-white">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold text-white w-8 text-center tabular-nums">{item.qty}</span>
                    <button onClick={() => updateQty(item.cartId, item.qty + 1)} className="w-7 h-7 glass glass-hover rounded-lg flex items-center justify-center cursor-pointer text-gray-400 hover:text-white">
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-green-400">
                    ${(item.price * item.qty).toLocaleString('es-AR')}
                  </span>
                </div>

                {item.qty < item.minQty && (
                  <p className="text-xs text-amber-400/80 mt-2">⚠ Mínimo {item.minQty} {item.unit}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Total</span>
              <span className="text-xl font-bold text-white">${totalPrice.toLocaleString('es-AR')}</span>
            </div>

            {/* Minimum order progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className={meetsMinimum ? 'text-green-400' : 'text-gray-500'}>
                  Compra mínima ${MIN_ORDER.toLocaleString('es-AR')}
                </span>
                {!meetsMinimum && (
                  <span className="text-amber-400">
                    Faltan ${remaining.toLocaleString('es-AR')}
                  </span>
                )}
                {meetsMinimum && <span className="text-green-400 font-medium">✓ Cumplida</span>}
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${meetsMinimum ? 'bg-green-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min((totalPrice / MIN_ORDER) * 100, 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleWhatsApp}
              disabled={!meetsMinimum}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all cursor-pointer text-white ${
                meetsMinimum
                  ? 'opacity-100 hover:brightness-110'
                  : 'opacity-40 cursor-not-allowed'
              }`}
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle size={20} />
              Enviar Pedido por WhatsApp
            </button>
            <p className="text-xs text-gray-600 text-center mt-2.5">
              {meetsMinimum
                ? 'Se abrirá WhatsApp con tu pedido listo para enviar'
                : `Agregá $${remaining.toLocaleString('es-AR')} más para completar el mínimo`}
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
