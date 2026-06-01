import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, dbToProduct, productToDb } from '../lib/supabase'
import { defaultProducts } from '../data/products'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id')
    if (error) { console.error('Supabase load error:', error); setLoading(false); return }

    if (!data || data.length === 0) {
      // Primera vez: sembrar con productos por defecto
      const rows = defaultProducts.map(productToDb)
      await supabase.from('products').insert(rows)
      setProducts(defaultProducts)
    } else {
      setProducts(data.map(dbToProduct))
    }
    setLoading(false)
  }

  const addProduct = async (p) => {
    const item = { ...p, id: Date.now() }
    await supabase.from('products').insert([productToDb(item)])
    setProducts(prev => [...prev, item])
  }

  const updateProduct = async (id, p) => {
    const updated = { ...products.find(x => x.id === id), ...p }
    await supabase.from('products').update(productToDb(updated)).eq('id', id)
    setProducts(prev => prev.map(x => x.id === id ? updated : x))
  }

  const deleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(x => x.id !== id))
  }

  const resetProducts = async () => {
    await supabase.from('products').delete().neq('id', 0)
    const rows = defaultProducts.map(productToDb)
    await supabase.from('products').insert(rows)
    setProducts(defaultProducts)
  }

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, resetProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => useContext(ProductsContext)
