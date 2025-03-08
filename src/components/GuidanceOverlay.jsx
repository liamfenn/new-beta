import { useState, useEffect } from 'react'
import { X as CloseIcon, ArrowRight as ArrowRightIcon } from 'lucide-react'

export default function GuidanceOverlay({ message, onDismiss, autoHide = false, duration = 5000 }) {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setVisible(false)
        if (onDismiss) onDismiss()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [autoHide, duration, onDismiss])
  
  if (!visible) return null
  
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-black/75 text-white px-6 py-3 rounded-lg max-w-md z-10">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        {!autoHide && (
          <button 
            onClick={() => {
              setVisible(false)
              if (onDismiss) onDismiss()
            }}
            className="text-white/70 hover:text-white transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      {!autoHide && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => {
              setVisible(false)
              if (onDismiss) onDismiss()
            }}
            className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors font-medium"
          >
            <span>Continue</span>
            <ArrowRightIcon className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
} 