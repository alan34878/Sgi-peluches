import { useEffect, useRef, useState } from 'react'
import { getStatus, money } from '../data'

// Anima el número desde su valor anterior hasta el nuevo.
function useCount(v) {
  const [n, setN] = useState(0)
  const from = useRef(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(v); from.current = v; return }
    const start = performance.now(), a = from.current
    let raf
    const step = (t) => {
      const k = Math.min((t - start) / 700, 1)
      const cur = a + (v - a) * (1 - Math.pow(1 - k, 3))
      setN(cur); from.current = cur
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [v])
  return n
}

function StatCard({ icon, label, value, fmt, bg }) {
  const n = useCount(value)
  return (
    <div className="sc">
      <div className="ico" style={{ background: bg }}>{icon}</div>
      <div><strong>{fmt(n)}</strong><small>{label}</small></div>
    </div>
  )
}

export default function Dashboard({ products }) {
  const count = (c) => products.filter((p) => getStatus(p)[1] === c).length
  const value = products.reduce((s, p) => s + p.stock * p.price, 0)
  const int = (n) => Math.round(n)
  return (
    <div className="stats">
      <StatCard icon="🧸" label="Productos en catálogo" value={products.length} fmt={int} bg="var(--butter)" />
      <StatCard icon="⚠️" label="Con stock bajo" value={count('low')} fmt={int} bg="#FFB4CD" />
      <StatCard icon="💰" label="Valor del inventario" value={value} fmt={money} bg="var(--mint)" />
      <StatCard icon="📭" label="Productos agotados" value={count('out')} fmt={int} bg="#FF8A8F" />
    </div>
  )
}
