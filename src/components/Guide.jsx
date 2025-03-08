import { useState } from 'react'
import { X as CloseIcon, Keyboard as KeyboardIcon, MouseIcon, Info as InfoIcon, Clock as ClockIcon } from 'lucide-react'

export default function Guide({ onClose }) {
  const [activeTab, setActiveTab] = useState('controls')
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20 p-4">
      <div className="bg-[#121212] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col text-white">
        <div className="p-4 flex justify-between items-center border-b border-white/10">
          <h2 className="text-xl font-medium">Guide</h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex border-b border-white/10">
          <button
            className={`px-4 py-2 ${activeTab === 'controls' ? 'bg-white/10 font-medium' : ''}`}
            onClick={() => setActiveTab('controls')}
          >
            Controls
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'tutorial' ? 'bg-white/10 font-medium' : ''}`}
            onClick={() => setActiveTab('tutorial')}
          >
            Tutorial
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'controls' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border-b border-white/10">
                <span className="font-medium">Movement</span>
                <div className="flex gap-1">
                  <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">W</kbd>
                  <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">A</kbd>
                  <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">S</kbd>
                  <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">D</kbd>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border-b border-white/10">
                <span className="font-medium">Look around</span>
                <MouseIcon className="w-6 h-6" />
              </div>

              <div className="flex justify-between items-center p-3 border-b border-white/10">
                <span className="font-medium">Interact</span>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">E</kbd>
              </div>

              <div className="flex justify-between items-center p-3 border-b border-white/10">
                <span className="font-medium">Exit interaction</span>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">ESC</kbd>
              </div>
              
              <div className="flex justify-between items-center p-3 border-b border-white/10">
                <span className="font-medium">Toggle Menu</span>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">M</kbd>
              </div>
            </div>
          )}
          
          {activeTab === 'tutorial' && (
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
          )}
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