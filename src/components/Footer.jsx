import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER, STORE_NAME, STORE_TAGLINE } from '../config'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.06] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">

          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/logo.png"
                alt={STORE_NAME}
                className="h-10 w-10 object-contain opacity-80"
                style={{ filter: 'invert(1)' }}
              />
              <span className="font-bold text-white text-lg">{STORE_NAME}</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{STORE_TAGLINE}</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Navegación</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="text-sm text-gray-500 hover:text-white transition-colors">Inicio</Link>
              <Link to="/catalogo" className="text-sm text-gray-500 hover:text-white transition-colors">Catálogo</Link>
              <Link to="/referencias" className="text-sm text-gray-500 hover:text-white transition-colors">Referencias</Link>
              <Link to="/nosotros" className="text-sm text-gray-500 hover:text-white transition-colors">Nosotros</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contacto</h4>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#25D366] transition-colors"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-6 text-center">
          <p className="text-xs text-gray-700">
            © {new Date().getFullYear()} {STORE_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
