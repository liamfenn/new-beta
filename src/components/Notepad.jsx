import { useState, useEffect } from 'react'
import { Trash2 as TrashIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Notepad</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClearNotes}
            title="Clear notes"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 min-h-[300px]">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Take notes here..."
            className="w-full h-full min-h-[300px] resize-none focus:outline-none bg-[#121212] text-white border-none"
            autoFocus
            style={{ letterSpacing: '-0.02em', lineHeight: '150%' }}
          />
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <span className="text-sm text-white/60">
            Notes are saved for this session only
          </span>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 