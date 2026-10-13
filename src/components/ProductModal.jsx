import Modal from './Modal'
import Button from './Button'
import { useInventory } from '../context/InventoryContext'
import { applyMove, getStatus, money } from '../data'

const fmt = (iso) => new Date(iso).toLocaleDateString('es', { day: '2-digit', month: 'short' })

// Ficha técnica (vista ampliada) de un peluche.
export default function ProductModal({ id, onClose, toast }) {
  const { products, move } = useInventory()
  const p = products.find((x) => x.id === id)
  if (!p) return null
  const [label, cls] = getStatus(p)
  const specs = [
    ['SKU', p.sku], ['Categoría', p.category], ['Tamaño', p.size], ['Material', p.material],
    ['Precio', money(p.price)], ['Stock actual', p.stock], ['Stock mínimo', p.min], ['Valor en almacén', money(p.stock * p.price)],
  ]

  return (
    <Modal onClose={onClose} title={`Ficha técnica de ${p.name}`} wide>
      <div className="mhead">
        <div className="pimg big">{p.emoji}</div>
        <div>
          <h2>{p.name}</h2>
          <span className={`badge ${cls}`}>{label}</span>
        </div>
      </div>
      <dl className="specs">
        {specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
      <h3>Historial de movimientos</h3>
      <ul className="hist">
        {p.history.slice(0, 6).map((h, i) => (
          <li key={h.id} style={{ animationDelay: `${i * 50}ms` }}>
            <span>{fmt(h.date)} · {h.note}</span>
            <b className={h.type === 'salida' || h.qty < 0 && h.type === 'ajuste' ? 'neg' : 'pos'}>
              {h.type === 'salida' ? '−' : h.type === 'entrada' ? '+' : h.qty > 0 ? '+' : '−'}{Math.abs(h.qty)}
            </b>
          </li>
        ))}
      </ul>
      <div className="row">
        <Button variant="mint" onClick={() => applyMove(p, 1, move, toast)}>Compra +1</Button>
        <Button onClick={() => applyMove(p, -1, move, toast)}>Entrega −1</Button>
      </div>
    </Modal>
  )
}
