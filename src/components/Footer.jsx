import Button from './Button'

// Cambia las URLs por las de tus redes reales.
const SOCIALS = [
  { name: 'Facebook', url: 'https://www.facebook.com/', icon: <path d="M15 3h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z" /> },
  { name: 'Instagram', url: 'https://www.instagram.com/', icon: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></> },
  { name: 'X', url: 'https://x.com/', icon: <path d="M4 4l16 16M20 4L4 20" /> },
  { name: 'YouTube', url: 'https://www.youtube.com/', icon: <><rect x="2" y="5" width="20" height="14" rx="5" /><path d="M10 9l5 3-5 3z" /></> },
  { name: 'WhatsApp', url: 'https://wa.me/', icon: <><path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6z" /><path d="M9 9c0 3 3 6 6 6l1-2-2-1-1 .8c-.8-.4-1.4-1-1.8-1.8L12 10l-1-2z" /></> },
]

export default function Footer() {
  return (
    <footer>
      <svg className="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 20 C240 60 480 0 720 30 S1200 50 1440 20 V60 H0Z" />
      </svg>
      <div className="fgrid">
        <div>
          <a className="logo" href="#inicio"><i>🧸</i>SGI-Peluches</a>
          <p style={{ marginTop: 12 }}>Sistema de gestión de inventario y entregas de peluches.</p>
        </div>
        <div>
          <h3>Páginas</h3>
          <ul className="fl">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#modulos">Módulos</a></li>
            <li><a href="#inventario">Inventario</a></li>
            <li><a href="#equipo">Equipo</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h3>Síguenos</h3>
          <div className="soc">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                <svg viewBox="0 0 24 24">{s.icon}</svg>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="copy">
        <span>© 2026 SGI-Peluches · Proyecto académico</span>
        <Button size="sm" variant="alt" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Volver arriba ↑
        </Button>
      </div>
    </footer>
  )
}
