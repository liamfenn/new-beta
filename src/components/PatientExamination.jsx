import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from './ui/sheet'

export default function PatientExamination({ onClose }) {
  // Handle keyboard events to prevent conflicts with guidance overlay
  const handleKeyDown = (e) => {
    // Stop propagation for all keyboard events
    // This prevents conflicts with other keyboard shortcuts
    e.stopPropagation()
  }
  
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="right" className="p-0 overflow-hidden sm:max-w-md">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-left text-md font-semibold">Patient Examination</SheetTitle>
          </SheetHeader>
          
          {/* Examination results */}
          <div className="p-6 text-sm text-muted-foreground space-y-4 flex-1">
            <p>
              As a clinical pharmacist, you observe the patient who is currently extubated and breathing on his own. Your examination reveals:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Vital signs: HR 84 bpm, BP 118/75 mmHg, RR 18 breaths/min, Temp 98.6°F</li>
              <li>Oxygen saturation 96% on 2L nasal cannula (FiO₂ 30%)</li>
              <li>Bilateral breath sounds with minimal crackles, significantly improved from admission</li>
              <li>Minimal respiratory secretions, non-purulent in nature</li>
              <li>Patient is alert and oriented, able to communicate effectively</li>
              <li>No signs of respiratory distress or increased work of breathing</li>
            </ul>
            <p className="mt-4">
              The patient has shown steady improvement in respiratory parameters over the past 5 days, with decreasing oxygen requirements and resolution of infiltrates on chest imaging. The patient underwent bronchoscopy on March 4th for mucus clearance, during which a sputum sample was collected opportunistically (not due to suspected infection).
            </p>
            <p className="mt-4">
              From a pharmacist's perspective, you note that the patient has been on broad-spectrum antibiotics (Vancomycin and Piperacillin-Tazobactam) since admission, though clinical signs of active infection have resolved.
            </p>
          </div>
          
          {/* Continue button */}
          <div className="p-4 border-t">
            <button 
              onClick={onClose}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              onKeyDown={handleKeyDown}
            >
              Continue
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 