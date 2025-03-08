import { useState } from 'react'
import { Keyboard as KeyboardIcon, MouseIcon, Play as PlayIcon, Info as InfoIcon, Clock as ClockIcon, ChevronLeft as ChevronLeftIcon } from 'lucide-react'

export default function Modal({ step, onBegin, onStart }) {
  const [showControls, setShowControls] = useState(false)

  if (showControls) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-[727px] flex flex-col items-center bg-[#121212] rounded-lg border border-white/10 p-6">
          <div className="w-full flex items-center mb-6">
            <button 
              onClick={() => setShowControls(false)} 
              className="text-white/70 hover:text-white transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h3 className="flex-1 text-center text-xl text-white font-medium">Controls</h3>
            <div className="w-5" /> {/* Spacer for alignment */}
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-center p-3 border-b border-white/10">
              <span className="text-white font-medium">Movement</span>
              <div className="flex gap-1">
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">W</kbd>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">A</kbd>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">S</kbd>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">D</kbd>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 border-b border-white/10">
              <span className="text-white font-medium">Look around</span>
              <MouseIcon className="w-6 h-6 text-white" />
            </div>

            <div className="flex justify-between items-center p-3 border-b border-white/10">
              <span className="text-white font-medium">Interact</span>
              <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">E</kbd>
            </div>

            <div className="flex justify-between items-center p-3 border-b border-white/10">
              <span className="text-white font-medium">Exit interaction</span>
              <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">ESC</kbd>
            </div>
            
            <div className="flex justify-between items-center p-3 border-b border-white/10">
              <span className="text-white font-medium">Toggle Menu</span>
              <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">M</kbd>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'tutorial') {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-[727px] flex flex-col items-center bg-[#121212] rounded-lg border border-white/10 p-6">
          <div className="w-full flex flex-col gap-6 text-white">
            <h3 className="text-xl font-medium">Tutorial</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-yellow-400" />
                  Time Limit
                </h4>
                <p className="text-white/80 leading-relaxed">
                  You have 10 minutes to complete this scenario. The timer will start when you begin the simulation and will be displayed at the top of the screen.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <InfoIcon className="w-5 h-5 text-blue-400" />
                  Navigation
                </h4>
                <p className="text-white/80 leading-relaxed">
                  You'll start in the corridor. Use WASD to move and your mouse to look around. Press E to interact with objects and transition between areas.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-2">Interaction Zones</h4>
                <p className="text-white/80 leading-relaxed">
                  When you approach an interactive element, a prompt will appear at the bottom of the screen. Press E to interact with it.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-2">Medical Information</h4>
                <p className="text-white/80 leading-relaxed">
                  You'll need to review patient information through the EHR system. Pay attention to lab results, vital signs, and medication lists to make informed decisions.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-2">Decision Making</h4>
                <p className="text-white/80 leading-relaxed">
                  After gathering all necessary information, you'll need to make a clinical recommendation. Your decision will be evaluated based on the information available.
                </p>
              </div>
            </div>

            <button
              onClick={() => onBegin('scenario')}
              className="w-full mt-4 py-4 flex justify-center items-center gap-2.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Continue to Scenario
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'scenario') {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-[727px] flex flex-col items-center bg-[#121212] rounded-lg border border-white/10 p-6">
          <div className="w-full flex flex-col gap-6 text-white">
            <h3 className="text-xl font-medium">Scenario Brief</h3>
            
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

            <button
              onClick={onStart}
              className="w-full mt-4 py-4 flex justify-center items-center gap-2.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <PlayIcon className="w-5 h-5" />
              Start Simulation
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-[727px] flex flex-col items-center gap-16 bg-[#121212] rounded-lg border border-white/10 pt-10 pb-6 px-6">
        <div className="flex flex-col items-center gap-2">
          <img src="/assets/rxr_wordmark.svg" alt="RxReality" className="h-8" />
          <div className="text-white/60 text-sm">Virtual ICU Simulation</div>
        </div>
        <img src="/assets/rxr_icon.svg" alt="RxReality Icon" className="w-36" />
        
        <div className="flex h-[140px] items-start gap-4 w-full">
          <button
            onClick={() => setShowControls(true)}
            className="flex-1 h-full flex justify-center items-center gap-2.5 rounded bg-[#1A1A1A] hover:bg-[#252525] text-white transition-colors"
          >
            <KeyboardIcon className="w-5 h-5" />
            Controls
          </button>
          <button
            onClick={() => onBegin('tutorial')}
            className="flex-1 h-full flex justify-center items-center gap-2.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <PlayIcon className="w-5 h-5" />
            Begin
          </button>
        </div>
      </div>
    </div>
  )
} 