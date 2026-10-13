import { useEffect, useState } from 'react'
import Button from './Button'

export default function Header({ route, isAdmin, onLogin, onLogout }) {
  const [small, setSmall] = useState(false)
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  
  // Estados para el Modal de Login
  const [showModal, setShowModal] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const LINKS = [
    ['inicio', 'Inicio'], 
    ['modulos', 'Módulos'], 
    ...(isAdmin ? [['inventario', 'Inventario']] : []),
    ['equipo', 'Equipo'], 
    ['contacto', 'Contacto']
  ]

  useEffect(() => {
    const f = () => setSmall(window.scrollY > 30)
    f()
    window.addEventListener('scroll', f)
    return () => window.removeEventListener('scroll', f)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  useEffect(() => setOpen(false), [route])

  const handleSubmit = (e) => {
    e.preventDefault()
    const success = onLogin(username, password)
    if (success) {
      setShowModal(false)
      setUsername('')
      setPassword('')
    }
  }

  return (
    <>
      <header className={small ? 'small' : ''}>
        <div className="bar">
          <a className="logo" href="#inicio"><i>🧸</i>SGI-Peluches</a>
          <nav className={open ? 'open' : ''}>
            {LINKS.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={route === id ? 'on' : ''}>{label}</a>
            ))}
          </nav>

          <div className="tools">
            {/* Botón de Login / Sesión Admin al lado del tema */}
            {isAdmin ? (
              <Button size="sm" variant="danger" onClick={onLogout}>
                Cerrar sesión
              </Button>
            ) : (
              <Button size="sm" variant="mint" onClick={() => setShowModal(true)}>
                🔐 Admin
              </Button>
            )}

            {/* Botón de Claro / Oscuro */}
            <Button size="sm" variant="alt" aria-label="Cambiar tema" onClick={() => setDark((d) => !d)}>
              {dark ? '☀️' : '🌙'}
            </Button>

            <Button plain className={'burger' + (open ? ' open' : '')} aria-label="Abrir menú" onClick={() => setOpen((o) => !o)}>
              ☰
            </Button>
          </div>
        </div>
      </header>

      {/* Ventana Emergente (Modal) para inicio de sesión */}
      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <button className="x" onClick={() => setShowModal(false)} aria-label="Cerrar">✕</button>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '3rem' }}>🔐</div>
              <h2>Acceso Administrador</h2>
              <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Ingresa tus credenciales para acceder al inventario.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px', maxWidth: 'none' }}>
              <div className="field">
                <label>Usuario:</label>
                <input 
                  type="text" 
                  placeholder="ej: admin" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>

              <div className="field">
                <label>Contraseña:</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--soft)', margin: 0 }}>
                💡 Credenciales de prueba: <strong>admin</strong> / <strong>admin123</strong>
              </p>

              <div className="row" style={{ marginTop: '10px' }}>
                <Button type="submit" style={{ width: '100%' }}>Iniciar Sesión</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}