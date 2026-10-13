import { useEffect, useState } from 'react'

export const PAGES = ['inicio', 'modulos', 'inventario', 'equipo', 'contacto']

const read = () => {
  const h = window.location.hash.slice(1)
  return PAGES.includes(h) ? h : 'inicio'
}

export default function useHashRoute() {
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onChange = () => {
      setRoute(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
