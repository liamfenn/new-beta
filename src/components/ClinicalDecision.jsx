import { useState, useRef, useEffect } from 'react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from './ui/sheet'
import { Button } from './ui/button'

export default function ClinicalDecision({ onClose, onSubmit }) {
  const [recommendation, setRecommendation] = useState('')
  const [error, setError] = useState('')
  const textareaRef = useRef(null)
  
  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])
  
  const handleSubmit = () => {
    if (recommendation.length < 20) {
      setError('Please provide a more detailed clinical recommendation (at least 20 characters)')
      return
    }
    
    onSubmit({
      recommendation
    })
    
    onClose()
  }
  
  // Handle keyboard events to prevent conflicts with guidance overlay
  const handleKeyDown = (e) => {
    // Stop propagation for all keyboard events
    // This prevents conflicts with other keyboard shortcuts
    e.stopPropagation()
  }
  
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="right" className="p-0 overflow-hidden sm:max-w-sm">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-left text-md font-semibold">Clinical Recommendation</SheetTitle>
          </SheetHeader>
          
          {/* Prompt */}
          <div className="p-4 border-b text-sm text-muted-foreground">
            Based on your assessment of the patient, please provide your clinical recommendation and justification.
          </div>
          
          {/* Error message if present */}
          {error && (
            <div className="px-4 py-2 text-sm text-destructive bg-destructive/10">
              {error}
            </div>
          )}
          
          {/* Text area */}
          <textarea
            ref={textareaRef}
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your clinical recommendation here..."
            className="flex-1 w-full p-4 resize-none focus:outline-none bg-background text-sm leading-relaxed"
            autoFocus
            style={{ letterSpacing: '-0.02em', lineHeight: '150%' }}
          />
          
          {/* Submit button */}
          <div className="p-4 border-t">
            <Button 
              onClick={handleSubmit} 
              className="w-full"
            >
              Submit Recommendation
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 