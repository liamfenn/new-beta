import { useState, useEffect } from 'react'

export default function LookAroundPrompt({ isLocked, isAnyOverlayOpen }) {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    // Check if pointer is locked
    const isPointerLocked = !!document.pointerLockElement
    
    // Show the prompt when:
    // 1. Cursor is not locked (isLocked=false) AND
    // 2. No overlays are open AND
    // 3. The pointer is not locked in the DOM
    if (!isLocked && !isAnyOverlayOpen && !isPointerLocked) {
      // Show the prompt with a small delay to avoid flashing during transitions
      const timer = setTimeout(() => {
        setShow(true)
      }, 100)
      
      return () => clearTimeout(timer)
    } else {
      setShow(false)
    }
  }, [isLocked, isAnyOverlayOpen])
  
  // Add an event listener for the pointerlockchange event
  useEffect(() => {
    const handlePointerLockChange = () => {
      // When pointer lock is released and no overlays are open, show the prompt
      if (!document.pointerLockElement && !isAnyOverlayOpen) {
        const timer = setTimeout(() => {
          setShow(true)
        }, 100)
        
        return () => clearTimeout(timer)
      } else {
        setShow(false)
      }
    }
    
    document.addEventListener('pointerlockchange', handlePointerLockChange)
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange)
  }, [isAnyOverlayOpen])
  
  if (!show) return null
  
  return (
    <div 
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 bg-black/80 text-white px-4 py-2 rounded-md text-sm font-medium
                 pointer-events-none z-50 select-none"
    >
      Click to look around
    </div>
  )
} 