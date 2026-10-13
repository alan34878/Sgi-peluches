import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { seed } from '../data'

const KEY = 'sgi-peluches:inventario:v1'
const Ctx = createContext(null)
const uid = () => Math.random().toString(36).slice(2, 10)
const entry = (type, qty, note) => ({ id: uid(), type, qty, note, date: new Date().toISOString() })

// Lee el inventario guardado; si no hay (o está dañado) usa los datos de ejemplo.
const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data)) return data
    }
  } catch { /* localStorage no disponible */ }
  return seed()
}

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState(load)

  // Guarda cada cambio en localStorage.
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(products)) } catch { /* sin espacio o bloqueado */ }
  }, [products])

  // Sincroniza si el inventario cambia en otra pestaña.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY && e.newValue) {
        try { setProducts(JSON.parse(e.newValue)) } catch { /* ignorar */ }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback((data) =>
    setProducts((ps) => [{ ...data, id: uid(), history: [entry('entrada', data.stock, 'Stock inicial')] }, ...ps]), [])

  const update = useCallback((id, data) =>
    setProducts((ps) => ps.map((p) => {
      if (p.id !== id) return p
      const diff = data.stock - p.stock
      return { ...p, ...data, history: diff ? [entry('ajuste', diff, 'Ajuste desde edición'), ...p.history].slice(0, 30) : p.history }
    })), [])

  const remove = useCallback((id) => setProducts((ps) => ps.filter((p) => p.id !== id)), [])

  const move = useCallback((id, delta) =>
    setProducts((ps) => ps.map((p) => {
      if (p.id !== id || p.stock + delta < 0) return p
      const note = delta > 0 ? 'Compra a proveedor' : 'Entrega de pedido'
      return { ...p, stock: p.stock + delta, history: [entry(delta > 0 ? 'entrada' : 'salida', Math.abs(delta), note), ...p.history].slice(0, 30) }
    })), [])

  const reset = useCallback(() => setProducts(seed()), [])

  return <Ctx.Provider value={{ products, add, update, remove, move, reset }}>{children}</Ctx.Provider>
}

export const useInventory = () => useContext(Ctx)
