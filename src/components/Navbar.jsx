import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { STORE_NAME } from '../config'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/referencias', label: 'Referencias' },
  { to: '/nosotros', label: 'Nosotros' },
]

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt={STORE_NAME}
              className="h-10 w-10 object-contain transition-opacity duration-200 group-hover:opacity-80"
              style={{ filter: 'invert(1)' }}
            />
            <span className="font-bold text-lg text-white group-hover:text-green-400 transition-colors">
              {STORE_NAME}
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2 glass glass-hover px-4 py-2 rounded-xl cursor-pointer"
            >
              <ShoppingCart size={17} className="text-gray-300" />
              <span className="text-sm text-gray-300 hidden sm:inline">Pedido</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold leading-none">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden glass glass-hover p-2 rounded-xl cursor-pointer"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/[0.06] px-6 py-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 text-sm font-medium ${
                location.pathname === link.to ? 'text-green-400' : 'text-gray-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
