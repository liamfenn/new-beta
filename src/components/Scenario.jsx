import { Button } from './ui/button'

export default function Scenario({ onClose }) {
  // Scenario content
  const scenarioContent = (
    <div className="space-y-6 px-6 py-4 pb-8">
      <p className="text-foreground text-sm leading-relaxed">
        You are a clinical pharmacist in the ICU, beginning your morning rounds. As you review patient charts at your workstation, Dr. Lopez approaches you with a request. "Can you take a look at the sputum culture for Bed 3 and recommend an antibiotic regimen?"
      </p>
      
      <p className="text-foreground text-sm leading-relaxed">
        <strong>Patient:</strong> Samuel Johnson, 68 years old<br />
        <strong>Chief Complaint:</strong> Progressive respiratory failure requiring ICU admission<br />
        <strong>Past Medical History:</strong> Hypertension, COPD, Type 2 Diabetes, Atrial Fibrillation
      </p>
      
      <p className="text-foreground text-sm leading-relaxed">
        To make an informed recommendation, you will need to:
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-foreground text-sm">
        <li>Review the patient's EHR</li>
        <li>Assess the microbiology results and other relevant clinical data</li>
        <li>Consult with the nurse regarding the patient's status</li>
        <li>Determine whether antibiotic treatment is necessary</li>
        <li>Communicate your recommendation to Dr. Lopez via your clinical recommendation</li>
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