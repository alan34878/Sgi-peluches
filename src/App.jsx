import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Modulos from './pages/Modulos'
import Inventario from './pages/Inventario'
import Equipo from './pages/Equipo'
import Contacto from './pages/Contacto'
import useHashRoute from './hooks/useHashRoute'
import useToast from './hooks/useToast'

export default function App() {
  const route = useHashRoute()
  const { msg, on, toast } = useToast()
  
  const [isAdmin, setIsAdmin] = useState(false)

  const handleLogin = (username, password) => {
    // Verificación de credenciales
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true)
      toast('¡Bienvenido Administrador! Acceso concedido 🔓')
      return true
    } else {
      toast('Usuario o contraseña incorrectos ❌')
      return false
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    toast('Sesión de administrador cerrada 🔒')
    if (location.hash === '#inventario') {
      location.hash = '#inicio'
    }
  }

  return (
    <>
      <Header 
        route={route} 
        isAdmin={isAdmin} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
      <main>
        {route === 'inicio' && <Home key="inicio" toast={toast} />}
        {route === 'modulos' && <Modulos key="modulos" />}
        
        {/* Vista protegida: Solo accesible si isAdmin es verdadero */}
        {route === 'inventario' && (
          isAdmin ? (
            <Inventario key="inventario" toast={toast} />
          ) : (
            <section className="page show" style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔒</div>
              <h1>Acceso Restringido</h1>
              <p style={{ margin: '14px auto 24px' }}>
                Debes iniciar sesión con la cuenta de Administrador desde la barra superior.
              </p>
            </section>
          )
        )}

        {route === 'equipo' && <Equipo key="equipo" />}
        {route === 'contacto' && <Contacto key="contacto" toast={toast} />}
      </main>
      <Footer />
      <div className={'toast' + (on ? ' on' : '')} role="status">{msg}</div>
    </>
  )
}