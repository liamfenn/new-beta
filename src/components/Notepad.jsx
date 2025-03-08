import { useState, useEffect } from 'react'

export default function Notepad({ isOpen, onClose }) {
  const [notes, setNotes] = useState('')
  
  // Load notes from localStorage when component mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem('userNotes')
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])
  
  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userNotes', notes)
  }, [notes])
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl h-3/4 flex flex-col">
        <div className="bg-gray-100 p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold">Notepad</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <textarea
            className="w-full h-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Take notes here..."
          />
        </div>
      </div>
    </div>
  )
} 