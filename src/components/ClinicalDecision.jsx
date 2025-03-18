import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  Sheet, 
  SheetContent,
  SheetHeader, 
  SheetTitle,
  SheetClose
} from './ui/sheet'
import { Button } from './ui/button'
import { Loader2, CheckCircle, AlertTriangle, XCircle, FileText, X } from 'lucide-react'
import { cn } from '../lib/utils'

// Helper component to create isolated portals
const IsolatedPortal = ({ children }) => {
  const handleClick = (e) => {
    // Stop propagation to prevent clicks from reaching the Sheet overlay
    e.stopPropagation();
  };

  return createPortal(
    <div onClick={handleClick} onMouseDown={handleClick} onPointerDown={handleClick}>
      {children}
    </div>,
    document.body
  );
};

export default function ClinicalDecision({ onClose, onSubmit, initialRecommendation = '' }) {
  const [recommendation, setRecommendation] = useState(initialRecommendation)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [userNotes, setUserNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const textareaRef = useRef(null)
  
  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])
  
  // Load notes from sessionStorage on mount
  useEffect(() => {
    // Get the current session ID
    const sessionId = sessionStorage.getItem('simulation-session-id')
    if (!sessionId) return
    
    // Use session-specific key for notes
    const savedNotes = sessionStorage.getItem(`icu-simulation-notes-${sessionId}`)
    if (savedNotes) {
      setUserNotes(savedNotes)
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
      Patient: Samuel Johnson, 68 years old, Male
      MRN: 123456789
      Admitted: 2025-03-01 11:00 (6 days ago)
      Current date/time: 2025-03-06 11:15
      Alerts: Allergic to Penicillin
      Chief Complaint: Progressive respiratory failure requiring ICU admission
      Past Medical History: 
      - Hypertension (diagnosed 2023-08-01)
      - COPD (diagnosed 2021-03-15)
      - Type 2 Diabetes (diagnosed 2023-08-01)
      - Atrial Fibrillation (diagnosed 2025-04-28)
      
      Current Status:
      The patient was admitted six days ago due to worsening respiratory distress and was intubated shortly after arrival. He has been receiving mechanical ventilation and supportive care in the ICU. Vital signs have been improving: BP 118/75 mmHg, HR 84 bpm, RR 18 breaths/min, Temp 98.6°F. Oxygenation has improved with ventilatory support. FIO₂ requirements have gradually decreased from 70% on day 1 to 30% on day 6. Spontaneous breathing trials are planned today for potential extubation.
      
      Key findings:
      • Labs: WBC trending down: 12.8 (03/01) → 12.3 (03/02) → 11.9 (03/03) → 11.6 (03/04) → 11.4 (03/05) → 11.2 (03/06)
      Temperature trending down: 100.1°F (03/01) → 99.5°F (03/02) → 99.0°F (03/03) → 98.8°F (03/04) → 98.7°F (03/05) → 98.6°F (03/06)
      Hemoglobin 10.6 g/dL. Creatinine improved from 2.1 to 1.8 mg/dL. Glucose improved from 220 to 165 mg/dL.
      
      • Microbiology: Blood cultures negative. Sputum culture positive for Pseudomonas aeruginosa (collected during bronchoscopy on 2025-03-04). Collection context: Sample obtained during routine bronchoscopy for mucus clearance, not due to suspected infection. No antibiotics given prior to or immediately after culture collection. Organism susceptible to Ciprofloxacin, Levofloxacin, Meropenem, Cefepime. Urine culture positive for E. coli.
      
      • Medications: Norepinephrine 8 mcg/min IV (continuous), Vancomycin 1g IV q12h, Piperacillin-Tazobactam 4.5g IV q8h, Furosemide 20 mg IV q12h, Heparin 5000 units SC q12h.
      
      • Imaging: Initial chest X-ray showed bilateral infiltrates. Recent chest X-ray (2025-03-06) shows significant improvement, infiltrates resolving rapidly.
      
      • Procedures: Bronchoscopy performed on 2025-03-04 for excess mucus secretion management. Note: No empiric antibiotics initiated post-procedure. Sputum culture was collected opportunistically during the procedure, not in response to suspected infection.
      
      Samuel Johnson's condition has been improving steadily with current management. The patient is being evaluated for potential extubation today based on improving respiratory parameters.
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
              content: `${scenarioContext}
              
              You are an expert clinical decision evaluator. Your task is to evaluate a medical student's antibiotic recommendation for the patient described above.
              
              Evaluate the recommendation based on:
              1. Appropriateness for the patient's condition
              2. Coverage of likely pathogens
              3. Consideration of antibiotic resistance
              4. Dosing appropriateness
              5. Consideration of patient allergies
              6. Potential side effects or interactions
              
              Format your response as a JSON object with the following structure:
              {
                "status": "success" or "error",
                "score": A number from 1-10 representing the overall quality of the recommendation,
                "rating": "green" | "yellow" | "red",
                "summary": "Brief 1-2 sentence summary of your evaluation",
                "feedback": "Detailed feedback explaining the strengths and weaknesses of the recommendation",
                "improvements": "Specific suggestions for improvement"
              }
              
              Rating criteria:
              - score 8-10: rating should be "green" (Excellent recommendation that addresses the patient's condition appropriately)
              - score 4-7: rating should be "yellow" (Partially correct recommendation but missing important elements or contains minor errors)
              - score 1-3: rating should be "red" (Inappropriate or potentially harmful recommendation)
              
              Be thorough but fair in your assessment.`
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
      
      try {
        // The response should already be a JSON object since we specified response_format
        const content = data.choices[0].message.content;
        
        console.log('API response:', data);
        console.log('Content:', content);
        
        // Handle both string and object responses
        let result;
        if (typeof content === 'string') {
          try {
            result = JSON.parse(content);
          } catch (parseError) {
            console.error('Error parsing content as JSON:', parseError);
            result = { error: 'Failed to parse response' };
          }
        } else {
          result = content;
        }
        
        console.log('Parsed result:', result);
        
        // Even if the API returns status: "error", if we have all the required fields,
        // we should treat it as a successful evaluation
        if (result.score !== undefined && result.rating && result.summary && 
            result.feedback && result.improvements) {
          return {
            status: 'success',
            ...result
          };
        }
        
        return {
          status: 'error',
          message: result.message || 'Incomplete evaluation response'
        };
      } catch (parseError) {
        console.error('Error parsing API response:', parseError, data)
        return {
          status: 'error',
          message: 'Failed to parse evaluation response'
        }
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
    // Always submit the recommendation and evaluation if available
    if (evaluation) {
      onSubmit({
        recommendation,
        evaluation
      });
    } else {
      onSubmit({
        recommendation,
        evaluation: null
      });
    }
    // Only this function should close the sheet
    onClose();
  };
  
  // New function to handle exiting without submitting (saving progress)
  const handleExit = () => {
    // Save the current recommendation text but don't submit the final result
    onSubmit({
      recommendation,
      evaluation: null,
      isComplete: false
    });
    
    // Close the sheet
    onClose();
  };
  
  // Handle keyboard events to prevent conflicts with guidance overlay
  const handleKeyDown = (e) => {
    // Prevent Escape key from closing the sheet
    if (e.key === 'Escape') {
      e.preventDefault()
      
      // Allow Escape key to exit if we add the exit functionality
      handleExit()
    }
    
    // Stop propagation for all keyboard events
    // This prevents conflicts with other keyboard shortcuts
    e.stopPropagation()
  }
  
  const renderEvaluationResult = () => {
    if (!evaluation) {
      console.log('No evaluation available');
      return null;
    }
    
    console.log('Rendering evaluation with status:', evaluation.status);
    
    // Extract the fields we need, regardless of the status
    const { score, rating, summary, feedback, improvements } = evaluation;
    
    // Check if any required fields are missing
    if (!score && score !== 0 || !rating || !summary || !feedback || !improvements) {
      console.error('Missing required fields in evaluation:', { score, rating, summary, feedback, improvements });
      return (
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <p className="text-sm text-destructive">
            The evaluation result is incomplete. Please try again.
          </p>
        </div>
      );
    }
    
    const ratingColors = {
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500'
    };
    
    const ratingLabels = {
      green: 'Excellent',
      yellow: 'Partially Appropriate',
      red: 'Needs Improvement'
    };
    
    // Use a default color if the rating is not recognized
    const ratingColor = ratingColors[rating] || 'bg-gray-500';
    const ratingLabel = ratingLabels[rating] || 'Unknown';
    
    return (
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center gap-2">
            <div 
              className={`w-10 h-10 rounded-full ${ratingColor} flex items-center justify-center text-white font-bold`} 
              aria-label={`Score: ${score}/10`}
            >
              {score}
            </div>
            <p className="text-sm font-medium">
              {ratingLabel} ({score}/10)
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-sm">Summary</h3>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-sm">Feedback</h3>
          <p className="text-sm text-muted-foreground">{feedback}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-sm">Suggestions for Improvement</h3>
          <p className="text-sm text-muted-foreground">{improvements}</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Floating View Notes Button - Using IsolatedPortal */}
      {!showNotes && (
        <IsolatedPortal>
          <div className="fixed left-4 top-8 z-[9999] pointer-events-auto">
            <Button
              variant="primary"
              size="sm"
              className="shadow-md flex items-center gap-1 px-3 py-2 view-notes-btn bg-black text-white hover:bg-black/90"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowNotes(true);
              }}
            >
              <FileText className="w-4 h-4" />
              <span>View Notes</span>
            </Button>
          </div>
        </IsolatedPortal>
      )}
      
      {/* Notes Panel - Also using IsolatedPortal */}
      {showNotes && (
        <IsolatedPortal>
          <div 
            className="fixed left-0 top-0 h-full z-[9999] flex flex-col bg-background border-r shadow-lg w-80 overflow-hidden pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">Your Notes</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowNotes(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 text-sm whitespace-pre-wrap">
              {userNotes ? (
                <div className="prose prose-sm max-w-none">{userNotes}</div>
              ) : (
                <p className="text-muted-foreground italic">No notes found. Use the notepad to create notes.</p>
              )}
            </div>
          </div>
        </IsolatedPortal>
      )}
      
      {/* Clinical Recommendation Sheet */}
      <Sheet 
        open={true} 
        onOpenChange={(open) => {
          // Only close if the sheet is explicitly closed through our controls
          // This prevents clicks on the View Notes button from closing the sheet
          if (!open) {
            // Check if this is coming from our custom close actions
            const isCustomClose = document.activeElement && 
                                 (document.activeElement.classList.contains('view-notes-btn') ||
                                  document.activeElement.parentElement?.classList.contains('view-notes-btn'));
            
            // Only proceed with handleExit if it's not our custom button
            if (!isCustomClose) {
              handleExit();
            }
          }
        }}
      >
        <SheetContent side="right" className="p-0 overflow-hidden sm:max-w-md z-50">
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
                
                {/* Submit and Exit buttons */}
                <div className="p-4 border-t flex justify-between">
                  <Button 
                    onClick={handleExit} 
                    variant="outline"
                    className="w-1/3"
                  >
                    Exit
                  </Button>
                  
                  <Button 
                    onClick={handleSubmit} 
                    className="w-2/3 ml-2"
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
            
            {evaluation && (
              <div className="flex flex-col h-full">
                <div className="border-b p-4 flex-shrink-0">
                  <h3 className="font-medium text-sm mb-2">Your Recommendation</h3>
                  <p className="text-sm text-muted-foreground">{recommendation}</p>
                </div>
                
                {renderEvaluationResult() || (
                  <div className="p-4 text-sm text-destructive">
                    <p>There was an error evaluating your recommendation.</p>
                    <p className="mt-2">Error: {evaluation.message || 'Unknown error'}</p>
                  </div>
                )}
                
                {/* Finish and Back buttons */}
                <div className="p-4 border-t flex-shrink-0 flex justify-between">
                  <Button 
                    onClick={handleExit} 
                    variant="outline" 
                    className="w-1/3"
                  >
                    Exit
                  </Button>
                  
                  <Button 
                    onClick={handleContinue} 
                    className="w-2/3 ml-2"
                  >
                    Finish
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
} 