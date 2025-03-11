import { useState, useRef, useEffect } from 'react'
import { 
  Sheet, 
  SheetContent as OriginalSheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetPortal,
  SheetOverlay
} from './ui/sheet'
import { Button } from './ui/button'
import { Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '../lib/utils'

// Custom SheetContent without the close button
const SheetContent = ({ side = "right", className, children, ...props }) => (
  <SheetPortal>
    <SheetOverlay />
    <OriginalSheetContent 
      side={side} 
      className={className} 
      {...props}
      // Remove the close button by overriding the children
      style={{ paddingRight: 0 }} // Remove padding for the close button
    >
      {children}
    </OriginalSheetContent>
  </SheetPortal>
)

export default function ClinicalDecision({ onClose, onSubmit }) {
  const [recommendation, setRecommendation] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const textareaRef = useRef(null)
  
  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])
  
  const handleSubmit = async () => {
    if (recommendation.length < 20) {
      setError('Please provide a more detailed clinical recommendation (at least 20 characters)')
      return
    }
    
    setError('')
    setIsLoading(true)
    
    try {
      const result = await evaluateRecommendation(recommendation)
      setEvaluation(result)
      // We don't call onSubmit here anymore - we'll wait for the user to click Continue
    } catch (err) {
      console.error('Error evaluating recommendation:', err)
      setError('Failed to evaluate recommendation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const evaluateRecommendation = async (recommendation) => {
    // Get API key from environment variable
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    
    if (!apiKey) {
      console.error('OpenAI API key not found in environment variables')
      return {
        status: 'error',
        message: 'API key not configured'
      }
    }
    
    const scenarioContext = `
      Patient: Samuel Johnson, 68 years old
      Chief Complaint: Progressive respiratory failure requiring ICU admission
      Past Medical History: Hypertension, COPD, Type 2 Diabetes, Atrial Fibrillation
      The patient was admitted six days ago due to worsening respiratory distress and was intubated shortly after arrival. He has been receiving mechanical ventilation and supportive care in the ICU. The medical team is currently evaluating his readiness for extubation.
      Vital signs indicate an elevated heart rate, borderline blood pressure, and persistent tachypnea, though oxygenation has improved with ventilatory support.
      Key findings:
        •	Labs: Elevated white blood cell count and inflammatory markers, suggestive of an ongoing infectious or inflammatory process.
        •	Imaging: Chest X-ray shows bilateral infiltrates, more pronounced in the lower lobes, consistent with pneumonia or ARDS.
        •	Respiratory Status: FIO₂ requirements have gradually decreased over the past few days, and spontaneous breathing trials are planned for today to assess readiness for extubation.
      Samuel Johnson remains under close monitoring for respiratory improvement and infection control, with ongoing management of his underlying conditions, including diabetes and atrial fibrillation.
    `
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an expert medical educator evaluating a clinical recommendation for a simulated patient case. 
              Evaluate the recommendation and provide feedback in the following JSON format:
              {
                "rating": "green" | "yellow" | "red",
                "summary": "Brief 1-2 sentence summary of your evaluation",
                "feedback": "Detailed feedback explaining the strengths and weaknesses of the recommendation",
                "improvements": "Specific suggestions for improvement"
              }
              
              Rating criteria:
              - green: Excellent recommendation that addresses the patient's condition appropriately
              - yellow: Partially correct recommendation but missing important elements or contains minor errors
              - red: Inappropriate or potentially harmful recommendation
              
              The recommendation should be evaluated based on standard medical practice for a patient with:
              ${scenarioContext}`
            },
            {
              role: 'user',
              content: `Evaluate this clinical recommendation: "${recommendation}"`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          response_format: { type: "json_object" }
        })
      })
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      
      const data = await response.json()
      const result = JSON.parse(data.choices[0].message.content)
      
      return {
        status: 'success',
        ...result
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error)
      return {
        status: 'error',
        message: 'Failed to evaluate recommendation'
      }
    }
  }
  
  // This function is called when the user clicks the Finish button
  const handleContinue = () => {
    if (evaluation && evaluation.status === 'success') {
      onSubmit({
        recommendation,
        evaluation
      })
    }
    // Only this function should close the sheet
    onClose()
  }
  
  // Handle keyboard events to prevent conflicts with guidance overlay
  const handleKeyDown = (e) => {
    // Prevent Escape key from closing the sheet
    if (e.key === 'Escape') {
      e.preventDefault()
    }
    
    // Stop propagation for all keyboard events
    // This prevents conflicts with other keyboard shortcuts
    e.stopPropagation()
  }
  
  const renderEvaluationResult = () => {
    if (!evaluation || evaluation.status !== 'success') return null
    
    const { rating, summary, feedback, improvements } = evaluation
    
    const ratingColors = {
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500'
    }
    
    const ratingLabels = {
      green: 'Appropriate',
      yellow: 'Partially Appropriate',
      red: 'Inappropriate'
    }
    
    return (
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div className="flex flex-col items-center justify-center mb-6">
          <div 
            className={`w-10 h-10 rounded-full ${ratingColors[rating]}`} 
            aria-label={`Rating: ${rating}`}
          />
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            {ratingLabels[rating]}
          </p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-sm">Evaluation</h3>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-sm">Detailed Feedback</h3>
          <p className="text-sm text-muted-foreground">{feedback}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-sm">Suggestions for Improvement</h3>
          <p className="text-sm text-muted-foreground">{improvements}</p>
        </div>
      </div>
    )
  }
  
  return (
    <Sheet 
      open={true} 
      onOpenChange={(open) => {
        // Prevent closing the sheet by clicking outside
        // Only the Finish button should close it
        return
      }}
      // Prevent closing with Escape key
      closeOnEscape={false}
    >
      <SheetContent side="right" className="p-0 overflow-hidden sm:max-w-md">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-left text-md font-semibold">Clinical Recommendation</SheetTitle>
          </SheetHeader>
          
          {!evaluation && (
            <>
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
                disabled={isLoading}
                style={{ letterSpacing: '-0.02em', lineHeight: '150%' }}
              />
              
              {/* Submit button */}
              <div className="p-4 border-t">
                <Button 
                  onClick={handleSubmit} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Evaluating...
                    </>
                  ) : 'Submit Recommendation'}
                </Button>
              </div>
            </>
          )}
          
          {evaluation && evaluation.status === 'success' && (
            <div className="flex flex-col h-full">
              <div className="border-b p-4 flex-shrink-0">
                <h3 className="font-medium text-sm mb-2">Your Recommendation</h3>
                <p className="text-sm text-muted-foreground">{recommendation}</p>
              </div>
              
              {renderEvaluationResult()}
              
              <div className="p-4 border-t flex-shrink-0">
                <Button 
                  onClick={handleContinue} 
                  className="w-full"
                >
                  Finish
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 