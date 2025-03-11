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
              The patient is intubated and receiving mechanical ventilation. Your examination reveals:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Vital signs: HR 95 bpm, BP 110/70 mmHg, RR 18 (ventilator-assisted)</li>
              <li>Oxygen saturation 96% on FiO₂ 40%</li>
              <li>Bilateral breath sounds with scattered crackles, more pronounced in the lower lobes</li>
              <li>No significant secretions from the endotracheal tube</li>
              <li>Patient is sedated but responsive to verbal stimuli</li>
              <li>No signs of respiratory distress while on ventilatory support</li>
            </ul>
            <p className="mt-4">
              The patient has been showing gradual improvement in respiratory parameters over the past 48 hours, with decreasing FiO₂ requirements and improved lung compliance.
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