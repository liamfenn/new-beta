import { useState, useEffect } from 'react'
import { X as CloseIcon, Trash2 as TrashIcon } from 'lucide-react'

export default function Notepad({ onClose }) {
  const [notes, setNotes] = useState('')
  
  // Load notes from sessionStorage on component mount
  useEffect(() => {
    // Only load notes if a simulation is in progress (timer is active)
    const isSimulationActive = sessionStorage.getItem('icu-simulation-active') === 'true'
    
    if (isSimulationActive) {
      const savedNotes = sessionStorage.getItem('icu-simulation-notes')
      if (savedNotes) {
        setNotes(savedNotes)
      }
    } else {
      // Clear notes if no simulation is active
      sessionStorage.removeItem('icu-simulation-notes')
    }
  }, [])
  
  // Save notes to sessionStorage when they change
  useEffect(() => {
    if (notes) {
      sessionStorage.setItem('icu-simulation-notes', notes)
    }
  }, [notes])
  
  // Clear notes
  const handleClearNotes = () => {
    if (confirm('Are you sure you want to clear all notes?')) {
      setNotes('')
      sessionStorage.removeItem('icu-simulation-notes')
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20 p-4">
      <div className="bg-[#121212] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col text-white">
        <div className="p-4 bg-[#1A1A1A] flex justify-between items-center border-b border-white/10">
          <h2 className="text-xl font-medium">Notepad</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleClearNotes}
              className="text-white/50 hover:text-white/90 transition-colors"
              title="Clear notes"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Take notes here..."
            className="w-full h-full resize-none focus:outline-none bg-[#121212] text-white border-none"
            autoFocus
            style={{ letterSpacing: '-0.02em', lineHeight: '150%', minHeight: '300px' }}
          />
        </div>
        
        <div className="p-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-sm text-white/60">
            Notes are saved for this session only
          </span>
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