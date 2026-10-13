export default function EmptyState({ icon = '🧸', title, text, children }) {
  return (
    <div className="empty">
      <div className="empty-ico">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {children && <div className="row" style={{ justifyContent: 'center' }}>{children}</div>}
    </div>
  )
}
