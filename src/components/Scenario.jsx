import { X as CloseIcon } from 'lucide-react'

export default function Scenario({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20 p-4">
      <div className="bg-[#121212] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col text-white">
        <div className="p-4 flex justify-between items-center border-b border-white/10">
          <h2 className="text-xl font-medium">Scenario Brief</h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
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
        </div>
        
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
} 