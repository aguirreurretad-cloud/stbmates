import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { defaultTestimonials } from '../data/references'

const Ctx = createContext(null)

export function ReferencesProvider({ children }) {
  const [testimonials,  setTestimonials]  = useState([])
  const [screenshots,   setScreenshots]   = useState([])
  const [celebrities,   setCelebrities]   = useState([])

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    const [t, s, c] = await Promise.all([
      supabase.from('testimonials').select('*').order('id'),
      supabase.from('screenshots').select('*').order('is_reseller', { ascending: false }).order('id'),
      supabase.from('celebrities').select('*').order('id'),
    ])

    // Sembrar testimonios por defecto si está vacío
    if (!t.data?.length) {
      const rows = defaultTestimonials.map(x => ({ id: x.id, name: x.name, business: x.business, city: x.city, comment: x.comment, image: x.image || '' }))
      await supabase.from('testimonials').insert(rows)
      setTestimonials(defaultTestimonials)
    } else {
      setTestimonials(t.data || [])
    }

    setScreenshots(s.data || [])
    setCelebrities(c.data || [])
  }

  // Testimonials
  const addTestimonial = async (item) => {
    const row = { ...item, id: Date.now() }
    await supabase.from('testimonials').insert([row])
    setTestimonials(p => [...p, row])
  }
  const updateTestimonial = async (id, item) => {
    await supabase.from('testimonials').update(item).eq('id', id)
    setTestimonials(p => p.map(x => x.id === id ? { ...x, ...item } : x))
  }
  const deleteTestimonial = async (id) => {
    await supabase.from('testimonials').delete().eq('id', id)
    setTestimonials(p => p.filter(x => x.id !== id))
  }

  // Screenshots
  const addScreenshot = async (item) => {
    const row = { ...item, id: Date.now() }
    await supabase.from('screenshots').insert([row])
    setScreenshots(p => [...p, row])
  }
  const deleteScreenshot = async (id) => {
    await supabase.from('screenshots').delete().eq('id', id)
    setScreenshots(p => p.filter(x => x.id !== id))
  }

  // Celebrities
  const addCelebrity = async (item) => {
    const row = { ...item, id: Date.now() }
    await supabase.from('celebrities').insert([row])
    setCelebrities(p => [...p, row])
  }
  const updateCelebrity = async (id, item) => {
    await supabase.from('celebrities').update(item).eq('id', id)
    setCelebrities(p => p.map(x => x.id === id ? { ...x, ...item } : x))
  }
  const deleteCelebrity = async (id) => {
    await supabase.from('celebrities').delete().eq('id', id)
    setCelebrities(p => p.filter(x => x.id !== id))
  }

  return (
    <Ctx.Provider value={{
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      screenshots, addScreenshot, deleteScreenshot,
      celebrities, addCelebrity, updateCelebrity, deleteCelebrity,
      loadAll,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useReferences = () => useContext(Ctx)
