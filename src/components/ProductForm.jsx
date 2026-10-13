import { useState } from 'react'
import Button from './Button'
import { CATEGORIES, EMOJIS, MATERIALS, SIZES } from '../data'

const Field = ({ label, error, children }) => (
  <label className="field"><span>{label}</span>{children}{error && <em>{error}</em>}</label>
)

export default function ProductForm({ initial, otherSkus, onSubmit, onCancel }) {
  const [f, setF] = useState(() =>
    initial
      ? { ...initial, stock: String(initial.stock), min: String(initial.min), price: String(initial.price) }
      : { sku: '', name: '', category: CATEGORIES[1], size: 'Mediano', material: MATERIALS[0], emoji: '🧸', stock: '0', min: '5', price: '' }
  )
  const [err, setErr] = useState({})
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    const sku = f.sku.trim().toUpperCase()
    const stock = Number(f.stock), min = Number(f.min), price = Number(f.price)
    if (!sku) er.sku = 'Escribe un código SKU.'
    else if (otherSkus.includes(sku)) er.sku = 'Ese SKU ya existe.'
    if (!f.name.trim()) er.name = 'Escribe el nombre del peluche.'
    if (!Number.isInteger(stock) || stock < 0) er.stock = 'Usa un número entero desde 0.'
    if (!Number.isInteger(min) || min < 0) er.min = 'Usa un número entero desde 0.'
    if (f.price === '' || !(price >= 0)) er.price = 'Escribe un precio válido.'
    setErr(er)
    if (Object.keys(er).length) return
    onSubmit({ sku, name: f.name.trim(), category: f.category, size: f.size, material: f.material, emoji: f.emoji, stock, min, price })
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="fg">
        <Field label="Código SKU" error={err.sku}><input value={f.sku} onChange={set('sku')} placeholder="PL-060" /></Field>
        <Field label="Nombre" error={err.name}><input value={f.name} onChange={set('name')} placeholder="Oso café mediano" /></Field>
        <Field label="Categoría"><select value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Tamaño"><select value={f.size} onChange={set('size')}>{SIZES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Material"><select value={f.material} onChange={set('material')}>{MATERIALS.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Precio" error={err.price}><input type="number" step="0.01" min="0" value={f.price} onChange={set('price')} placeholder="0.00" /></Field>
        <Field label="Stock" error={err.stock}><input type="number" min="0" value={f.stock} onChange={set('stock')} /></Field>
        <Field label="Stock mínimo" error={err.min}><input type="number" min="0" value={f.min} onChange={set('min')} /></Field>
      </div>
      <div className="field"><span>Ícono</span>
        <div className="emos">
          {EMOJIS.map((e) => (
            <Button plain key={e} className={'emo' + (f.emoji === e ? ' on' : '')} aria-label={`Ícono ${e}`} onClick={() => setF((x) => ({ ...x, emoji: e }))}>{e}</Button>
          ))}
        </div>
      </div>
      <div className="row">
        <Button type="submit">{initial ? 'Guardar cambios' : 'Agregar peluche'}</Button>
        <Button variant="mint" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  )
}
