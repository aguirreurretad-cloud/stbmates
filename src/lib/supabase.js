import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Sube una imagen comprimida (dataURL) al bucket y devuelve la URL pública
export async function uploadImage(dataUrl, folder = 'general') {
  const blob = await (await fetch(dataUrl)).blob()
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
  const { error } = await supabase.storage
    .from('images')
    .upload(filename, blob, { contentType: 'image/jpeg', upsert: false })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filename)
  return publicUrl
}

// Convierte fila de DB → producto app
export const dbToProduct = p => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  minQty: p.min_qty,
  unit: p.unit,
  description: p.description,
  image: p.image,
  images: p.images || [],
  colors: p.colors || [],
  variations: p.variations || [],
  inStock: p.in_stock,
})

// Convierte producto app → fila de DB
export const productToDb = p => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  min_qty: p.minQty || 0,
  unit: p.unit || 'unidades',
  description: p.description || '',
  image: p.image || '',
  images: p.images || [],
  colors: p.colors || [],
  variations: p.variations || [],
  in_stock: p.inStock !== false,
})
