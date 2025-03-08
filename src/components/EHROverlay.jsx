import { useEffect } from 'react'
import { X as CloseIcon } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="w-[90vw] h-[90vh] bg-[#121212] rounded-lg overflow-hidden flex flex-col border border-white/10">
        <div className="p-4 bg-[#1A1A1A] flex justify-between items-center border-b border-white/10">
          <h2 className="text-xl font-medium text-white">Electronic Health Record</h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Close</span>
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
        
        <iframe 
          src="https://structuredskew.com/rxReality-emr/patients/id/index.html"
          className="w-full flex-1 border-0"
          title="Electronic Health Record"
        />
      </div>
    </div>
  )
} 