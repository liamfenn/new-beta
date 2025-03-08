import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'

export default function ClinicalDecision({ onClose, onSubmit }) {
  const [selectedOption, setSelectedOption] = useState('')
  const [justification, setJustification] = useState('')
  const [error, setError] = useState('')
  
  const options = [
    "Administer supplemental oxygen",
    "Intubate the patient",
    "Administer bronchodilators",
    "Order chest X-ray",
    "Transfer to ICU",
    "Administer antibiotics",
    "Consult pulmonology"
  ]
  
  const handleSubmit = () => {
    if (!selectedOption) {
      setError('Please select a clinical recommendation')
      return
    }
    
    if (justification.length < 20) {
      setError('Please provide a more detailed justification')
      return
    }
    
    onSubmit({
      recommendation: selectedOption,
      justification
    })
    
    onClose()
  }
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Clinical Recommendation</DialogTitle>
          <DialogDescription>
            Based on your assessment of the patient, please select your clinical recommendation and provide justification.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Select Recommendation:</h3>
            <div className="space-y-2">
              {options.map((option) => (
                <div key={option} className="flex items-start">
                  <input
                    type="radio"
                    id={option}
                    name="recommendation"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => setSelectedOption(option)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor={option} className="text-foreground/90">{option}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Justification:</h3>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Provide detailed justification for your recommendation..."
              className="w-full h-32 p-2 border border-input rounded bg-muted text-foreground focus:outline-none focus:border-primary/40"
              style={{ letterSpacing: '-0.02em', lineHeight: '150%' }}
            />
          </div>
          
          {error && (
            <div className="p-2 bg-destructive/20 text-destructive rounded">
              {error}
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit Recommendation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 