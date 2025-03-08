import { useState, useEffect } from 'react'
import { X as CloseIcon, ArrowRight as ArrowRightIcon } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

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
    <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-background/90 border border-border text-foreground px-6 py-3 rounded-lg max-w-md z-10 shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        {!autoHide && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 -mt-1 -mr-2"
            onClick={() => {
              setVisible(false)
              if (onDismiss) onDismiss()
            }}
          >
            <CloseIcon className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
      {!autoHide && (
        <div className="mt-2 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => {
              setVisible(false)
              if (onDismiss) onDismiss()
            }}
          >
            <span>Continue</span>
            <ArrowRightIcon className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
} 