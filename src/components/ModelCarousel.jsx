import { useRef, useState, useMemo } from 'react'
import Button from './Button'
import { useInventory } from '../context/InventoryContext'
import { getStatus, money } from '../data'

export default function ModelCarousel({ toast, onSelect }) {
  const { products } = useInventory()
  const trackRef = useRef(null)

  // Estados
  const [statusFilter, setStatusFilter] = useState('todos')
  const [categoryFilter, setCategoryFilter] = useState('todas')
  const [sortType, setSortType] = useState('nuevos') // 'nuevos' | 'vendidos' | 'todos'
  const [search, setSearch] = useState('')

  // Categorías automáticas
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean))
    return ['todas', ...Array.from(set)]
  }, [products])

  // Filtrado y ordenamiento
  const displayedProducts = useMemo(() => {
    let list = [...products]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
    }

    if (statusFilter !== 'todos') {
      list = list.filter((p) => {
        const [, cls] = getStatus(p)
        return cls === statusFilter
      })
    }

    if (categoryFilter !== 'todas') {
      list = list.filter((p) => p.category === categoryFilter)
    }

    if (sortType === 'nuevos') {
      list.sort((a, b) => (b.id || 0) - (a.id || 0))
    } else if (sortType === 'vendidos') {
      list.sort((a, b) => (b.sales || 0) - (a.sales || 0))
    }

    return list
  }, [products, search, statusFilter, categoryFilter, sortType])

  const scroll = (direction) => {
    if (trackRef.current) {
      const amount = direction === 'left' ? -320 : 320
      trackRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  return (
    <div className="sec">
      <div>
        <h2>Nuestros modelos</h2>
        <p>Filtra por categoría o por estado y abre la ficha técnica de cada peluche.</p>
      </div>

      {/* Filtros de Orden y Búsqueda */}
      <div className="row" style={{ gap: '10px', flexWrap: 'wrap', alignItems: 'center', margin: '16px 0 12px' }}>
        <Button 
          size="sm" 
          variant={sortType === 'nuevos' ? 'mint' : 'alt'} 
          onClick={() => setSortType('nuevos')}
        >
          ✨ Más nuevos
        </Button>
        <Button 
          size="sm" 
          variant={sortType === 'vendidos' ? 'mint' : 'alt'} 
          onClick={() => setSortType('vendidos')}
        >
          🔥 Más vendidos
        </Button>
        <Button 
          size="sm" 
          variant={sortType === 'todos' ? 'mint' : 'alt'} 
          onClick={() => setSortType('todos')}
        >
          Ver todos
        </Button>

        <input 
          type="text" 
          placeholder="Buscar por nombre..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            padding: '8px 16px', 
            borderRadius: '20px', 
            border: '1px solid var(--line)', 
            background: 'rgba(255, 255, 255, 0.05)', 
            color: 'var(--fg)', 
            fontSize: '0.85rem',
            outline: 'none',
            minWidth: '220px'
          }}
        />
      </div>

      {/* Filtros por Estado (Usando tu componente Button nativo con variante 'chip' / 'alt') */}
      <div className="row" style={{ gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
        {[
          ['todos', 'Todos los estados'],
          ['ok', 'En stock'],
          ['low', 'Stock bajo'],
          ['out', 'Agotado']
        ].map(([id, label]) => (
          <Button 
            key={id}
            size="sm" 
            variant={statusFilter === id ? 'default' : 'alt'}
            onClick={() => setStatusFilter(id)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Filtros por Categoría */}
      <div className="row" style={{ gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {categories.map((cat) => (
          <Button 
            key={cat}
            size="sm" 
            variant={categoryFilter === cat ? 'default' : 'alt'}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat === 'todas' ? 'Todas las categorías' : cat}
          </Button>
        ))}
      </div>

      {/* Carrusel de Tarjetas */}
      <div 
        className="track" 
        ref={trackRef} 
        style={{ 
          display: 'flex', 
          gap: '20px', 
          overflowX: 'auto', 
          scrollBehavior: 'smooth',
          paddingBottom: '12px' 
        }}
      >
        {displayedProducts.length === 0 ? (
          <p style={{ padding: '20px', color: 'var(--soft)' }}>No se encontraron modelos con los filtros seleccionados.</p>
        ) : (
          displayedProducts.map((p, i) => {
            const [label, cls] = getStatus(p)
            const isNew = sortType === 'nuevos' && i < 3

            return (
              <div className="pcard" key={p.id} style={{ position: 'relative', minWidth: '260px' }}>
                
                {/* Etiqueta superpuesta Nuevo / Top */}
                {isNew && (
                  <span className="badge-overlay new-tag">✨ Nuevo</span>
                )}
                {sortType === 'vendidos' && (
                  <span className="badge-overlay top-tag">🔥 Top</span>
                )}

                <div className="imgwrap" style={{ position: 'relative' }}>
                  <span className="p-emoji" style={{ fontSize: '3rem' }}>{p.emoji}</span>
                </div>

                <div className="pcard-body">
                  <span className={`badge ${cls}`}>{label}</span>
                  <h3>{p.name}</h3>
                  <p className="sub">{p.category} · {p.size || 'Mediano'}</p>
                  <div className="price">{money(p.price)}</div>
                  
                  <Button size="sm" variant="alt" onClick={() => onSelect && onSelect(p.id)}>
                    Ver ficha técnica
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Flechas de desplazamiento lateral colocados ABAJO del carrusel */}
      <div className="row" style={{ justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
        <Button size="sm" variant="alt" onClick={() => scroll('left')} aria-label="Mover a la izquierda">
          ◄
        </Button>
        <Button size="sm" variant="alt" onClick={() => scroll('right')} aria-label="Mover a la derecha">
          ►
        </Button>
      </div>

    </div>
  )
}