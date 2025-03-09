import { Button } from './ui/button'

export default function Scenario({ onClose }) {
  // Scenario content
  const scenarioContent = (
    <div className="space-y-6 px-6 py-4 pb-8">
      <p className="text-foreground text-sm leading-relaxed">
        You are an attending physician in the ICU. You're starting your morning rounds with two medical students. Your first patient is a 68-year-old male who was admitted yesterday with respiratory distress. You need to assess his current condition and make a treatment recommendation.
      </p>
      
      <p className="text-foreground text-sm leading-relaxed">
        <strong>Patient:</strong> Robert Johnson, 68 years old<br />
        <strong>Chief Complaint:</strong> Shortness of breath, fever, and productive cough for 3 days<br />
        <strong>Past Medical History:</strong> Hypertension, Type 2 Diabetes, COPD
      </p>
      
      <p className="text-foreground text-sm leading-relaxed">
        You will need to:
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-foreground text-sm">
        <li>Enter the patient's room</li>
        <li>Review the patient's EHR</li>
        <li>Examine the patient</li>
        <li>Consult with the nurse</li>
        <li>Make a clinical recommendation</li>
      </ol>
      <p className="text-foreground text-sm leading-relaxed mt-2">
        You have 10 minutes to complete all tasks.
      </p>
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