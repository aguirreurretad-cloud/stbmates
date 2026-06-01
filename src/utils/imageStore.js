// Almacenamiento de imágenes en IndexedDB (sin límite de 5MB)
const DB = 'mateas_imgs'
const STORE = 'imgs'
let _db = null

const open = () => new Promise((resolve, reject) => {
  if (_db) return resolve(_db)
  const req = indexedDB.open(DB, 1)
  req.onupgradeneeded = e => e.target.result.createObjectStore(STORE)
  req.onsuccess  = e => { _db = e.target.result; resolve(_db) }
  req.onerror    = e => reject(e.target.error)
})

export const saveImg = async (key, data) => {
  const db = await open()
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(data, key)
    tx.oncomplete = res
    tx.onerror    = e => rej(e.target.error)
  })
}

export const loadImg = async (key) => {
  const db = await open()
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(key)
    req.onsuccess = e => res(e.target.result || null)
    req.onerror   = e => rej(e.target.error)
  })
}

export const deleteImg = async (key) => {
  const db = await open()
  return new Promise(res => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(key)
    tx.oncomplete = res
  })
}

// Genera una clave única para una imagen
export const newKey = () => `img_${Date.now()}_${Math.random().toString(36).slice(2)}`

// Prefijo que indica que el src es una clave de IndexedDB
export const IDB_PREFIX = 'idb:'
export const isIdbKey   = (src) => src?.startsWith(IDB_PREFIX)
export const toKey      = (src) => src?.slice(IDB_PREFIX.length)
export const toRef      = (key) => `${IDB_PREFIX}${key}`
