import { useState, useEffect } from 'react'
import { 
  List, 
  FileText, 
  PlayCircle, 
  HelpCircle 
} from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

export default function MenuBar({ isLocked, onToggleTaskList, onOpenNotepad, onOpenScenario, onOpenGuide }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  
  // Handle M key press to toggle menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyM' && isLocked) {
        // First unlock the pointer
        if (document.pointerLockElement) {
          document.exitPointerLock()
        }
        
        // Then expand the menu after a small delay
        setTimeout(() => {
          setIsExpanded(true)
          
          // Force cursor to be visible
          const event = new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2
          })
          document.dispatchEvent(event)
        }, 50)
      }
      
      // Close menu when ESC is pressed
      if (e.code === 'Escape' && isExpanded) {
        setIsExpanded(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLocked, isExpanded])
  
  // Menu items configuration with click handlers
  const menuItems = [
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: List,
      onClick: () => {
        onToggleTaskList()
        setIsExpanded(false)
      }
    },
    { 
      id: 'notepad', 
      label: 'Notepad', 
      icon: FileText,
      onClick: () => {
        onOpenNotepad()
        setIsExpanded(false)
      }
    },
    { 
      id: 'scenario', 
      label: 'Scenario', 
      icon: PlayCircle,
      onClick: () => {
        onOpenScenario()
        setIsExpanded(false)
      }
    },
    { 
      id: 'guide', 
      label: 'Guide', 
      icon: HelpCircle,
      onClick: () => {
        onOpenGuide()
        setIsExpanded(false)
      }
    }
  ]
  
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10">
      {isExpanded ? (
        // Expanded Menu
        <div className="bg-background rounded-lg border border-border p-2 flex items-center gap-3">
          {menuItems.map(item => (
            <div 
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Tooltip */}
              {hoveredItem === item.id && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                  {item.label}
                </div>
              )}
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={item.onClick}
                className="w-8 h-8"
              >
                <item.icon className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        // Collapsed Menu
        <div className="flex flex-col items-center">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              // First unlock the pointer
              if (document.pointerLockElement) {
                document.exitPointerLock()
              }
              
              // Then expand the menu after a small delay
              setTimeout(() => {
                setIsExpanded(true)
                
                // Force cursor to be visible
                const event = new MouseEvent('mousemove', {
                  view: window,
                  bubbles: true,
                  cancelable: true,
                  clientX: window.innerWidth / 2,
                  clientY: window.innerHeight / 2
                })
                document.dispatchEvent(event)
              }, 50)
            }}
            className="w-16 h-8"
          >
            Menu
          </Button>
          <div className="text-muted-foreground text-xs mt-1">
            Press M
          </div>
        </div>
      )}
    </div>
  )
} 