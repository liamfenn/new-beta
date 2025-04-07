import { useState } from 'react'

export default function DecisionMaker({ isOpen, onClose, onSubmit }) {
  const [decision, setDecision] = useState('')
  const [reasoning, setReasoning] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = () => {
    if (!decision) return
    
    setIsSubmitting(true)
    
    // Submit the decision
    onSubmit({
      decision,
      reasoning
    })
    
    // Reset form
    setDecision('')
    setReasoning('')
    setIsSubmitting(false)
    
    // Close the modal
    onClose()
  }
  
  if (!isOpen) return null
  
  const options = [
    { value: 'extubate', label: 'Proceed with extubation' },
    { value: 'delay', label: 'Delay extubation for 24 hours' },
    { value: 'consult', label: 'Request pulmonology consult' },
    { value: 'antibiotics', label: 'Start antibiotics and reassess' },
    { value: 'culture', label: 'Order additional cultures' }
  ]
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl flex flex-col">
        <div className="bg-gray-100 p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold">Generate Clinical Recommendation</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              What is your recommendation?
            </label>
            <div className="space-y-2">
              {options.map(option => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={option.value}
                    name="decision"
                    value={option.value}
                    checked={decision === option.value}
                    onChange={() => setDecision(option.value)}
                    className="mr-2"
                  />
                  <label htmlFor={option.value} className="text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Clinical Reasoning
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Explain your clinical reasoning..."
            />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!decision || isSubmitting}
              className={`px-4 py-2 rounded ${!decision || isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Decision'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 