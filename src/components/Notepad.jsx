import { useState, useEffect } from 'react'
import { X as CloseIcon } from 'lucide-react'

export default function Notepad({ onClose }) {
  const [notes, setNotes] = useState('')
  
  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('icu-simulation-notes')
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])
  
  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('icu-simulation-notes', notes)
  }, [notes])
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20 p-4">
      <div className="bg-[#121212] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 bg-[#1A1A1A] flex justify-between items-center border-b border-white/10">
          <h2 className="text-xl font-medium text-white">Notepad</h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Take notes here..."
          className="flex-1 p-4 resize-none focus:outline-none bg-[#121212] text-white"
          autoFocus
          style={{ letterSpacing: '-0.02em', lineHeight: '150%' }}
        />
        
        <div className="p-3 bg-[#1A1A1A] border-t border-white/10 text-right">
          <span className="text-sm text-white/60">
            Notes are automatically saved
          </span>
        </div>
      </div>
    </div>
  )
} 