import { useState, useRef, useEffect } from 'react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from './ui/sheet'
import { Button } from './ui/button'
import { Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

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
      Patient: Robert Johnson, 68 years old
      Chief Complaint: Shortness of breath, fever, and productive cough for 3 days
      Past Medical History: Hypertension, Type 2 Diabetes, COPD
      
      The patient was admitted yesterday with respiratory distress. The attending physician needs to assess the patient's current condition and make a treatment recommendation.
      
      The patient's vital signs show elevated temperature, increased respiratory rate, and decreased oxygen saturation.
      Lab results indicate elevated white blood cell count and C-reactive protein.
      Chest X-ray shows infiltrates in the lower right lung.
      
      The patient has been experiencing shortness of breath, fever, and productive cough for 3 days.
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
  
  // This function is called when the user clicks the Continue button
  const handleContinue = () => {
    if (evaluation && evaluation.status === 'success') {
      onSubmit({
        recommendation,
        evaluation
      })
    }
    onClose()
  }
  
  // Handle keyboard events to prevent conflicts with guidance overlay
  const handleKeyDown = (e) => {
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
    <Sheet open={true} onOpenChange={(open) => {
      // Only allow closing if we're not loading
      if (!isLoading) {
        onClose()
      }
    }}>
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