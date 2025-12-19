import { useEffect } from 'react'

function Modal({ isOpen, onClose, title, message, type = 'alert', onConfirm, onCancel }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (type === 'confirm' && onCancel) {
          onCancel()
        } else if (onConfirm) {
          onConfirm()
        }
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, type, onConfirm, onCancel, onClose])

  if (!isOpen) return null

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (type === 'confirm' && onCancel) {
        onCancel()
      }
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-text mb-4">{title}</h3>
          <p className="text-text-light mb-6 whitespace-pre-line">{message}</p>
          
          <div className="flex gap-3 justify-end">
            {type === 'confirm' && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded border border-border text-text hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
            >
              {type === 'confirm' ? 'Confirm' : 'OK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal

