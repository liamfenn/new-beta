import { Button } from './ui/button'

export default function Scenario({ onClose }) {
  // Scenario content
  const scenarioContent = (
    <div className="space-y-6 px-6 py-4 pb-8">
      
      <div className="text-foreground text-base font-medium space-y-2">
        <p><strong>Patient:</strong> Samuel Johnson, 68 years old</p>
        <p><strong>Chief Complaint:</strong> Progressive respiratory failure requiring ICU admission</p>
        <p><strong>Past Medical History:</strong> Hypertension, COPD, Type 2 Diabetes, Atrial Fibrillation</p>
      </div>
    </div>
  )
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-background shadow-md rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="overflow-y-auto flex-1">
            {scenarioContent}
          </div>
          
          <div className="h-px w-full bg-border"></div>
          
          <div className="flex justify-end px-6 py-4 bg-background sticky bottom-0">
            <Button
              variant="default"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-1"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 