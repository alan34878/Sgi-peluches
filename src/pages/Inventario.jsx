import { useMemo, useState } from 'react'
import Button from '../components/Button'
import Dashboard from '../components/Dashboard'
import Filters from '../components/Filters'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import ProductForm from '../components/ProductForm'
import ProductModal from '../components/ProductModal'
import { useInventory } from '../context/InventoryContext'
import { filterProducts, getStatus, money } from '../data'

export default function Inventario({ toast }) {
  const { products, add, update, remove, reset } = useInventory()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('todos')
  const [category, setCategory] = useState('todas')
  const [editing, setEditing] = useState(null) // null | 'new' | producto
  const [viewing, setViewing] = useState(null)
  const [confirm, setConfirm] = useState(null) // { title, text, label, run }

  const list = useMemo(() => filterProducts(products, { q, status, category }), [products, q, status, category])
  const clear = () => { setQ(''); setStatus('todos'); setCategory('todas') }

  const save = (data) => {
    if (editing === 'new') { add(data); toast('Peluche agregado ✅') }
    else { update(editing.id, data); toast('Cambios guardados ✅') }
    setEditing(null)
  }
  const askDelete = (p) => setConfirm({
    title: `¿Eliminar ${p.name}?`, text: 'Se quitará de la lista y de su historial. No se puede deshacer.', label: 'Eliminar',
    run: () => { remove(p.id); toast('Peluche eliminado') },
  })
  const askReset = () => setConfirm({
    title: '¿Restablecer los datos de ejemplo?', text: 'Se perderán los cambios que hiciste en el inventario.', label: 'Restablecer',
    run: () => { reset(); clear(); toast('Datos de ejemplo restaurados') },
  })

  return (
    <section className="page show">
      <h1>Inventario de peluches</h1>
      <p style={{ marginTop: 14 }}>Agrega, edita o elimina peluches. Los cambios se guardan en este navegador.</p>

      <Dashboard products={products} />

      <div className="toolbar">
        <input className="search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o SKU" aria-label="Buscar peluches" />
        <div className="row">
          <Button onClick={() => setEditing('new')}>＋ Agregar peluche</Button>
          <Button variant="alt" onClick={askReset}>Restablecer datos</Button>
        </div>
      </div>
      <Filters status={status} onStatus={setStatus} category={category} onCategory={setCategory} />

      {list.length === 0 ? (
        products.length === 0 ? (
          <EmptyState title="Tu inventario está vacío" text="Agrega tu primer peluche o restaura los datos de ejemplo.">
            <Button onClick={() => setEditing('new')}>Agregar peluche</Button>
            <Button variant="alt" onClick={reset}>Cargar ejemplos</Button>
          </EmptyState>
        ) : (
          <EmptyState
            title={q ? 'No encontramos peluches con ese nombre' : 'No encontramos peluches con esos filtros'}
            text="Revisa la ortografía o prueba con otro filtro."
          >
            <Button variant="alt" onClick={clear}>Limpiar búsqueda y filtros</Button>
          </EmptyState>
        )
      ) : (
        <div className="tablewrap">
          <table>
            <thead>
              <tr><th>SKU</th><th>Nombre</th><th>Categoría</th><th>Stock</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {list.map((p, i) => {
                const [label, cls] = getStatus(p)
                return (
                  <tr key={p.id} style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}>
                    <td>{p.sku}</td>
                    <td><button type="button" className="namebtn" onClick={() => setViewing(p.id)}><span>{p.emoji}</span>{p.name}</button></td>
                    <td>{p.category}</td>
                    <td>{p.stock} <small style={{ color: 'var(--soft)' }}>/ mín. {p.min}</small></td>
                    <td>{money(p.price)}</td>
                    <td><span className={`badge ${cls}`}>{label}</span></td>
                    <td>
                      <div className="row" style={{ gap: 8, flexWrap: 'nowrap' }}>
                        <Button size="sm" variant="alt" onClick={() => setEditing(p)}>Editar</Button>
                        <Button size="sm" variant="danger" onClick={() => askDelete(p)}>Eliminar</Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing === 'new' ? 'Agregar peluche' : 'Editar peluche'}>
          <h2>{editing === 'new' ? 'Agregar peluche' : 'Editar peluche'}</h2>
          <ProductForm
            initial={editing === 'new' ? null : editing}
            otherSkus={products.filter((p) => editing === 'new' || p.id !== editing.id).map((p) => p.sku.toUpperCase())}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
      {viewing && <ProductModal id={viewing} onClose={() => setViewing(null)} toast={toast} />}
      {confirm && (
        <Modal onClose={() => setConfirm(null)} title={confirm.title}>
          <h2>{confirm.title}</h2>
          <p style={{ margin: '10px 0 22px' }}>{confirm.text}</p>
          <div className="row">
            <Button variant="danger" onClick={() => { confirm.run(); setConfirm(null) }}>{confirm.label}</Button>
            <Button variant="mint" onClick={() => setConfirm(null)}>Cancelar</Button>
          </div>
        </Modal>
      )}
    </section>
  )
}
