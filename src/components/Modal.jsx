import { useState, useEffect } from 'react'
import { Play } from 'lucide-react'
import { Button } from './ui/button'

export default function Modal({ step, onContinue, onStart }) {
  const [open, setOpen] = useState(true)
  const [currentSection, setCurrentSection] = useState(step || 'welcome')

  // Update current section when step prop changes
  useEffect(() => {
    if (step) {
      setCurrentSection(step)
    }
  }, [step])

  // Handle continue button click
  const handleContinue = () => {
    if (currentSection === 'welcome') {
      setCurrentSection('scenario')
      onContinue('scenario')
    } else if (currentSection === 'scenario') {
      setOpen(false)
      onStart()
    }
  }

  // Scenario content
  const scenarioContent = (
    <div className="space-y-6 px-6 pb-8">
      <p className="text-foreground text-sm leading-relaxed">
        You are a clinical pharmacist in the ICU, beginning your morning rounds. As you review patient charts at your workstation, Dr. Lopez approaches you with a request. "Can you take a look at the sputum culture for Bed 3 and recommend an antibiotic regimen?"
      </p>
      
      <p className="text-foreground text-sm leading-relaxed">
        <strong>Patient:</strong> Samuel Johnson, 68 years old<br />
        <strong>Chief Complaint:</strong> Progressive respiratory failure requiring ICU admission<br />
        <strong>Past Medical History:</strong> Hypertension, COPD, Type 2 Diabetes, Atrial Fibrillation
      </p>
      
      <p className="text-foreground text-sm leading-relaxed">
        To make an informed recommendation, you will need to navigate your ICU environment and collect information from all available sources.
      </p>
      <p className="text-foreground text-sm leading-relaxed mt-2">
        You have 10 minutes to complete all tasks.
      </p>
    </div>
  )

  if (!open) return null;

  // Render welcome screen
  if (currentSection === 'welcome') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-background shadow-md rounded-lg w-full max-w-md flex flex-col overflow-hidden">
          <div className="px-6 pt-6 pb-4 flex flex-col items-center">
            <div className="flex flex-col items-center gap-2 mb-6">
              <img src="/assets/rxr_wordmark.svg" alt="RxReality" className="h-8" />
              <div className="text-foreground text-sm">Virtual ICU Simulation</div>
            </div>
            
            <img src="/assets/rxr_icon.svg" alt="RxReality Icon" className="w-36 mb-6" />
          </div>
          
          <div className="h-px w-full bg-border"></div>
          
          <div className="px-6 py-4">
            <Button 
              onClick={handleContinue}
              variant="default"
              className="w-full py-2 flex justify-center items-center gap-2"
            >
              <span>Get Started</span>
              <Play className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render scenario content
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-background shadow-md rounded-lg w-[600px] flex flex-col overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex flex-col items-center">
          <div className="flex flex-col items-center gap-2 mb-6">
            <img src="/assets/rxr_wordmark.svg" alt="RxReality" className="h-8" />
            <div className="text-foreground text-sm">Scenario Information</div>
          </div>
        </div>
        
        <div className="h-px w-full bg-border"></div>
        
        {scenarioContent}
        
        <div className="h-px w-full bg-border"></div>
        
        <div className="px-6 py-4">
          <Button 
            onClick={handleContinue}
            variant="default"
            className="w-full py-2 flex justify-center items-center gap-2"
          >
            <span>Start Simulation</span>
            <Play className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
} 