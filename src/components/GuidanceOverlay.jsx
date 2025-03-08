import { useState, useEffect } from 'react'
import { SkipForward as SkipIcon, Stethoscope as DecisionIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

export default function GuidanceOverlay({ message, onDismiss, autoHide = false, duration = 5000, isFinalStep = false, onMakeDecision }) {
  const [visible, setVisible] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  
  // Auto-expand when message changes (new task)
  useEffect(() => {
    setCollapsed(false)
  }, [message])
  
  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setVisible(false)
        if (onDismiss) onDismiss()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [autoHide, duration, onDismiss])
  
  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle keys if overlay is visible
      if (!visible) return
      
      // Skip with 'Z' key (only if not final step)
      if (e.key.toLowerCase() === 'z' && !isFinalStep) {
        e.preventDefault()
        handleSkip()
      }
      
      // Make decision with 'R' key if final step
      if (e.key.toLowerCase() === 'r' && isFinalStep) {
        e.preventDefault()
        handleMakeDecision()
      }
      
      // Toggle collapsed state with 'C' key
      if (e.key.toLowerCase() === 'c') {
        e.preventDefault()
        toggleCollapsed()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [visible, onDismiss, isFinalStep, onMakeDecision])
  
  if (!visible) return null
  
  const handleSkip = () => {
    if (onDismiss) onDismiss() // This will mark the task as complete and show the next guidance
  }
  
  const handleMakeDecision = () => {
    setVisible(false)
    if (onMakeDecision) onMakeDecision() // Open the clinical decision dialog
  }
  
  const toggleCollapsed = () => {
    setCollapsed(prev => !prev)
  }
  
  return (
    <div className="relative">
      {/* Toggle button that blends with the overlay */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapsed}
          className={cn(
            "h-8 px-4 bg-background border border-border border-b-0 shadow-sm flex items-center justify-center gap-1",
            "hover:bg-muted transition-colors rounded-none rounded-tl-lg rounded-tr-lg"
          )}
        >
          {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{collapsed ? "Expand" : "Collapse"}</span>
          <kbd className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">C</kbd>
        </Button>
      </div>
      
      {/* Main content container - only show when not collapsed */}
      {!collapsed && (
        <div className="bg-background border border-border border-b-0 text-foreground px-6 py-4 shadow-md rounded-t-lg w-full transition-all duration-300">
          <div className="flex flex-col">
            <p className="text-sm leading-relaxed mb-3">{message}</p>
            
            {/* Only show buttons when not auto-hide */}
            {!autoHide && (
              <div className="flex justify-end items-center">
                {isFinalStep ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleMakeDecision}
                  >
                    <DecisionIcon className="w-3 h-3 mr-1" />
                    <span>Make Clinical Decision</span>
                    <kbd className="ml-2 text-xs bg-primary-foreground text-primary px-1.5 py-0.5 rounded">R</kbd>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSkip}
                  >
                    <SkipIcon className="w-3 h-3 mr-1" />
                    <span>Skip</span>
                    <kbd className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">Z</kbd>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 