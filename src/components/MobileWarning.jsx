import { useState, useEffect } from 'react'

export default function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Function to check if the device is mobile
    const checkIfMobile = () => {
      // Check for common mobile user agents
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent);
      
      // Check if screen width is less than 550px (new breakpoint)
      const isSmallScreen = window.innerWidth < 550;
      
      // Check if the device has touch capabilities (most mobile devices do)
      const hasTouchCapabilities = 'ontouchstart' in window || 
                                  navigator.maxTouchPoints > 0 || 
                                  navigator.msMaxTouchPoints > 0;
      
      // A tablet in landscape might have a width > 550px but still be touch-based
      // So we check if it's a touch device with a width < 1024px
      const isTablet = hasTouchCapabilities && window.innerWidth < 1024 && window.innerWidth >= 550;
      
      // Determine if the device is mobile
      const mobile = isMobileDevice || isSmallScreen || isTablet;
      
      setIsMobile(mobile);
    }
    
    // Check on initial load
    checkIfMobile()
    
    // Set up event listener for window resize
    window.addEventListener('resize', checkIfMobile)
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])
  
  // If not mobile, don't render anything
  if (!isMobile) return null
  
  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-6 text-center">
      <div className="flex items-center justify-center mb-2">
        <img 
          src="/assets/rxr_icon.svg" 
          alt="RxReality Icon" 
          className="w-16 h-16"
        />
      </div>
      
      <img 
        src="/assets/rxr_wordmark.svg" 
        alt="RxReality" 
        className="w-48 mb-8 opacity-90"
      />
      
      <h1 className="text-white text-2xl font-bold mb-4">Please open on a desktop</h1>
      <p className="text-white/80 text-lg">
        This simulation requires a desktop browser with keyboard and mouse controls.
      </p>
    </div>
  )
} 