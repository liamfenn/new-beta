import { Canvas } from '@react-three/fiber'
import { PointerLockControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useState, useEffect } from 'react'
import Room from './components/Room'
import CorridorScene from './components/CorridorScene'
import Modal from './components/Modal'
import EHROverlay from './components/EHROverlay'
import GuidanceOverlay from './components/GuidanceOverlay'
import ClinicalDecision from './components/ClinicalDecision'
import './App.css'

function App() {
  const [isLocked, setIsLocked] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [modalStep, setModalStep] = useState('welcome')
  const [showEHR, setShowEHR] = useState(false)
  const [showInteractPrompt, setShowInteractPrompt] = useState(false)
  const [promptMessage, setPromptMessage] = useState("Press 'E' to interact")
  const [currentScene, setCurrentScene] = useState('corridor') // Start with corridor scene
  const [showClinicalDecision, setShowClinicalDecision] = useState(false)
  const [clinicalRecommendation, setClinicalRecommendation] = useState(null)
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(10 * 60) // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(false)
  
  // Guidance state
  const [currentGuidance, setCurrentGuidance] = useState(null)
  const [guidanceStep, setGuidanceStep] = useState(0)
  const [showTaskList, setShowTaskList] = useState(false)
  const [completedTasks, setCompletedTasks] = useState([])
  
  // Guidance messages sequence - expanded for all 8 scenes
  const guidanceMessages = [
    // Scene 1: ICU Entry
    "Welcome to the ICU simulation. You are now in the corridor. Head to the patient room by following the corridor.",
    
    // Scene 2: Computer Setup
    "Find the door at the end of the corridor and press 'E' to enter the patient room.",
    
    // Scene 3: Initial Contact
    "You're now in the patient room. Look for the EHR terminal and press 'E' to access patient information.",
    
    // Scene 4: Investigation Phase
    "Review the patient's information carefully. You'll need to make a clinical recommendation based on this data.",
    
    // Scene 5: Patient Room Visit
    "Now that you've reviewed the EHR, examine the patient. Look for any visible signs or symptoms.",
    
    // Scene 6: Nurse Interaction
    "Speak with the nurse to get additional information about the patient's condition.",
    
    // Scene 7: Information Synthesis
    "Synthesize all the information you've gathered. Consider the patient's history, current symptoms, and nurse's observations.",
    
    // Scene 8: Clinical Decision
    "Based on your assessment, make a clinical recommendation. Remember, you have limited time to complete this task."
  ]
  
  // Task list corresponding to guidance steps
  const taskList = [
    "Enter the ICU",
    "Access the patient room",
    "Review EHR data",
    "Investigate patient information",
    "Examine the patient",
    "Consult with the nurse",
    "Synthesize information",
    "Make clinical recommendation"
  ]
  
  // Show guidance messages based on current step
  useEffect(() => {
    if (!showModal && guidanceStep < guidanceMessages.length) {
      setCurrentGuidance(guidanceMessages[guidanceStep])
    } else {
      setCurrentGuidance(null)
    }
  }, [showModal, guidanceStep])
  
  // Mark task as completed
  const completeTask = (taskIndex) => {
    if (!completedTasks.includes(taskIndex)) {
      setCompletedTasks(prev => [...prev, taskIndex])
    }
  }
  
  // Advance to next guidance step
  const advanceGuidance = () => {
    // Mark current task as completed
    completeTask(guidanceStep)
    
    // Move to next guidance step
    setGuidanceStep(prev => {
      const nextStep = prev + 1
      return nextStep < guidanceMessages.length ? nextStep : prev
    })
  }
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Timer countdown effect
  useEffect(() => {
    let interval = null
    
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1)
      }, 1000)
    } else if (timeRemaining === 0) {
      // Handle time's up scenario
      setTimerActive(false)
      alert("Time's up! Please make your recommendation now.")
    }
    
    return () => clearInterval(interval)
  }, [timerActive, timeRemaining])
  
  // Start timer when user starts the scenario
  useEffect(() => {
    if (!showModal && !timerActive) {
      setTimerActive(true)
    }
  }, [showModal])
  
  // Update guidance when scene changes
  useEffect(() => {
    if (currentScene === 'room' && guidanceStep < 2) {
      setGuidanceStep(2)
      completeTask(1) // Mark "Access the patient room" as completed
    }
  }, [currentScene, guidanceStep])
  
  // Listen for patient examination event
  useEffect(() => {
    const handlePatientExamined = () => {
      // Mark "Examine the patient" as completed
      completeTask(4)
      
      // Advance to nurse interaction guidance if we're at the patient examination step
      if (guidanceStep === 4) {
        setGuidanceStep(5)
      }
    }
    
    window.addEventListener('patientExamined', handlePatientExamined)
    return () => window.removeEventListener('patientExamined', handlePatientExamined)
  }, [guidanceStep])
  
  // Listen for nurse consultation event
  useEffect(() => {
    const handleNurseConsulted = () => {
      // Mark "Consult with the nurse" as completed
      completeTask(5)
      
      // Advance to information synthesis guidance if we're at the nurse interaction step
      if (guidanceStep === 5) {
        setGuidanceStep(6)
      }
    }
    
    window.addEventListener('nurseConsulted', handleNurseConsulted)
    return () => window.removeEventListener('nurseConsulted', handleNurseConsulted)
  }, [guidanceStep])
  
  // Show clinical decision dialog when time is up or when user completes all tasks
  useEffect(() => {
    if (timeRemaining === 0 || (completedTasks.length >= 6 && guidanceStep === 7)) {
      setShowClinicalDecision(true)
      setTimerActive(false)
      document.exitPointerLock()
    }
  }, [timeRemaining, completedTasks.length, guidanceStep])
  
  // Handle clinical recommendation submission
  const handleClinicalDecision = (decision) => {
    setClinicalRecommendation(decision)
    completeTask(7) // Mark "Make clinical recommendation" as completed
    
    // Show completion message
    alert(`Recommendation submitted: ${decision.recommendation}\n\nThank you for completing the ICU simulation!`)
  }

  const handleLock = () => {
    if (!showModal) {
      setIsLocked(true)
    } else {
      document.exitPointerLock()
    }
  }

  // Function to toggle between scenes
  const toggleScene = () => {
    // Reset the EHR state when switching scenes
    setShowEHR(false)
    setCurrentScene(currentScene === 'room' ? 'corridor' : 'room')
    
    // If moving from corridor to room, mark the first task as completed
    if (currentScene === 'corridor') {
      completeTask(0) // Mark "Enter the ICU" as completed
    }
  }
  
  // Function to handle interaction prompts with custom messages
  const handlePrompt = (show, message = "Press 'E' to interact") => {
    if (show) {
      setShowInteractPrompt(true)
      setPromptMessage(message)
    } else {
      setShowInteractPrompt(false)
    }
  }

  // Toggle task list visibility
  const toggleTaskList = () => {
    setShowTaskList(prev => !prev)
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Countdown Timer */}
      {timerActive && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-full text-xl font-bold z-10">
          {formatTime(timeRemaining)}
        </div>
      )}
      
      {/* Task List Button */}
      {!showModal && (
        <button 
          onClick={toggleTaskList}
          className="fixed top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded z-10 transition-colors"
        >
          Tasks
        </button>
      )}
      
      {/* Task List Overlay */}
      {showTaskList && (
        <div className="fixed top-16 right-4 bg-black/75 text-white p-4 rounded-lg z-10 w-64">
          <h3 className="text-lg font-bold mb-2">Tasks</h3>
          <ul className="space-y-1">
            {taskList.map((task, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className={`w-4 h-4 inline-block border ${completedTasks.includes(index) ? 'bg-green-500 border-green-500' : 'border-white'} rounded-sm`}>
                  {completedTasks.includes(index) && (
                    <span className="text-white text-xs flex justify-center">✓</span>
                  )}
                </span>
                <span className={completedTasks.includes(index) ? 'line-through opacity-70' : ''}>{task}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={toggleTaskList}
            className="mt-3 text-xs text-white/70 hover:text-white"
          >
            Close
          </button>
        </div>
      )}
      
      {/* Guidance overlay */}
      {currentGuidance && !showModal && !showEHR && (
        <GuidanceOverlay 
          message={currentGuidance} 
          onDismiss={advanceGuidance}
          autoHide={false}
        />
      )}
      
      {showModal && (
        <div 
          className="absolute inset-0 bg-black/70"
          style={{ zIndex: 1 }}
        />
      )}
      <Canvas 
        style={{ background: '#000' }}
        camera={{ fov: 75, near: 0.1, far: 1000 }}
      >
        <Suspense fallback={null}>
          {currentScene === 'room' ? (
            <Room 
              isLocked={isLocked} 
              onShowEHR={setShowEHR}
              onShowPrompt={handlePrompt}
              onSwitchScene={toggleScene}
            />
          ) : (
            <CorridorScene 
              isLocked={isLocked} 
              onShowEHR={setShowEHR}
              onShowPrompt={handlePrompt}
              onSwitchScene={toggleScene}
            />
          )}
          {!showModal && !showEHR && (
            <PointerLockControls 
              onLock={handleLock}
              onUnlock={() => setIsLocked(false)}
            />
          )}
          {currentScene === 'room' && (
            <PerspectiveCamera 
              makeDefault 
              position={[3, 1.7, 0]}
              rotation={[0, 2.5, 0]}
            />
          )}
          {currentScene === 'corridor' && (
            <PerspectiveCamera 
              makeDefault 
              position={[0, 1.7, 0]}
              rotation={[0, Math.PI, 0]}
            />
          )}
          <ambientLight intensity={0.5} />
        </Suspense>
      </Canvas>
      
      {showModal && (
        <Modal 
          step={modalStep}
          onBegin={(step) => setModalStep(step)}
          onStart={() => {
            setShowModal(false)
            setIsLocked(true)
          }}
        />
      )}
      
      {!isLocked && !showModal && !showEHR && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white select-none">
          Click to start
          <br />
          (WASD to move, Mouse to look)
          <br />
          ESC to exit
        </div>
      )}

      {showInteractPrompt && !showEHR && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded">
          {promptMessage}
        </div>
      )}

      {/* Clinical Decision Button - shown when all previous tasks are completed */}
      {!showModal && !showEHR && !showClinicalDecision && completedTasks.length >= 6 && (
        <button 
          onClick={() => {
            setShowClinicalDecision(true)
            document.exitPointerLock()
          }}
          className="fixed bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded z-10 transition-colors"
        >
          Make Clinical Decision
        </button>
      )}
      
      {/* Clinical Decision Overlay */}
      {showClinicalDecision && (
        <ClinicalDecision 
          onClose={() => {
            setShowClinicalDecision(false)
            setIsLocked(true)
          }}
          onSubmit={handleClinicalDecision}
        />
      )}

      {showEHR && (
        <EHROverlay onClose={() => {
          setShowEHR(false)
          setIsLocked(true)
          
          // Advance guidance when EHR is closed
          if (guidanceStep === 3) {
            advanceGuidance()
          }
          
          // Mark "Review EHR data" as completed
          completeTask(2)
          
          // Mark "Investigate patient information" as completed after reviewing EHR
          if (guidanceStep === 3) {
            completeTask(3)
          }
        }} />
      )}
    </div>
  )
}

export default App
