import { useState, useEffect } from 'react'
import { supabase, uploadImage } from '../lib/supabase'

const DB = 'mateas_imgs'
const STORE = 'imgs'

const PRODUCTS = [
  { id: 1,  name: 'Combo Arranque' },
  { id: 2,  name: 'Combo Emprendedor' },
  { id: 3,  name: 'Combo Emprendedor Plus' },
  { id: 4,  name: 'Combo Tablas Argentina' },
  { id: 5,  name: 'Imperial de Alpaca' },
  { id: 6,  name: 'Imperial Base de Alpaca' },
  { id: 7,  name: 'Imperial Roma Alpaca' },
  { id: 8,  name: 'Imperial Argentina Virola Lisa' },
  { id: 9,  name: 'Imperial Argentina Base + Aplique' },
  { id: 10, name: 'Imperial de Alpaca Repujado' },
  { id: 11, name: 'Torpedo de Alpaca' },
  { id: 12, name: 'Torpedo Argentina Virola Lisa' },
  { id: 13, name: 'Torpedo de Alpaca Repujado' },
  { id: 14, name: 'Camionero Interior Deluxe' },
  { id: 15, name: 'Camionero de Alpaca Cincelada' },
  { id: 16, name: 'Imperial de Acero Virola Fleje' },
  { id: 17, name: 'Torpedo de Acero' },
  { id: 18, name: 'Camionero de Acero' },
  { id: 19, name: 'Imperial Algarrobo Virola Acero' },
  { id: 20, name: 'Imperial Algarrobo Virola Alpaca' },
  { id: 21, name: 'Ranchero' },
  { id: 22, name: 'Mate Galleta' },
  { id: 23, name: 'Canasta Cuero' },
  { id: 24, name: 'Termo Media Manija' },
  { id: 25, name: 'Pico de Loro Inox' },
  { id: 26, name: 'Pico de Loro Inox PB' },
  { id: 27, name: 'Pico de Loro Cinc' },
  { id: 28, name: 'Pico de Loro Espejada' },
  { id: 29, name: 'Pico de Loro Torneada' },
  { id: 30, name: 'Pico de Loro Inox Silicona' },
  { id: 31, name: 'Pico de Loro Torneada Alpaca' },
  { id: 32, name: 'Chata Simple' },
  { id: 33, name: 'Chata Doble Anillo' },
  { id: 34, name: 'Curva Inox / Pico Bronce Resorte' },
  { id: 35, name: 'Alpaca Lisa' },
  { id: 36, name: 'Alpaca Cincelada' },
  { id: 37, name: 'Bombillón Alpaca Lisa' },
  { id: 38, name: 'Bombillón Alpaca Cincelada' },
  { id: 39, name: 'Bombillón PL Inox' },
  { id: 40, name: 'PL Alpaca Doble Anillo' },
  { id: 41, name: 'Bombillón Alpaca Cincelada Escudo' },
  { id: 42, name: 'Bombillón Alpaca con Anillo' },
]

function getAllFromIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) return resolve([])
      const tx = db.transaction(STORE, 'readonly')
      const store = tx.objectStore(STORE)
      const entries = []
      const cursor = store.openCursor()
      cursor.onsuccess = e => {
        const c = e.target.result
        if (c) { entries.push({ key: c.key, value: c.value }); c.continue() }
        else resolve(entries)
      }
      cursor.onerror = () => reject(cursor.error)
    }
  })
}

// ── Tab 1: carga masiva desde disco ──────────────────────────────────────────
function UploadTab() {
  const [files, setFiles] = useState([])   // { id, previewUrl, file, status: 'pending'|'uploading'|'done'|'error', url }
  const [dragging, setDragging] = useState(false)

  const addFiles = (incoming) => {
    const entries = [...incoming].map(f => ({
      id: Math.random().toString(36).slice(2),
      previewUrl: URL.createObjectURL(f),
      file: f,
      status: 'pending',
      url: null,
    }))
    setFiles(prev => [...prev, ...entries])
  }

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

  const uploadAll = async () => {
    const pending = files.filter(f => f.status === 'pending')
    if (!pending.length) return

    setFiles(prev => prev.map(f => f.status === 'pending' ? { ...f, status: 'uploading' } : f))

    await Promise.all(pending.map(async entry => {
      try {
        const dataUrl = await compress(entry.file)
        const url = await uploadImage(dataUrl, 'recovered')
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'done', url } : f))
      } catch {
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'error' } : f))
      }
    }))
  }

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id))

  const done = files.filter(f => f.status === 'done').length
  const uploading = files.filter(f => f.status === 'uploading').length
  const pending = files.filter(f => f.status === 'pending').length

  return (
    <div>
      {/* Drop zone */}
      <label
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
        className={`flex flex-col items-center justify-center gap-3 w-full py-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all mb-6 ${
          dragging ? 'border-green-400 bg-green-500/10' : 'border-white/20 hover:border-green-500/50 hover:bg-green-500/5'
        }`}
      >
        <span className="text-4xl">📁</span>
        <p className="text-white font-semibold">Arrastrá las fotos acá o hacé click para elegir</p>
        <p className="text-gray-500 text-sm">Podés seleccionar 50, 100, las que quieras — todas suben en paralelo</p>
        <input type="file" accept="image/*" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
      </label>

      {files.length > 0 && (
        <>
          <div className="flex items-center gap-4 mb-6">
            <button onClick={uploadAll} disabled={!pending && !uploading}
              className="bg-green-500 hover:bg-green-400 disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer">
              {uploading > 0 ? `Subiendo ${uploading}...` : `Subir ${pending} fotos a Supabase`}
            </button>
            <span className="text-gray-400 text-sm">
              {done > 0 && <span className="text-green-400">{done} subidas ✓  </span>}
              {files.length} fotos en total
            </span>
            {done === files.length && done > 0 && (
              <span className="text-green-400 font-semibold text-sm">¡Listo! Andá a la pestaña "Asignar imágenes"</span>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {files.map(f => (
              <div key={f.id} className={`relative rounded-xl overflow-hidden border ${
                f.status === 'done' ? 'border-green-500/50' :
                f.status === 'error' ? 'border-red-500/50' :
                f.status === 'uploading' ? 'border-yellow-500/50' :
                'border-white/10'
              }`}>
                <div className="aspect-square bg-white/5">
                  <img src={f.previewUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {f.status === 'uploading' && (
                    <div className="bg-black/60 rounded-full p-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {f.status === 'done' && (
                    <div className="bg-green-500/80 rounded-full p-1.5">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {f.status === 'error' && (
                    <div className="bg-red-500/80 rounded-full p-1.5 text-white text-xs font-bold">✗</div>
                  )}
                </div>
                {f.status === 'pending' && (
                  <button onClick={() => removeFile(f.id)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer">
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Tab 2: asignar imágenes a productos ──────────────────────────────────────
function AssignTab() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null) // product id
  const [assignments, setAssignments] = useState({})  // productId → url[]
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.storage.from('images').list('recovered', { limit: 500, sortBy: { column: 'created_at', order: 'asc' } })
      .then(({ data, error }) => {
        if (error || !data) { setLoading(false); return }
        setImages(data.map(f => supabase.storage.from('images').getPublicUrl(`recovered/${f.name}`).data.publicUrl))
        setLoading(false)
      })
  }, [])

  const toggleImage = (url) => {
    if (!selectedProduct) return
    setAssignments(prev => {
      const current = prev[selectedProduct] || []
      const already = current.includes(url)
      return { ...prev, [selectedProduct]: already ? current.filter(x => x !== url) : [...current, url] }
    })
  }

  const saveAll = async () => {
    setSaving(true)
    try {
      await Promise.all(
        Object.entries(assignments)
          .filter(([, urls]) => urls.length > 0)
          .map(([id, urls]) =>
            supabase.from('products').update({ image: urls[0], images: urls }).eq('id', Number(id))
          )
      )
      setSaved(true)
    } catch (err) { alert('Error guardando: ' + err.message) }
    finally { setSaving(false) }
  }

  const assignedProducts = new Set(Object.entries(assignments).filter(([, v]) => v.length > 0).map(([k]) => Number(k)))
  const selectedAssigned = selectedProduct ? (assignments[selectedProduct] || []) : []
  const totalAssigned = Object.values(assignments).filter(v => v.length > 0).length

  if (loading) return <p className="text-gray-400 py-8">Cargando imágenes de Supabase...</p>

  if (images.length === 0) return (
    <div className="text-center py-16">
      <div className="text-4xl mb-4">📭</div>
      <p className="text-white font-semibold">No hay imágenes subidas todavía</p>
      <p className="text-gray-500 text-sm mt-1">Primero subílas desde la pestaña "Subir imágenes".</p>
    </div>
  )

  return (
    <div>
      {saved && (
        <div className="mb-4 p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 font-semibold text-sm">
          ✓ Guardado correctamente en Supabase.
        </div>
      )}

      <div className="flex gap-2 mb-4 items-center justify-between">
        <p className="text-gray-400 text-sm">
          <span className="text-white font-semibold">1.</span> Elegí un producto &nbsp;
          <span className="text-white font-semibold">2.</span> Hacé click en su foto &nbsp;
          <span className="text-white font-semibold">3.</span> Guardá
        </p>
        <button onClick={saveAll} disabled={saving || totalAssigned === 0}
          className="bg-green-500 hover:bg-green-400 disabled:opacity-40 text-white font-semibold px-5 py-2 rounded-xl transition-colors cursor-pointer text-sm whitespace-nowrap">
          {saving ? 'Guardando...' : `Guardar ${totalAssigned} productos`}
        </button>
      </div>

      <div className="flex gap-4" style={{ minHeight: '70vh' }}>

        {/* Lista de productos */}
        <div className="w-64 flex-shrink-0 overflow-y-auto rounded-xl border border-white/10 bg-white/[0.03]" style={{ maxHeight: '75vh' }}>
          {PRODUCTS.map(p => {
            const isSelected = selectedProduct === p.id
            const isDone = assignedProducts.has(p.id)
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProduct(p.id)}
                className={`w-full text-left px-4 py-2.5 text-sm border-b border-white/[0.05] transition-colors cursor-pointer flex items-center gap-2 ${
                  isSelected ? 'bg-green-500 text-white' :
                  isDone ? 'text-green-400 hover:bg-white/5' :
                  'text-gray-400 hover:bg-white/5'
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isDone ? 'bg-green-400' : 'bg-white/20'}`} />
                <span className="truncate">{p.name}</span>
              </button>
            )
          })}
        </div>

        {/* Grid de imágenes */}
        <div className="flex-1">
          {!selectedProduct ? (
            <div className="h-full flex items-center justify-center text-gray-600 text-sm">
              ← Elegí un producto para asignarle fotos
            </div>
          ) : (
            <>
              <p className="text-white font-semibold mb-3">
                {PRODUCTS.find(p => p.id === selectedProduct)?.name}
                {selectedAssigned.length > 0 && <span className="text-green-400 text-sm font-normal ml-2">{selectedAssigned.length} foto{selectedAssigned.length > 1 ? 's' : ''} asignada{selectedAssigned.length > 1 ? 's' : ''}</span>}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 overflow-y-auto" style={{ maxHeight: '68vh' }}>
                {images.map(url => {
                  const isAssigned = selectedAssigned.includes(url)
                  const assignedTo = Object.entries(assignments).find(([id, urls]) => Number(id) !== selectedProduct && urls.includes(url))
                  const assignedToName = assignedTo ? PRODUCTS.find(p => p.id === Number(assignedTo[0]))?.name : null
                  return (
                    <div
                      key={url}
                      onClick={() => toggleImage(url)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        isAssigned ? 'border-green-500 scale-[0.97]' : 'border-transparent hover:border-white/30'
                      }`}
                    >
                      <div className="aspect-square">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                      {isAssigned && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <div className="bg-green-500 rounded-full p-1">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                      {assignedToName && !isAssigned && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-yellow-400 text-[9px] px-1 py-0.5 truncate">
                          {assignedToName}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRODUCTS.filter(p => !assignedProducts.has(p.id)).map(p => (
          <span key={p.id} className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded-full">{p.name}</span>
        ))}
        {PRODUCTS.filter(p => !assignedProducts.has(p.id)).length > 0 &&
          <span className="text-xs text-gray-600 italic">← sin foto todavía</span>
        }
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Recover() {
  const [tab, setTab] = useState('assign')

  return (
    <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-1">Recuperación de imágenes</h1>
      <p className="text-gray-500 text-sm mb-6">Asigná las fotos recuperadas a cada producto.</p>

      <div className="flex gap-2 mb-8">
        {[['assign', 'Asignar imágenes'], ['upload', 'Subir desde browser']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all border ${
              tab === id ? 'bg-green-500 border-green-500 text-white' : 'border-white/10 text-gray-400 hover:text-white'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'assign' ? <AssignTab /> : <UploadTab />}
    </div>
  )
}
