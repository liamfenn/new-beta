import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'

export default function Scenario({ onClose }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Scenario Brief</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium mb-2">Setting</h4>
            <p className="text-white/80 leading-relaxed">
              You are the ICU clinical pharmacist arriving for your morning shift at 8:00 AM. You have two pharmacy students with you today for their clinical rotation.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Your Role</h4>
            <p className="text-white/80 leading-relaxed">
              You need to conduct pre-rounds assessment of your ICU patients before attending rounds at 10:30 AM. This includes reviewing overnight events, new lab results, current medications, and any pressing clinical issues for each patient.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Initial Task</h4>
            <p className="text-white/80 leading-relaxed">
              As you log into your Computer on Wheels (COW) in the ICU hallway, you're beginning your usual morning routine of systematically reviewing patient data. You plan to start with the patients in Beds 1-4, presenting each case to your students as you go.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Starting Point</h4>
            <p className="text-white/80 leading-relaxed">
              You're standing at your COW in the ICU hallway with your two students, ready to begin your morning review of patients. The familiar sounds of ICU monitors and quiet conversations fill the unit as the day shift gets underway.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 