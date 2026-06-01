import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { ProductsProvider } from './context/ProductsContext'
import Navbar from './components/Navbar'
import CartSidebar from './components/CartSidebar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Admin from './pages/Admin'
import About from './pages/About'
import References from './pages/References'
import { ReferencesProvider } from './context/ReferencesContext'

export default function App() {
  return (
    <ProductsProvider>
      <ReferencesProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <CartSidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/referencias" element={<References />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </CartProvider>
      </ReferencesProvider>
    </ProductsProvider>
  )
}
