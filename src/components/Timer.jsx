import { useState, useEffect } from 'react'

export default function Timer({ initialTime = 600, onTimeEnd }) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  
  useEffect(() => {
    if (timeRemaining <= 0) {
      if (onTimeEnd) onTimeEnd()
      return
    }
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [timeRemaining, onTimeEnd])
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-full z-50">
      <div className="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span className="font-bold">{formatTime(timeRemaining)}</span>
      </div>
    </div>
  )
} 