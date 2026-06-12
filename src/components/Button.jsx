import Icon from './Icon.jsx'

/**
 * @param {'primary'|'secondary'|'ghost'|'outline'|'danger'} [props.variant='primary']
 * @param {'sm'|'xs'|'lg'} [props.size]
 * @param {string} [props.icon]       - Icon name rendered left of label (see Icon.jsx)
 * @param {string} [props.iconRight]  - Icon name rendered right of label
 */
export default function Button({ variant = 'primary', size, icon, iconRight, children, className = '', ...rest }) {
  const cls = ['btn', `btn-${variant}`, size ? `btn-${size}` : '', className].filter(Boolean).join(' ')
  return (
    <button className={cls} {...rest}>
      {icon && <Icon name={icon} size={size === 'xs' ? 15 : 17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'xs' ? 15 : 17} />}
    </button>
  )
}
