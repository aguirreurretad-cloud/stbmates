import { useState } from 'react'
import { Upload, X, Loader } from 'lucide-react'
import { uploadImage } from '../lib/supabase'

const compress = (file, maxPx = 1000, quality = 0.78) =>
  new Promise(resolve => {
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
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = url
  })

export default function ImageUploader({ value, onChange, label = 'Foto', shape = 'square', folder = 'general' }) {
  const [uploading, setUploading] = useState(false)
  const rounded = shape === 'circle' ? 'rounded-full' : 'rounded-xl'

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await compress(file)
      const url = await uploadImage(dataUrl, folder)
      onChange(url)
    } catch (err) {
      alert('Error al subir la imagen: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">{label}</label>

      {value && (
        <div className={`relative w-24 h-24 ${rounded} overflow-hidden border border-white/[0.08] group mb-2`}>
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange('')}
            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <X size={18} className="text-white" />
          </button>
        </div>
      )}

      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-white/20 hover:border-green-500/50 hover:bg-green-500/5 text-gray-400 hover:text-green-400 text-sm cursor-pointer transition-all">
        {uploading ? <Loader size={15} className="animate-spin" /> : <Upload size={15} />}
        {uploading ? 'Subiendo…' : value ? 'Cambiar foto' : 'Subir foto'}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
    </div>
  )
}
