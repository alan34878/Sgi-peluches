import { useState } from 'react'
import Button from '../components/Button'

const MODS = [
  ['🔐', 'Control de usuarios', 'Registro, login y permisos por rol.', ['Contraseñas con validación de seguridad', 'Login con roles y permisos', 'CAPTCHA y control de intentos fallidos', 'Bitácora de accesos']],
  ['🧸', 'Gestión de peluches', 'Catálogo con alta, edición y baja lógica.', ['Código SKU, nombre y tamaño', 'Material y categoría', 'Precio y stock mínimo', 'Baja lógica: no se pierde el historial']],
  ['📦', 'Inventario y almacén', 'Entradas, salidas y ajustes de stock.', ['Compras a proveedores', 'Entregas de pedidos', 'Ajustes de stock', 'Alertas de peluches agotados']],
  ['🚚', 'Entregas y pedidos', 'Del despacho a la puerta del cliente.', ['Control de despachos', 'Direcciones de envío', 'Estados de entrega al cliente final']],
  ['📊', 'Reportes y estadísticas', 'Reportes en PDF y gráficos interactivos.', ['Inventario valorizado', 'Entregas por periodo', 'Gráficos de peluches más vendidos']],
  ['📖', 'Documentación de API', 'Interfaz interactiva para probar el sistema.', ['Documentación con Swagger o Scalar', 'Pruebas de cada endpoint desde el navegador']],
]

export default function Modulos() {
  const [open, setOpen] = useState({})
  const toggle = (i) => setOpen((o) => ({ ...o, [i]: !o[i] }))

  return (
    <section className="page show">
      <h1>Seis módulos, un solo sistema</h1>
      <p style={{ marginTop: 14 }}>Toca "Ver detalles" para conocer qué hace cada módulo.</p>
      <div className="grid">
        {MODS.map(([icon, title, desc, items], i) => (
          <div className="card" key={title}>
            <div className="ico">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
            <ul className={'more' + (open[i] ? ' open' : '')}>
              {items.map((x) => <li key={x}>{x}</li>)}
            </ul>
            <Button size="sm" variant="alt" onClick={() => toggle(i)}>
              {open[i] ? 'Ocultar detalles' : 'Ver detalles'}
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
