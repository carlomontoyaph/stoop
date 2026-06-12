import { useState, useCallback, useRef } from 'react'
import { NAV_KEY } from './store.jsx'

export const APP_VIEWS = ['dashboard', 'tenants', 'rent', 'leases', 'maintenance', 'settings', 'feedback']
export const ALL_VIEWS = ['landing', 'onboarding', ...APP_VIEWS]

function readInitialView() {
  try { return localStorage.getItem(NAV_KEY) || 'landing' } catch { return 'landing' }
}

/**
 * Navigation hook. `go(view)` changes the active view, persists to localStorage,
 * scrolls to top, and moves keyboard focus to the main content region.
 * `toast(msg)` displays a 2.4-second status message via the Toast component.
 * @returns {{ view: string, go: Function, toastMsg: string, toast: Function }}
 */
export function useNavigation() {
  const [view, setView]         = useState(readInitialView)
  const [toastMsg, setToastMsg] = useState('')
  const timerRef = useRef(null)

  const go = useCallback((to) => {
    setView(to)
    try { localStorage.setItem(NAV_KEY, to) } catch {}
    window.scrollTo(0, 0)
    requestAnimationFrame(() => {
      const main = document.getElementById('main-content')
      if (main) main.focus({ preventScroll: true })
    })
  }, [])

  const toast = useCallback((msg) => {
    setToastMsg(msg)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToastMsg(''), 2400)
  }, [])

  return { view, go, toastMsg, toast }
}
