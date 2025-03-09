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
  
  // Determine timer color based on remaining time
  const getTimerColor = () => {
    // For testing: 9:45 (585 seconds) for yellow, 9:30 (570 seconds) for red
    if (timeRemaining <= 570) { // 9:30 or less
      return 'bg-red-500/75 text-white'
    } else if (timeRemaining <= 585) { // 9:45 or less
      return 'bg-yellow-500/75 text-white'
    } else {
      return 'bg-black/75 text-white'
    }
  }
  
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 ${getTimerColor()} px-4 py-2 rounded-full z-50 transition-colors duration-300`}>
      <div className="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span className="font-bold">{formatTime(timeRemaining)}</span>
      </div>
    </div>
  )
} 