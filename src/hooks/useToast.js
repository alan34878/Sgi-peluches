import { useCallback, useRef, useState } from 'react'

export default function useToast() {
  const [msg, setMsg] = useState('')
  const [on, setOn] = useState(false)
  const timer = useRef()
  const toast = useCallback((m) => {
    setMsg(m)
    setOn(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOn(false), 2800)
  }, [])
  return { msg, on, toast }
}
