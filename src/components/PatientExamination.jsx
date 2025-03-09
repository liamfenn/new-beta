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
              The patient appears to be in respiratory distress. You observe:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Oxygen saturation is low (92% on room air)</li>
              <li>Respiratory rate is elevated (24 breaths per minute)</li>
              <li>The patient is conscious but appears uncomfortable</li>
              <li>Productive cough with yellowish sputum</li>
              <li>Crackles in the right lower lung field on auscultation</li>
              <li>Temperature is elevated (101.2°F)</li>
            </ul>
            <p className="mt-4">
              The patient reports that symptoms have been worsening over the past 3 days, starting with a mild cough that has become more productive.
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