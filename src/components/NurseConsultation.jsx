import { useState, useRef, useEffect } from 'react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from './ui/sheet'
import { Button } from './ui/button'
import { Loader2, Send } from 'lucide-react'

export default function NurseConsultation({ onClose, onSubmit }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  // Load chat history from sessionStorage on mount
  useEffect(() => {
    // Get the current session ID
    const sessionId = sessionStorage.getItem('simulation-session-id')
    if (!sessionId) return
    
    // Use session-specific key for chat history
    const savedMessages = sessionStorage.getItem(`icu-simulation-nurse-chat-${sessionId}`)
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      // Add initial nurse greeting
      const initialMessage = {
        role: 'assistant',
        content: "Hello, I'm Nurse Sarah. I've been taking care of Mr. Johnson since he was admitted yesterday. How can I help you?"
      }
      setMessages([initialMessage])
      
      // Save to session storage
      if (sessionId) {
        sessionStorage.setItem(`icu-simulation-nurse-chat-${sessionId}`, JSON.stringify([initialMessage]))
      }
    }
  }, [])
  
  // Save chat history to sessionStorage when it changes
  useEffect(() => {
    if (messages.length === 0) return
    
    // Get the current session ID
    const sessionId = sessionStorage.getItem('simulation-session-id')
    if (!sessionId) return
    
    // Use session-specific key for chat history
    sessionStorage.setItem(`icu-simulation-nurse-chat-${sessionId}`, JSON.stringify(messages))
  }, [messages])
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Focus input field when component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return
    
    const userMessage = {
      role: 'user',
      content: inputValue.trim()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    
    try {
      const nurseResponse = await getNurseResponse([...messages, userMessage])
      setMessages(prev => [...prev, nurseResponse])
    } catch (error) {
      console.error('Error getting nurse response:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble communicating right now. Could you repeat that?"
      }])
    } finally {
      setIsLoading(false)
    }
  }
  
  const getNurseResponse = async (messageHistory) => {
    // Get API key from environment variable
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    
    if (!apiKey) {
      console.error('OpenAI API key not found in environment variables')
      return {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble communicating right now."
      }
    }
    
    const nurseContext = `
      You are Nurse Sarah, an experienced ICU nurse who has been caring for the patient Samuel Johnson.
      
      Patient Information:
      - Samuel Johnson, 68 years old
      - Chief Complaint: Progressive respiratory failure requiring ICU admission
      - Past Medical History: Hypertension, COPD, Type 2 Diabetes, Atrial Fibrillation
      
      Current Status:
      - The patient was admitted six days ago due to worsening respiratory distress and was intubated shortly after arrival
      - He has been receiving mechanical ventilation and supportive care in the ICU
      - Vital signs indicate an elevated heart rate, borderline blood pressure, and persistent tachypnea
      - Oxygenation has improved with ventilatory support
      - The medical team is currently evaluating his readiness for extubation
      
      Lab Results:
      - Elevated white blood cell count and inflammatory markers
      - Suggestive of an ongoing infectious or inflammatory process
      
      Imaging:
      - Chest X-ray shows bilateral infiltrates, more pronounced in the lower lobes
      - Consistent with pneumonia or ARDS
      
      Respiratory Status:
      - FIO₂ requirements have gradually decreased over the past few days
      - Spontaneous breathing trials are planned for today to assess readiness for extubation
      
      Important Instructions:
      1. You are a nurse, NOT a doctor. Do not make clinical recommendations or suggest specific treatments.
      2. Do not suggest or recommend any medications or antibiotics under any circumstances.
      3. If asked about treatment recommendations, politely explain that's the doctor's decision.
      4. Be helpful but somewhat vague about the diagnosis - share observations but not conclusions.
      5. Provide factual information about the patient's condition, vital signs, and symptoms.
      6. Keep responses relatively brief (2-4 sentences) and conversational.
      7. If asked about your opinion, you can share observations but emphasize that the doctor needs to make the final assessment.
    `
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: nurseContext
            },
            ...messageHistory
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      })
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      
      const data = await response.json()
      return {
        role: 'assistant',
        content: data.choices[0].message.content
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error)
      return {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble communicating right now."
      }
    }
  }
  
  const handleKeyDown = (e) => {
    // Submit on Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
    
    // Stop propagation for all keyboard events
    e.stopPropagation()
  }
  
  return (
    <Sheet open={true} onOpenChange={(open) => {
      // Only allow closing if we're not loading
      if (!isLoading) {
        // Mark the task as complete when the user closes the sheet
        onSubmit()
        onClose()
      }
    }}>
      <SheetContent side="right" className="p-0 overflow-hidden sm:max-w-lg">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-left text-md font-semibold">Nurse Consultation</SheetTitle>
          </SheetHeader>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-3 py-2 text-sm ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-lg rounded-tr-none' 
                      : 'text-foreground rounded-lg'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-3 py-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question to the nurse..."
                className="flex-1 h-10 p-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                className="h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 