// Muestra una imagen desde URL (Supabase Storage o cualquier URL externa)
export default function ProductImage({ src, alt = '', className = '', style = {}, onError }) {
  if (!src) return null
  return <img src={src} alt={alt} className={className} style={style} onError={onError} />
}
