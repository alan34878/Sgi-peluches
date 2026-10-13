import Button from '../components/Button'

export default function Contacto({ toast }) {
  const onSubmit = (e) => {
    e.preventDefault()
    // Aquí puedes conectar tu API (fetch/axios) para enviar el mensaje.
    e.target.reset()
    toast('¡Mensaje enviado! Te responderemos pronto 💌')
  }

  return (
    <section className="page show">
      <h1>Hablemos de tu inventario</h1>
      <p style={{ marginTop: 14 }}>Escríbenos y te respondemos con una demostración del sistema.</p>
      <form onSubmit={onSubmit}>
        <input required placeholder="Tu nombre" aria-label="Nombre" />
        <input required type="email" placeholder="Tu correo" aria-label="Correo" />
        <textarea required rows="4" placeholder="¿Qué quieres controlar?" aria-label="Mensaje" />
        <div className="row">
          <Button type="submit">Enviar mensaje</Button>
          <Button type="reset" variant="mint">Limpiar</Button>
        </div>
      </form>
    </section>
  )
}
