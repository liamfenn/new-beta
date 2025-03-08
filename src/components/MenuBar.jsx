import { useState } from 'react'

export default function MenuBar({ onOpenNotepad, onOpenEMR, onOpenVitals, onOpenLabResults, onMakeDecision }) {
  const [activeTab, setActiveTab] = useState(null)
  
  const menuItems = [
    { id: 'notepad', label: 'Notepad', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', onClick: onOpenNotepad },
    { id: 'emr', label: 'EMR', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', onClick: onOpenEMR },
    { id: 'vitals', label: 'Vitals', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', onClick: onOpenVitals },
    { id: 'lab', label: 'Lab Results', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', onClick: onOpenLabResults },
    { id: 'decision', label: 'Make Decision', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', onClick: onMakeDecision }
  ]
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 z-50">
      <div className="flex justify-center space-x-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`flex flex-col items-center p-2 rounded hover:bg-gray-700 transition ${activeTab === item.id ? 'bg-gray-700' : ''}`}
            onClick={() => {
              setActiveTab(item.id)
              if (item.onClick) item.onClick()
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
} 