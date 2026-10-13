import { useEffect, useRef } from 'react'

// Ventana flotante: cierra con Esc, clic fuera o el botón ✕.
export default function Modal({ onClose, title, wide = false, children }) {
  const ref = useRef()
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const prev = document.activeElement
    const onKey = (e) => e.key === 'Escape' && closeRef.current()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    ref.current && ref.current.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev && prev.focus && prev.focus()
    }
  }, [])

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={'modal' + (wide ? ' wide' : '')} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <button type="button" className="x" aria-label="Cerrar" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  )
}
