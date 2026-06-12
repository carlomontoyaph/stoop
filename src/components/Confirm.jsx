import Modal from './Modal.jsx'
import Button from './Button.jsx'

export default function Confirm({ title, message, confirmLabel = 'Confirm', onConfirm, onClose, danger = false }) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose() }}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="small muted">{message}</p>
    </Modal>
  )
}
