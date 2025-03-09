import { useState, useEffect, useRef } from 'react'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading2, 
  Trash2
} from 'lucide-react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from './ui/sheet'
import { Toggle } from './ui/toggle'
import { Button } from './ui/button'

export default function Notepad({ onClose }) {
  const [notes, setNotes] = useState('')
  const textareaRef = useRef(null)
  
  // Load notes from sessionStorage on mount
  useEffect(() => {
    // Get the current session ID
    const sessionId = sessionStorage.getItem('simulation-session-id')
    if (!sessionId) return
    
    // Use session-specific key for notes
    const savedNotes = sessionStorage.getItem(`icu-simulation-notes-${sessionId}`)
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])
  
  // Save notes to sessionStorage when they change
  useEffect(() => {
    // Get the current session ID
    const sessionId = sessionStorage.getItem('simulation-session-id')
    if (!sessionId) return
    
    // Use session-specific key for notes
    if (notes) {
      sessionStorage.setItem(`icu-simulation-notes-${sessionId}`, notes)
    }
  }, [notes])
  
  // Apply formatting to selected text
  const applyFormatting = (format) => {
    if (!textareaRef.current) return
    
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = notes.substring(start, end)
    
    let newText = notes
    let newCursorPos = end
    
    switch (format) {
      case 'bold':
        newText = notes.substring(0, start) + `**${selectedText}**` + notes.substring(end)
        newCursorPos = end + 4
        break
      case 'italic':
        newText = notes.substring(0, start) + `*${selectedText}*` + notes.substring(end)
        newCursorPos = end + 2
        break
      case 'heading':
        // Add heading at the start of the line
        const lineStart = notes.lastIndexOf('\n', start) + 1
        newText = notes.substring(0, lineStart) + `## ` + notes.substring(lineStart)
        newCursorPos = end + 3
        break
      case 'bullet-list':
        // If no text is selected, apply to current line
        if (start === end) {
          const lineStart = notes.lastIndexOf('\n', start) + 1
          newText = notes.substring(0, lineStart) + `- ` + notes.substring(lineStart)
          newCursorPos = end + 2
        } else {
          // If text is selected, apply to each line in selection
          const lines = selectedText.split('\n')
          const formattedLines = lines.map(line => `- ${line}`).join('\n')
          newText = notes.substring(0, start) + formattedLines + notes.substring(end)
          newCursorPos = start + formattedLines.length
        }
        break
      case 'numbered-list':
        // If no text is selected, apply to current line
        if (start === end) {
          const lineStart = notes.lastIndexOf('\n', start) + 1
          newText = notes.substring(0, lineStart) + `1. ` + notes.substring(lineStart)
          newCursorPos = end + 3
        } else {
          // If text is selected, apply to each line in selection
          const lines = selectedText.split('\n')
          const formattedLines = lines.map((line, i) => `${i+1}. ${line}`).join('\n')
          newText = notes.substring(0, start) + formattedLines + notes.substring(end)
          newCursorPos = start + formattedLines.length
        }
        break
      default:
        break
    }
    
    setNotes(newText)
    
    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }
  
  // Clear notes
  const handleClearNotes = () => {
    if (confirm('Are you sure you want to clear all notes?')) {
      setNotes('')
      
      // Get the current session ID
      const sessionId = sessionStorage.getItem('simulation-session-id')
      if (sessionId) {
        // Remove session-specific notes
        sessionStorage.removeItem(`icu-simulation-notes-${sessionId}`)
      }
    }
  }
  
  // Handle keyboard events to prevent conflicts with guidance overlay
  const handleKeyDown = (e) => {
    // Stop propagation for all keyboard events in the notepad
    // This prevents conflicts with other keyboard shortcuts
    e.stopPropagation()
  }
  
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="right" className="p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-left text-md font-semibold">Notepad</SheetTitle>
          </SheetHeader>
          
          {/* Text formatting toolbar */}
          <div className="flex items-center gap-1 p-2 border-b">
            <Toggle size="sm" onClick={() => applyFormatting('bold')} aria-label="Bold">
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle size="sm" onClick={() => applyFormatting('italic')} aria-label="Italic">
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle size="sm" onClick={() => applyFormatting('heading')} aria-label="Heading">
              <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle size="sm" onClick={() => applyFormatting('bullet-list')} aria-label="Bullet List">
              <List className="h-4 w-4" />
            </Toggle>
            <Toggle size="sm" onClick={() => applyFormatting('numbered-list')} aria-label="Numbered List">
              <ListOrdered className="h-4 w-4" />
            </Toggle>
            <div className="ml-auto">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearNotes} 
                className="h-8 px-2 text-muted-foreground hover:text-destructive"
                aria-label="Clear Notes"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Text area */}
          <textarea
            ref={textareaRef}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Take notes here..."
            className="flex-1 w-full p-4 resize-none focus:outline-none bg-background text-sm leading-relaxed"
            autoFocus
            style={{ letterSpacing: '-0.02em', lineHeight: '150%' }}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
} 