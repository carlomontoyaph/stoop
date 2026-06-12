import { useEffect, useRef, useId } from 'react'
import Icon from './Icon.jsx'

const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'

/**
 * Accessible modal dialog. Auto-focuses the first focusable element on open,
 * traps Tab focus within the dialog, and closes on Escape or backdrop click.
 * @param {string}    props.title    - Dialog heading (used for aria-labelledby)
 * @param {Function}  props.onClose  - Called on Escape, backdrop click, or close button
 * @param {ReactNode} [props.footer] - Sticky footer content (use for action buttons)
 * @param {boolean}   [props.wide]   - Expands max-width from 600px to 760px
 * @param {ReactNode} [props.badge]  - Element rendered beside the title (e.g. a status badge)
 */
export default function Modal({ title, onClose, children, footer, wide, badge }) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    const focusable = () => Array.from(dialog.querySelectorAll(FOCUSABLE)).filter(el => !el.disabled)
    const els = focusable()
    ;(els[0] ?? dialog).focus()

    const handleKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const all = focusable()
      const first = all[0], last = all[all.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first || !dialog.contains(document.activeElement)) {
          e.preventDefault(); last?.focus()
        }
      } else {
        if (document.activeElement === last || !dialog.contains(document.activeElement)) {
          e.preventDefault(); first?.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={dialogRef}
        className={`modal${wide ? ' modal-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-head">
          <div className="row gap-md" style={{ minWidth: 0 }}>
            <h3 id={titleId} style={{ fontSize: 20, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {title}
            </h3>
            {badge}
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" size={22} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}
