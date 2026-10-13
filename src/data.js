// Datos base, utilidades y reglas del inventario.
export const CURRENCY = '$' // cambia aquí tu moneda (ej. 'Bs')
export const CATEGORIES = ['Gigantes', 'Medianos', 'Animales del bosque']
export const SIZES = ['Pequeño', 'Mediano', 'Grande', 'Gigante']
export const MATERIALS = ['Felpa suave', 'Algodón', 'Peluche antialérgico', 'Terciopelo']
export const EMOJIS = ['🧸', '🐰', '🐼', '🦊', '🦌', '🐱', '🦉', '🐘', '🐻', '🦁', '🐶', '🦄']
export const STATUS_FILTERS = [['todos', 'Todos'], ['ok', 'En stock'], ['low', 'Stock bajo'], ['out', 'Agotado']]

export const money = (n) =>
  `${CURRENCY}${Number(n).toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const getStatus = (p) =>
  p.stock === 0 ? ['Agotado', 'out'] : p.stock <= p.min ? ['Stock bajo', 'low'] : ['En stock', 'ok']

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const filterProducts = (ps, { q = '', status = 'todos', category = 'todas' }) =>
  ps.filter(
    (p) =>
      (status === 'todos' || getStatus(p)[1] === status) &&
      (category === 'todas' || p.category === category) &&
      (!q || norm(`${p.name} ${p.sku}`).includes(norm(q)))
  )

// Registra una compra (+) o entrega (−) y avisa si cruza el stock mínimo.
export function applyMove(p, d, move, toast) {
  if (p.stock + d < 0) return toast(`No hay stock de ${p.name} para entregar`)
  const before = getStatus(p)[1]
  const next = { ...p, stock: p.stock + d }
  move(p.id, d)
  if (d < 0 && getStatus(next)[1] !== before) {
    toast(next.stock === 0 ? `¡${p.name} se agotó!` : `Alerta: ${p.name} llegó al stock mínimo`)
  }
}

const day = 86400000
const mk = (sku, name, category, size, material, emoji, stock, min, price, hist) => ({
  id: sku, sku, name, category, size, material, emoji, stock, min, price,
  history: hist.map(([d, type, qty, note], i) => ({
    id: `${sku}-${i}`, type, qty, note, date: new Date(Date.now() - d * day).toISOString(),
  })),
})
const IN = 'Compra a proveedor'
const OUT = 'Entrega de pedido'

export const seed = () => [
  mk('PL-001', 'Oso café mediano', 'Medianos', 'Mediano', 'Felpa suave', '🧸', 8, 5, 89.9, [[2, 'salida', 2, OUT], [6, 'entrada', 10, IN], [12, 'salida', 4, OUT]]),
  mk('PL-014', 'Conejo lila grande', 'Gigantes', 'Grande', 'Algodón', '🐰', 3, 4, 149, [[1, 'salida', 3, OUT], [5, 'entrada', 6, IN], [14, 'salida', 2, OUT]]),
  mk('PL-022', 'Panda gigante', 'Gigantes', 'Gigante', 'Peluche antialérgico', '🐼', 1, 6, 289, [[1, 'salida', 4, OUT], [4, 'salida', 3, OUT], [9, 'entrada', 8, IN]]),
  mk('PL-030', 'Zorro naranja', 'Animales del bosque', 'Mediano', 'Felpa suave', '🦊', 12, 5, 59.9, [[3, 'entrada', 12, IN], [8, 'salida', 3, OUT]]),
  mk('PL-031', 'Ciervo suave', 'Animales del bosque', 'Grande', 'Terciopelo', '🦌', 0, 4, 74.5, [[1, 'salida', 2, OUT], [3, 'salida', 3, OUT], [10, 'entrada', 5, IN]]),
  mk('PL-040', 'Gatito dormilón', 'Medianos', 'Pequeño', 'Algodón', '🐱', 15, 6, 64, [[2, 'entrada', 10, IN], [7, 'salida', 5, OUT]]),
  mk('PL-041', 'Búho del bosque', 'Animales del bosque', 'Pequeño', 'Felpa suave', '🦉', 6, 5, 54.9, [[4, 'salida', 2, OUT], [11, 'entrada', 8, IN]]),
  mk('PL-050', 'Elefante gigante', 'Gigantes', 'Gigante', 'Peluche antialérgico', '🐘', 4, 3, 320, [[2, 'entrada', 4, IN], [13, 'salida', 1, OUT]]),
]
