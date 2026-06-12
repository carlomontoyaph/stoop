import { useId, Children, cloneElement } from 'react'
import Icon from './Icon.jsx'

export default function Field({ label, hint, error, children }) {
  const autoId = useId()
  const child = Children.only(children)
  const fieldId = child.props.id ?? autoId
  // Injects a stable id onto the child input so htmlFor can reference it
  // without requiring callers to pass an id prop themselves.
  const labeledChild = cloneElement(child, { id: fieldId })

  return (
    <div className="field">
      {label && <label className="field-label" htmlFor={fieldId}>{label}</label>}
      {labeledChild}
      {error
        ? <span className="field-error" role="alert"><Icon name="alert" size={13} /> {error}</span>
        : hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  )
}
