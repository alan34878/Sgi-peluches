// Reemplaza "Integrante 2" e "Integrante 3" con los nombres reales.
const TEAM = [
  { icon: '🧑‍💼', name: 'Alan Fernando Peralta Luna', role: 'Jefe de proyecto y analista de sistemas.', bg: 'var(--butter)' },
  { icon: '👩‍💻', name: 'Integrante 2', role: 'Desarrolladora backend y diseño de base de datos.', bg: 'var(--mint)' },
  { icon: '🧑‍🎨', name: 'Integrante 3', role: 'Desarrollador frontend y pruebas de software.', bg: '#FFB4CD' },
]

export default function Equipo() {
  return (
    <section className="page show">
      <h1>El equipo detrás del sistema</h1>
      <p style={{ marginTop: 14 }}>Tres personas, cada una con un rol claro en el proyecto.</p>
      <div className="grid">
        {TEAM.map((m) => (
          <div className="card" key={m.name}>
            <div className="avatar" style={{ background: m.bg }}>{m.icon}</div>
            <h3>{m.name}</h3>
            <p>{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
