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
        content: "Hello, I'm Nurse Sarah. I've been taking care of Mr. Johnson since he was admitted. How can I help you? When you have enough information, you can click the 'X' in the top right to end our conversation."
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
      
      You have access to all of Samuel Johnson's patient data from the EHR, but you should only share information that is specifically asked about. You can make inferences based on the data to help guide the user in their decision-making process.
      
      Patient Information:
      - Samuel Johnson, 68 years old, Male
      - MRN: 123456789
      - Admitted: 2025-03-01 11:00 (6 days ago)
      - Current date/time: 2025-03-06 11:15
      - Alerts: Allergic to Penicillin
      - Chief Complaint: Progressive respiratory failure requiring ICU admission
      - Past Medical History: 
        * Hypertension (diagnosed 2023-08-01)
        * COPD (diagnosed 2021-03-15)
        * Type 2 Diabetes (diagnosed 2023-08-01)
        * Atrial Fibrillation (diagnosed 2025-04-28)
      
      Current Status:
      - The patient was admitted six days ago due to worsening respiratory distress and was intubated shortly after arrival
      - He has been receiving mechanical ventilation and supportive care in the ICU
      - Vital signs have been improving: BP 118/75 mmHg, HR 84 bpm, RR 18 breaths/min, Temp 98.6°F
      - Oxygenation has improved with ventilatory support
      - FIO₂ requirements have gradually decreased from 70% on day 1 to 30% on day 6
      - Spontaneous breathing trials are planned today for potential extubation
      
      Lab Results:
      - WBC trending down: 12.8 (03/01) → 12.3 (03/02) → 11.9 (03/03) → 11.6 (03/04) → 11.4 (03/05) → 11.2 (03/06)
      - Temperature trending down: 100.1°F (03/01) → 99.5°F (03/02) → 99.0°F (03/03) → 98.8°F (03/04) → 98.7°F (03/05) → 98.6°F (03/06)
      - Hemoglobin 10.6 g/dL
      - Creatinine improved from 2.1 to 1.8 mg/dL
      - Glucose improved from 220 to 165 mg/dL
      
      Microbiology:
      - Blood cultures negative
      - Sputum culture positive for Pseudomonas aeruginosa (collected during bronchoscopy on 2025-03-04)
      - Collection context: Sample obtained during routine bronchoscopy for mucus clearance, not due to suspected infection
      - No antibiotics given prior to or immediately after culture collection
      - Organism susceptible to Ciprofloxacin, Levofloxacin, Meropenem, Cefepime
      - Urine culture positive for E. coli
      
      Medications:
      - Norepinephrine 8 mcg/min IV (continuous)
      - Vancomycin 1g IV q12h
      - Piperacillin-Tazobactam 4.5g IV q8h
      - Furosemide 20 mg IV q12h
      - Heparin 5000 units SC q12h
      
      Imaging:
      - Initial chest X-ray showed bilateral infiltrates
      - Recent chest X-ray (2025-03-06) shows significant improvement, infiltrates resolving rapidly
      
      Procedures:
      - Bronchoscopy performed on 2025-03-04 for excess mucus secretion management
      - Note: No empiric antibiotics initiated post-procedure. Sputum culture was collected opportunistically during the procedure, not in response to suspected infection.
      
      Important Instructions:
      1. Begin your first response by greeting the user and mentioning they can click the 'X' in the top right to end the conversation when they have enough information.
      2. You are a nurse, NOT a doctor. Do not make specific prescription recommendations.
      3. Be helpful and provide detailed information when asked, but don't volunteer all information at once.
      4. If asked about treatment recommendations, explain that you can't give specific prescription recommendations, but you can help guide them to make their own decision.
      5. Be somewhat vague but not lacking in detail - provide factual information about the patient's condition, vital signs, and symptoms.
      6. You can share observations and help the user gain insights for their decision-making.
      7. Keep responses conversational and helpful.
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
          max_tokens: 250
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