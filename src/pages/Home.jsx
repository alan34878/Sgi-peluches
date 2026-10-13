import { useRef, useState } from 'react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ModelCarousel from '../components/ModelCarousel'
import { useInventory } from '../context/InventoryContext'
import { applyMove, getStatus } from '../data'

export default function Home({ toast }) {
  const { products, move } = useInventory()
  const [bump, setBump] = useState(null)
  const [hop, setHop] = useState(0)
  const demoRef = useRef(null)
  const demo = products.slice(0, 3)

  const change = (p, d) => {
    applyMove(p, d, move, toast)
    if (p.stock + d >= 0) setBump({ id: p.id, k: Date.now() })
  }

  const poke = () => {
    setHop((h) => h + 1)
    toast('¡Hola! Soy el peluche de la casa 🧸')
  }

  return (
    <section className="page show">
      <div className="hero">
        <div>
          <h1>Cada peluche en su lugar y en camino a casa</h1>
          <p>SGI-Peluches controla el stock, las compras a proveedores y las entregas a clientes en un solo sistema, con alertas cuando un peluche se agota.</p>
          <div className="row">
            <Button as="a" href="#inventario">Abrir el inventario</Button>
            <Button variant="alt" onClick={() => demoRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              Probar el stock
            </Button>
          </div>
        </div>

        <div className="stage">
          <span className="tag t1">📦 Stock al día</span>
          <div key={hop} className={'bear' + (hop ? ' hop' : '')} onClick={poke} title="¡Tócame!">
            <b className="ear l" /><b className="ear r" /><b className="body" /><b className="head" />
            <b className="eye l" /><b className="eye r" /><b className="snout" /><b className="nose" />
          </div>
          <span className="tag t2">🚚 Entregas a tiempo</span>
        </div>
      </div>

      <div className="sec" ref={demoRef}>
        <h2>Prueba el control de stock</h2>
        <p>Registra una entrega o una compra. Los cambios se guardan aunque recargues la página.</p>
        <div className="demo">
          {demo.length === 0 && (
            <EmptyState title="No hay peluches para mostrar" text="Agrega peluches desde la página de Inventario.">
              <Button as="a" href="#inventario">Ir al inventario</Button>
            </EmptyState>
          )}
          {demo.map((p) => {
            const [label, cls] = getStatus(p)
            const bumped = bump && bump.id === p.id
            return (
              <div className="item" key={p.id}>
                <div><strong>{p.emoji} {p.name}</strong><small>SKU {p.sku} · mínimo {p.min}</small></div>
                <div>
                  <span key={bumped ? bump.k : 'n'} className={'num' + (bumped ? ' bump' : '')}>{p.stock}</span>{' '}
                  <span key={cls + p.stock} className={`badge ${cls}`}>{label}</span>
                </div>
                <div className="acts row">
                  <Button size="sm" variant="mint" onClick={() => change(p, 1)}>Compra +1</Button>
                  <Button size="sm" onClick={() => change(p, -1)}>Entrega −1</Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <ModelCarousel toast={toast} />

      <div className="grid sec">
        <div className="card"><div className="ico">🔐</div><h3>Acceso seguro</h3><p>Roles, permisos, CAPTCHA y bitácora de accesos.</p></div>
        <div className="card"><div className="ico">📊</div><h3>Reportes en PDF</h3><p>Inventario valorizado y entregas por periodo.</p></div>
        <div className="card"><div className="ico">🔔</div><h3>Alertas de agotado</h3><p>Avisos automáticos cuando un peluche llega al stock mínimo.</p></div>
      </div>
    </section>
  )
}
