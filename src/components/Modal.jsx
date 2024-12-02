import { useState } from 'react'
import { Keyboard as KeyboardIcon, MouseIcon, Play as PlayIcon } from 'lucide-react'

export default function Modal({ step, onBegin, onStart }) {
  const [showControls, setShowControls] = useState(false)

  if (showControls) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-[727px] flex flex-col items-center bg-[#121212] rounded-2xl border-2 border-black p-8">
          <div className="w-full flex items-center mb-8">
            <button 
              onClick={() => setShowControls(false)} 
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h3 className="flex-1 text-center text-2xl text-white font-['Manrope'] font-semibold tracking-[-0.02em]">Controls</h3>
            <div className="w-6" /> {/* Spacer for alignment */}
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-center p-3 border-b border-white/[0.08]">
              <span className="text-white font-['Manrope'] font-semibold tracking-[-0.02em]">Movement</span>
              <div className="flex gap-1">
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">W</kbd>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">A</kbd>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">S</kbd>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">D</kbd>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 border-b border-white/[0.08]">
              <span className="text-white font-['Manrope'] font-semibold tracking-[-0.02em]">Look around</span>
              <MouseIcon className="w-6 h-6 text-white" />
            </div>

            <div className="flex justify-between items-center p-3 border-b border-white/[0.08]">
              <span className="text-white font-['Manrope'] font-semibold tracking-[-0.02em]">Interact</span>
              <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">E</kbd>
            </div>

            <div className="flex justify-between items-center p-3 border-b border-white/[0.08]">
              <span className="text-white font-['Manrope'] font-semibold tracking-[-0.02em]">Menu</span>
              <div className="flex gap-1">
                <kbd className="bg-[#1A1A1A] px-2 py-1.5 rounded text-white">⌘</kbd>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">K</kbd>
              </div>
            </div>

            <div className="flex justify-between items-center p-3">
              <span className="text-white font-['Manrope'] font-semibold tracking-[-0.02em]">Notepad</span>
              <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">N</kbd>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'scenario') {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-[727px] flex flex-col items-center bg-[#121212] rounded-2xl border-2 border-black pb-6 p-8">
          <div className="w-full flex flex-col gap-6 text-white font-['Manrope'] tracking-[-0.02em]">
            <h3 className="text-2xl font-semibold">Scenario Brief</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">Setting</h4>
                <p className="text-white/80">
                  You are the ICU clinical pharmacist arriving for your morning shift at 8:00 AM. You have two pharmacy students with you today for their clinical rotation.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">Your Role</h4>
                <p className="text-white/80">
                  You need to conduct pre-rounds assessment of your ICU patients before attending rounds at 10:30 AM. This includes reviewing overnight events, new lab results, current medications, and any pressing clinical issues for each patient.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">Initial Task</h4>
                <p className="text-white/80">
                  As you log into your Computer on Wheels (COW) in the ICU hallway, you're beginning your usual morning routine of systematically reviewing patient data. You plan to start with the patients in Beds 1-4, presenting each case to your students as you go.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">Starting Point</h4>
                <p className="text-white/80">
                  You're standing at your COW in the ICU hallway with your two students, ready to begin your morning review of patients. The familiar sounds of ICU monitors and quiet conversations fill the unit as the day shift gets underway.
                </p>
              </div>

            </div>

            <button
              onClick={onStart}
              className="w-full mt-4 py-4 flex justify-center items-center gap-2.5 rounded border-2 border-[rgba(91,211,95,0.2)] bg-[rgba(91,211,95,0.2)] hover:bg-[rgba(91,211,95,0.3)] text-white transition-colors"
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
      <div className="w-[727px] flex flex-col items-center gap-20 bg-[#121212] rounded-2xl border-2 border-black pt-10 pb-3 px-3">
        <div className="flex flex-col items-center gap-2">
          <img src="/assets/rxr_wordmark.svg" alt="RxReality" className="h-8" />
          <div className="text-white/60 text-sm font-manrope">Virtual ICU Simulation</div>
        </div>
        <img src="/assets/rxr_icon.svg" alt="RxReality Icon" className="w-36" />
        
        <div className="flex h-[140px] items-start gap-2 w-full">
          <button
            onClick={() => setShowControls(true)}
            className="flex-1 h-full flex justify-center items-center gap-2.5 rounded bg-[#1A1A1A] hover:bg-[#252525] text-white transition-colors"
          >
            <KeyboardIcon className="w-5 h-5" />
            Controls
          </button>
          <button
            onClick={onBegin}
            className="flex-1 h-full flex justify-center items-center gap-2.5 rounded border-2 border-[rgba(91,211,95,0.2)] bg-[rgba(91,211,95,0.2)] hover:bg-[rgba(91,211,95,0.3)] text-white transition-colors"
          >
            <PlayIcon className="w-5 h-5" />
            Begin
          </button>
        </div>
      </div>
    </div>
  )
} 