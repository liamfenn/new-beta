import { useEffect } from 'react'

export default function EHROverlay({ onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="w-[90vw] h-[90vh] bg-white rounded-lg overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-3 bg-gray-900 text-white hover:text-gray-200 p-2 rounded-md"
        >
          ESC to close
        </button>
        <iframe 
          src="https://structuredskew.com/rxReality-emr/patients/id/index.html"
          className="w-full h-full border-0"
          title="Electronic Health Record"
        />
      </div>
    </div>
  )
} 