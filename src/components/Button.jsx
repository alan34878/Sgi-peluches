import { useState } from 'react'

// Botón con animaciones (hover, press) y efecto ripple al hacer clic.
// variant: '' | 'alt' | 'mint'   size: '' | 'sm'
export default function Button({
  as: Tag = 'button', variant = '', size = '', plain = false,
  className = '', onClick, children, ...rest
}) {
  const [ripples, setRipples] = useState([])

  const handle = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const d = Math.max(r.width, r.height)
    const id = Date.now() + Math.random()
    setRipples((x) => [...x, { id, d, left: e.clientX - r.left - d / 2, top: e.clientY - r.top - d / 2 }])
    setTimeout(() => setRipples((x) => x.filter((i) => i.id !== id)), 600)
    onClick && onClick(e)
  }

  const cls = [plain ? '' : 'btn', variant, size, className].filter(Boolean).join(' ')
  const extra = Tag === 'button' && !rest.type ? { type: 'button' } : {}

  return (
    <Tag className={cls} onClick={handle} {...extra} {...rest}>
      {children}
      {ripples.map((p) => (
        <span key={p.id} className="rip" style={{ width: p.d, height: p.d, left: p.left, top: p.top }} />
      ))}
    </Tag>
  )
}
