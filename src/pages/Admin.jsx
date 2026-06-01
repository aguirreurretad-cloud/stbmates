import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Eye, EyeOff, LogOut, RotateCcw, Upload } from 'lucide-react'
import { useProducts } from '../context/ProductsContext'
import { ADMIN_PASSWORD } from '../config'
import { CATEGORIES } from '../data/products'
import ProductImage from '../components/ProductImage'
import { uploadImage } from '../lib/supabase'
import { useReferences } from '../context/ReferencesContext'
import ImageUploader from '../components/ImageUploader'

const cats = CATEGORIES.filter(c => c.id !== 'todos')
const catLabel = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]))

const emptyForm = {
  name: '', category: 'calabaza', price: '',
  minQty: '0', unit: 'unidades', description: '',
  images: [], colors: [], variations: [],
}

const normalizeVar = v => typeof v === 'string' ? { name: v, price: 0 } : v

function ProductModal({ product, onSave, onClose }) {
  const initImages = product?.images?.length > 0
    ? product.images
    : product?.image ? [product.image] : []

  const [form, setForm] = useState(
    product
      ? { ...product, price: String(product.price), minQty: String(product.minQty),
          images: initImages,
          colors: product.colors || [],
          variations: (product.variations || []).map(normalizeVar) }
      : emptyForm
  )

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const [uploadingImages, setUploadingImages] = useState(false)

  const compress = (file, maxPx = 1200) => new Promise(resolve => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      let w = img.width, h = img.height
      if (w > maxPx || h > maxPx) {
        if (w > h) { h = Math.round(h * maxPx / w); w = maxPx }
        else       { w = Math.round(w * maxPx / h); h = maxPx }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.78))
    }
    img.src = url
  })

  const addImagesFromFiles = async (files) => {
    setUploadingImages(true)
    try {
      const urls = await Promise.all(
        [...files].map(async f => {
          const dataUrl = await compress(f)
          return uploadImage(dataUrl, 'products')
        })
      )
      set('images', [...form.images, ...urls])
    } catch (err) {
      alert('Error al subir imagen: ' + err.message)
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (i) => set('images', form.images.filter((_, idx) => idx !== i))
  const addImageUrl = (url) => { if (url.trim()) set('images', [...form.images, url.trim()]) }

  // Colors helpers
  const addColor = () => set('colors', [...form.colors, { name: '', hex: '#22c55e' }])
  const removeColor = (i) => set('colors', form.colors.filter((_, idx) => idx !== i))
  const updateColor = (i, field, val) => set('colors', form.colors.map((c, idx) => idx === i ? { ...c, [field]: val } : c))

  // Variations helpers
  const addVariation = () => set('variations', [...form.variations, { name: '', price: 0 }])
  const removeVariation = (i) => set('variations', form.variations.filter((_, idx) => idx !== i))
  const updateVariation = (i, field, val) => set('variations', form.variations.map((v, idx) => idx === i ? { ...v, [field]: val } : v))

  const [urlInput, setUrlInput] = useState('')

  const [formError, setFormError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim())        return setFormError('El nombre es obligatorio.')
    if (!form.price && form.price !== '0') return setFormError('El precio es obligatorio.')
    setFormError('')
    try {
      onSave({
        ...form,
        price:    Number(form.price)  || 0,
        minQty:   Number(form.minQty) || 0,
        image:    form.images[0] || '',
        images:   form.images,
        colors:   form.colors.filter(c => c.name && c.hex),
        variations: form.variations
          .filter(v => v?.name?.trim())
          .map(v => ({ name: v.name.trim(), price: Number(v.price) || 0 })),
      })
    } catch (err) {
      setFormError('Error al guardar: ' + err.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto border border-white/[0.1]">

        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
          <h2 className="font-bold text-lg text-white">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="glass glass-hover p-2 rounded-xl cursor-pointer text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 block">Nombre *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              className="input-field" placeholder="Mate Calabaza Natural" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 block">Categoría *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="input-field" style={{ background: 'rgba(6,13,8,0.9)' }}>
                {cats.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 block">Precio ARS *</label>
              <input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)}
                className="input-field" placeholder="2800" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 block">Cant. mínima *</label>
              <input type="number" min="0" value={form.minQty} onChange={e => set('minQty', e.target.value)}
                className="input-field" placeholder="0" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 block">Unidad</label>
              <input value={form.unit} onChange={e => set('unit', e.target.value)}
                className="input-field" placeholder="unidades" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-500 uppercase tracking-wide">Imágenes</label>
              <span className="text-xs text-gray-600">{form.images.length} foto{form.images.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Grid de fotos actuales */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group h-24 rounded-xl overflow-hidden border border-white/[0.08]">
                    <ProductImage src={img} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full">Principal</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded-lg cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Subir archivo */}
            <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-white/20 hover:border-green-500/50 hover:bg-green-500/5 text-gray-400 hover:text-green-400 text-sm cursor-pointer transition-all mb-2">
              <Upload size={16} />
              Subir foto desde mi computadora
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={e => addImagesFromFiles(e.target.files)} />
            </label>

            {/* Por URL */}
            <div className="flex gap-2">
              <input
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                className="input-field"
                placeholder="O pegá una URL: https://..."
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl(urlInput); setUrlInput('') } }}
              />
              <button type="button" onClick={() => { addImageUrl(urlInput); setUrlInput('') }}
                className="glass glass-hover px-3 rounded-xl text-green-400 cursor-pointer text-sm font-medium flex-shrink-0">
                + Agregar
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 block">Descripción</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={3} className="input-field resize-none"
              placeholder="Descripción breve del producto..." />
          </div>

          {/* Colors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-500 uppercase tracking-wide">Colores disponibles</label>
              <button type="button" onClick={addColor} className="text-xs text-green-400 hover:text-green-300 cursor-pointer flex items-center gap-1">
                <Plus size={13} /> Agregar color
              </button>
            </div>
            {form.colors.length === 0 && (
              <p className="text-xs text-gray-600 italic">Sin colores — se muestra el producto sin selector de color.</p>
            )}
            <div className="space-y-2">
              {form.colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={e => updateColor(i, 'hex', e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border border-white/10 bg-transparent flex-shrink-0"
                  />
                  <input
                    value={c.name}
                    onChange={e => updateColor(i, 'name', e.target.value)}
                    className="input-field"
                    placeholder="Nombre del color (ej: Natural)"
                  />
                  <button type="button" onClick={() => removeColor(i)} className="text-gray-600 hover:text-red-400 cursor-pointer flex-shrink-0">
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Variations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-500 uppercase tracking-wide">Variaciones</label>
              <button type="button" onClick={addVariation} className="text-xs text-green-400 hover:text-green-300 cursor-pointer flex items-center gap-1">
                <Plus size={13} /> Agregar variación
              </button>
            </div>
            {form.variations.length === 0 && (
              <p className="text-xs text-gray-600 italic">Sin variaciones — ej: Virola Lisa, Grande, Con bombilla…</p>
            )}
            {form.variations.length > 0 && (
              <div className="grid grid-cols-2 gap-1 mb-1.5">
                <span className="text-xs text-gray-600 pl-1">Nombre</span>
                <span className="text-xs text-gray-600 pl-1">Precio (0 = usar precio base)</span>
              </div>
            )}
            <div className="space-y-2">
              {form.variations.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={v.name}
                    onChange={e => updateVariation(i, 'name', e.target.value)}
                    className="input-field"
                    placeholder="Ej: Virola Lisa"
                  />
                  <input
                    type="number"
                    min="0"
                    value={v.price || ''}
                    onChange={e => updateVariation(i, 'price', e.target.value)}
                    className="input-field w-28 flex-shrink-0"
                    placeholder="0"
                  />
                  <button type="button" onClick={() => removeVariation(i)} className="text-gray-600 hover:text-red-400 cursor-pointer flex-shrink-0">
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {formError && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
              {formError}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancelar</button>
            <button type="submit" className="btn-primary flex-1">
              {product ? 'Guardar Cambios' : 'Agregar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Ref modal (testimonial o client) ────────────────────────────────────────
function RefModal({ type, item, onSave, onClose }) {
  const defaults = {
    testimonial: { name: '', business: '', city: '', comment: '', image: '' },
    celebrity:   { name: '', description: '', image: '' },
  }
  const [form, setForm] = useState(item || defaults[type] || defaults.testimonial)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const titles = { testimonial: 'Testimonio', celebrity: 'Figura pública' }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-md border border-white/[0.1]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
          <h2 className="font-bold text-white">{item ? 'Editar' : 'Nuevo/a'} {titles[type]}</h2>
          <button onClick={onClose} className="glass glass-hover p-2 rounded-xl cursor-pointer text-gray-400 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-3">
          <ImageUploader
            value={form.image}
            onChange={v => set('image', v)}
            label="Foto"
            shape={type === 'celebrity' ? 'square' : 'circle'}
          />
          <input value={form.name} onChange={e => set('name', e.target.value)} className="input-field"
            placeholder={type === 'celebrity' ? 'Nombre de la persona famosa' : 'Nombre'} />

          {type === 'testimonial' && <>
            <input value={form.business} onChange={e => set('business', e.target.value)} className="input-field" placeholder="Negocio / Emprendimiento" />
            <input value={form.city} onChange={e => set('city', e.target.value)} className="input-field" placeholder="Ciudad" />
            <textarea value={form.comment} onChange={e => set('comment', e.target.value)}
              rows={3} className="input-field resize-none" placeholder="Comentario…" />
          </>}

          {type === 'celebrity' &&
            <input value={form.description || ''} onChange={e => set('description', e.target.value)} className="input-field"
              placeholder="Descripción corta (ej: Cantante, Futbolista…)" />
          }

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-outline flex-1 cursor-pointer">Cancelar</button>
            <button onClick={() => { if (form.name.trim()) onSave(form) }} className="btn-primary flex-1 cursor-pointer">
              {item ? 'Guardar' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Panel de Referencias ─────────────────────────────────────────────────────
function ReferencesPanel({ testimonials, screenshots, celebrities, onAddTestimonial, onEditTestimonial, onDeleteTestimonial, onAddScreenshot, onDeleteScreenshot, onAddCelebrity, onEditCelebrity, onDeleteCelebrity }) {
  return (
    <div className="space-y-8">

      {/* Figuras públicas / famosos */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <h3 className="font-semibold text-white">⭐ Figuras públicas ({celebrities.length})</h3>
          <button onClick={onAddCelebrity} className="btn-primary gap-1.5 py-2 px-4 text-sm cursor-pointer"><Plus size={15} /> Agregar</button>
        </div>
        {celebrities.length === 0
          ? <p className="text-gray-600 text-sm px-6 py-8 text-center italic">Agregá fotos con personas famosas que tienen mates STB.</p>
          : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
              {celebrities.map(c => (
                <div key={c.id} className="relative group rounded-xl overflow-hidden border border-white/[0.08]">
                  <div className="aspect-square bg-white/[0.03]">
                    <ProductImage src={c.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2">
                    <p className="text-white text-xs font-semibold truncate">{c.name}</p>
                    {c.description && <p className="text-gray-500 text-xs truncate">{c.description}</p>}
                  </div>
                  <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEditCelebrity(c)} className="bg-black/70 hover:bg-white/20 text-white p-1.5 rounded-lg cursor-pointer"><Pencil size={12} /></button>
                    <button onClick={() => onDeleteCelebrity(c.id)} className="bg-black/70 hover:bg-red-500 text-white p-1.5 rounded-lg cursor-pointer"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>

      {/* Testimonios */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <h3 className="font-semibold text-white">Testimonios ({testimonials.length})</h3>
          <button onClick={onAddTestimonial} className="btn-primary gap-1.5 py-2 px-4 text-sm cursor-pointer"><Plus size={15} /> Agregar</button>
        </div>
        {testimonials.length === 0
          ? <p className="text-gray-600 text-sm px-6 py-8 text-center italic">Sin testimonios aún.</p>
          : <div className="divide-y divide-white/[0.04]">
              {testimonials.map(t => (
                <div key={t.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-white/[0.02]">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-green-500/10 overflow-hidden border border-white/[0.08] flex-shrink-0 flex items-center justify-center">
                      {t.image
                        ? <ProductImage src={t.image} className="w-full h-full object-cover" />
                        : <span className="text-sm font-semibold text-green-400">{t.name.charAt(0)}</span>
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{t.name} <span className="text-gray-500 font-normal">· {t.business}</span></p>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">"{t.comment}"</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => onEditTestimonial(t)} className="glass glass-hover p-2 rounded-lg cursor-pointer text-gray-500 hover:text-white"><Pencil size={14} /></button>
                    <button onClick={() => onDeleteTestimonial(t.id)} className="glass glass-hover p-2 rounded-lg cursor-pointer text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>

      {/* Screenshots */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <h3 className="font-semibold text-white">Screenshots de clientes felices ({screenshots.length})</h3>
          <label className="btn-primary gap-1.5 py-2 px-4 text-sm cursor-pointer inline-flex items-center">
            <Plus size={15} /> Subir screenshot
            <input type="file" accept="image/*" multiple className="hidden"
              onChange={async e => {
                for (const file of [...(e.target.files || [])]) {
                  const img = new Image()
                  const url = URL.createObjectURL(file)
                  await new Promise(res => {
                    img.onload = async () => {
                      const MAX = 1400
                      let w = img.width, h = img.height
                      if (w > MAX) { h = Math.round(h * MAX / w); w = MAX }
                      const canvas = document.createElement('canvas')
                      canvas.width = w; canvas.height = h
                      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
                      URL.revokeObjectURL(url)
                      const { uploadImage } = await import('../lib/supabase')
                      const data = canvas.toDataURL('image/jpeg', 0.82)
                      const publicUrl = await uploadImage(data, 'screenshots')
                      onAddScreenshot({ image: publicUrl, caption: '' })
                      res()
                    }
                    img.src = url
                  })
                }
              }}
            />
          </label>
        </div>
        {screenshots.length === 0
          ? <p className="text-gray-600 text-sm px-6 py-8 text-center italic">Sin screenshots. Subí capturas de WhatsApp, Instagram, etc.</p>
          : <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-4">
              {screenshots.map(s => (
                <div key={s.id} className="relative group rounded-xl overflow-hidden border border-white/[0.08] aspect-[9/16]">
                  <ProductImage src={s.image} className="w-full h-full object-cover" />
                  <button
                    onClick={() => onDeleteScreenshot(s.id)}
                    className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-500 text-white p-1.5 rounded-lg cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
        }
      </div>

    </div>
  )
}

function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-sm w-full text-center border border-white/[0.1]">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="font-bold text-white text-lg mb-2">¿Eliminar producto?</h3>
        <p className="text-gray-500 text-sm mb-6">Esta acción no se puede deshacer.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-outline flex-1">Cancelar</button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl font-semibold cursor-pointer transition-all border border-red-500/40 bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useProducts()
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial, screenshots, addScreenshot, deleteScreenshot, celebrities, addCelebrity, updateCelebrity, deleteCelebrity } = useReferences()
  const [tab, setTab] = useState('productos') // 'productos' | 'referencias'
  const [confirmReset, setConfirmReset] = useState(false)
  const [auth, setAuth] = useState(false)
  const [pwd, setPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [pwdError, setPwdError] = useState('')
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // Referencias state
  const [refModal, setRefModal] = useState(null) // null | { type: 'testimonial', data: obj|null }
  const [refDeleteId, setRefDeleteId] = useState(null) // null | { type, id }

  const handleLogin = (e) => {
    e.preventDefault()
    if (pwd === ADMIN_PASSWORD) { setAuth(true); setPwdError('') }
    else setPwdError('Contraseña incorrecta')
  }

  const handleSave = (data) => {
    if (modal === 'add') addProduct(data)
    else updateProduct(modal.id, data)
    setModal(null)
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="glass rounded-2xl p-8 w-full max-w-sm border border-white/[0.1]">
          <div className="text-center mb-7">
            <span className="text-4xl">🔐</span>
            <h2 className="text-xl font-bold text-white mt-3">Panel de Administración</h2>
            <p className="text-gray-500 text-sm mt-1">Ingresá tu contraseña para continuar</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                className="input-field pr-12"
                placeholder="Contraseña"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
              >
                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {pwdError && <p className="text-red-400 text-sm">{pwdError}</p>}
            <button type="submit" className="btn-primary w-full">Ingresar</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[['productos', '📦 Productos'], ['referencias', '⭐ Referencias']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all border ${
                tab === id ? 'bg-green-500 border-green-500 text-white' : 'glass glass-hover border-white/[0.08] text-gray-400'
              }`}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {tab === 'productos' ? 'Panel de Admin' : 'Referencias y Clientes'}
            </h1>
            <p className="text-gray-500 mt-1">
              {tab === 'productos' ? `${products.length} productos en catálogo` : `${testimonials.length} testimonios · ${screenshots.length} screenshots`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModal('add')}
              className="btn-primary gap-2"
            >
              <Plus size={18} /> Nuevo Producto
            </button>
            <button
              onClick={() => setConfirmReset(true)}
              className="glass glass-hover p-3 rounded-xl cursor-pointer text-gray-500 hover:text-amber-400"
              title="Resetear catálogo"
            >
              <RotateCcw size={17} />
            </button>
            <button
              onClick={() => setAuth(false)}
              className="glass glass-hover p-3 rounded-xl cursor-pointer text-gray-500 hover:text-white"
              title="Cerrar sesión"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>

        {tab === 'referencias' && (
          <ReferencesPanel
            testimonials={testimonials}
            screenshots={screenshots}
            celebrities={celebrities}
            onAddTestimonial={() => setRefModal({ type: 'testimonial', data: null })}
            onEditTestimonial={t => setRefModal({ type: 'testimonial', data: t })}
            onDeleteTestimonial={id => setRefDeleteId({ type: 'testimonial', id })}
            onAddScreenshot={addScreenshot}
            onDeleteScreenshot={id => setRefDeleteId({ type: 'screenshot', id })}
            onAddCelebrity={() => setRefModal({ type: 'celebrity', data: null })}
            onEditCelebrity={c => setRefModal({ type: 'celebrity', data: c })}
            onDeleteCelebrity={id => setRefDeleteId({ type: 'celebrity', id })}
          />
        )}

        {tab === 'productos' && <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  {['Producto', 'Categoría', 'Precio', 'Mínimo', ''].map(h => (
                    <th key={h} className={`text-xs text-gray-600 font-medium uppercase tracking-wider px-6 py-4 ${h === '' ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{p.name}</div>
                      {p.description && (
                        <div className="text-xs text-gray-600 mt-0.5 max-w-xs truncate">{p.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="glass text-xs text-gray-400 px-2.5 py-1 rounded-full">
                        {catLabel[p.category] || p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-400">
                      ${p.price.toLocaleString('es-AR')}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {p.minQty} {p.unit}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Toggle stock */}
                        <button
                          onClick={() => updateProduct(p.id, { inStock: p.inStock === false ? true : false })}
                          title={p.inStock === false ? 'Marcar con stock' : 'Marcar sin stock'}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-all border ${
                            p.inStock === false
                              ? 'bg-red-500/15 border-red-500/40 text-red-400 hover:bg-red-500/25'
                              : 'glass glass-hover border-white/[0.08] text-green-400 hover:border-green-500/40'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${p.inStock === false ? 'bg-red-400' : 'bg-green-400'}`} />
                          {p.inStock === false ? 'Sin stock' : 'Con stock'}
                        </button>
                        <button
                          onClick={() => setModal(p)}
                          className="glass glass-hover p-2 rounded-lg cursor-pointer text-gray-500 hover:text-white"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="glass glass-hover p-2 rounded-lg cursor-pointer text-gray-500 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>}
      </div>

      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {deleteId && (
        <DeleteConfirm
          onConfirm={() => { deleteProduct(deleteId); setDeleteId(null) }}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Modals de referencias */}
      {refModal && (
        <RefModal
          type={refModal.type}
          item={refModal.data}
          onSave={data => {
            if (refModal.type === 'celebrity') {
              refModal.data ? updateCelebrity(refModal.data.id, data) : addCelebrity(data)
            } else {
              refModal.data ? updateTestimonial(refModal.data.id, data) : addTestimonial(data)
            }
            setRefModal(null)
          }}
          onClose={() => setRefModal(null)}
        />
      )}
      {refDeleteId && (
        <DeleteConfirm
          onConfirm={() => {
            if (refDeleteId.type === 'testimonial') deleteTestimonial(refDeleteId.id)
            else if (refDeleteId.type === 'celebrity') deleteCelebrity(refDeleteId.id)
            else deleteScreenshot(refDeleteId.id)
            setRefDeleteId(null)
          }}
          onCancel={() => setRefDeleteId(null)}
        />
      )}

      {confirmReset && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 max-w-sm w-full text-center border border-white/[0.1]">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="font-bold text-white text-lg mb-2">¿Resetear catálogo?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Se van a cargar los <strong className="text-white">42 productos originales</strong> del catálogo. Los cambios manuales se perderán.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmReset(false)} className="btn-outline flex-1">Cancelar</button>
              <button
                onClick={() => { resetProducts(); setConfirmReset(false) }}
                className="flex-1 py-3 rounded-xl font-semibold cursor-pointer transition-all border border-amber-500/40 bg-amber-500/15 text-amber-400 hover:bg-amber-500 hover:text-white hover:border-amber-500"
              >
                Resetear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
