import { useState } from 'react'

export default function ClinicalDecision({ onClose, onSubmit }) {
  const [selectedOption, setSelectedOption] = useState('')
  const [justification, setJustification] = useState('')
  const [error, setError] = useState('')
  
  const options = [
    "Administer supplemental oxygen",
    "Intubate the patient",
    "Administer bronchodilators",
    "Order chest X-ray",
    "Transfer to ICU",
    "Administer antibiotics",
    "Consult pulmonology"
  ]
  
  const handleSubmit = () => {
    if (!selectedOption) {
      setError('Please select a clinical recommendation')
      return
    }
    
    if (justification.length < 20) {
      setError('Please provide a more detailed justification')
      return
    }
    
    onSubmit({
      recommendation: selectedOption,
      justification
    })
    
    onClose()
  }
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Clinical Recommendation</h2>
          
          <p className="mb-6 text-gray-700">
            Based on your assessment of the patient, please select your clinical recommendation and provide justification.
          </p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Select Recommendation:</h3>
            <div className="space-y-2">
              {options.map((option) => (
                <div key={option} className="flex items-start">
                  <input
                    type="radio"
                    id={option}
                    name="recommendation"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => setSelectedOption(option)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor={option} className="text-gray-800">{option}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Justification:</h3>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Provide detailed justification for your recommendation..."
              className="w-full h-32 p-2 border border-gray-300 rounded"
            />
          </div>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Submit Recommendation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 