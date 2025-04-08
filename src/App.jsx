import { Canvas } from '@react-three/fiber'
import { PointerLockControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useState, useEffect, useRef } from 'react'
import Room from './components/Room'
import CorridorScene from './components/CorridorScene'
import Modal from './components/Modal'
import EHROverlay from './components/EHROverlay'
import GuidanceOverlay from './components/GuidanceOverlay'
import ClinicalDecision from './components/ClinicalDecision'
import CommandMenu from './components/CommandMenu'
import Notepad from './components/Notepad'
import Guide from './components/Guide'
import Scenario from './components/Scenario'
import TaskList from './components/TaskList'
import NurseConsultation from './components/NurseConsultation'
import PatientExamination from './components/PatientExamination'
import LookAroundPrompt from './components/LookAroundPrompt'
import MobileWarning from './components/MobileWarning'
import { cn } from './lib/utils'

function App() {
  const [isLocked, setIsLocked] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [modalStep, setModalStep] = useState('welcome')
  const [showEHR, setShowEHR] = useState(false)
  const [ehrWasShown, setEhrWasShown] = useState(false)
  const [showInteractPrompt, setShowInteractPrompt] = useState(false)
  const [promptMessage, setPromptMessage] = useState("Press 'E' to engage")
  const [currentScene, setCurrentScene] = useState('corridor') // Start with corridor scene
  const [showClinicalDecision, setShowClinicalDecision] = useState(false)
  const [clinicalRecommendation, setClinicalRecommendation] = useState(null)
  const [savedRecommendationText, setSavedRecommendationText] = useState('') // Add state for saved recommendation text
  const [showNurseConsultation, setShowNurseConsultation] = useState(false)
  const [showPatientExamination, setShowPatientExamination] = useState(false)
  const [showNotepad, setShowNotepad] = useState(false)
  const [showScenario, setShowScenario] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showTaskList, setShowTaskList] = useState(false)
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(10 * 60) // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(false)
  
  // Guidance state
  const [currentGuidance, setCurrentGuidance] = useState(null)
  const [guidanceStep, setGuidanceStep] = useState(0)
  const [completedTasks, setCompletedTasks] = useState([])
  const [currentActiveTask, setCurrentActiveTask] = useState(0) // Track the current active task
  
  // Task list
  const taskList = [
    "Enter the ICU room",
    "Access patient EHR",
    "Examine patient",
    "Consult with nurse",
    "Make clinical recommendation"
  ]
  
  // Guidance messages sequence
  const guidanceMessages = [
    // Scene 1: ICU Entry
    "Enter the ICU room 3 doors down on your right.",
    
    // Scene 2: EHR Access
    "Walk up to the EHR terminal in the corner and press 'E' to access the patient's electronic health record.",
    
    // Scene 3: Patient Examination
    "Now that you've reviewed the EHR, examine the patient. Look for any visible signs or symptoms.",
    
    // Scene 4: Nurse Interaction
    "Exit the room and speak with the nurse at the end of the corridor to get additional information about the patient's condition.",
    
    // Scene 5: Information Synthesis
    "Take a moment to review your notes and synthesize all the information you've gathered. Consider the patient's history, current symptoms, and nurse's observations before making your clinical recommendation."
  ]
  
  // Task interaction types - defines what type of interaction is needed for each task
  const taskInteractionTypes = [
    "corridor-to-room", // Enter the ICU room - transition from corridor to room
    "ehr-access",       // Access patient EHR - access EHR terminal
    "patient-exam",     // Examine patient - interact with patient
    "nurse-consult",    // Consult with nurse - interact with nurse
    "decision"          // Make clinical recommendation - open clinical decision
  ]
  
  // Reference to the PointerLockControls component
  const controlsRef = useRef(null)
  
  // Check if any overlay is open
  const isAnyOverlayOpen = showModal || showEHR || showClinicalDecision || 
                           showNurseConsultation || showPatientExamination || 
                           showNotepad || showScenario || showGuide || showTaskList
  
  // Effect to handle cursor locking based on overlay state
  useEffect(() => {
    if (isAnyOverlayOpen) {
      // Ensure cursor is unlocked when any overlay is open
      if (document.pointerLockElement) {
        document.exitPointerLock()
      }
      // Set isLocked to false to prevent auto-locking
      setIsLocked(false)
      
      // Force the cursor to be visible by moving it
      // This helps in cases where the cursor might be hidden
      const moveCursor = () => {
        const event = new MouseEvent('mousemove', {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2
        })
        document.dispatchEvent(event)
      }
      
      // Apply multiple times to ensure it works
      moveCursor()
      setTimeout(moveCursor, 50)
      setTimeout(moveCursor, 100)
    }
  }, [isAnyOverlayOpen])
  
  // Show guidance messages based on current step when timer is active
  useEffect(() => {
    const sessionId = sessionStorage.getItem('simulation-session-id') || 
                     Date.now().toString();
    sessionStorage.setItem('simulation-session-id', sessionId);
    
    const hiddenStep = sessionStorage.getItem(`hidden-guidance-step-${sessionId}`)
    
    // Only show guidance if timer is active and the step is not hidden
    if (timerActive && guidanceStep !== parseInt(hiddenStep) && guidanceMessages[guidanceStep]) {
      setCurrentGuidance(guidanceMessages[guidanceStep])
    } else if (!timerActive) {
      // Clear guidance when timer is not active
      setCurrentGuidance(null)
    }
  }, [guidanceStep, guidanceMessages, timerActive])
  
  // Show first guidance when timer starts
  useEffect(() => {
    if (timerActive && !currentGuidance && guidanceMessages[guidanceStep]) {
      const sessionId = sessionStorage.getItem('simulation-session-id') || Date.now().toString();
      const hiddenStep = sessionStorage.getItem(`hidden-guidance-step-${sessionId}`);
      
      if (guidanceStep !== parseInt(hiddenStep)) {
        setCurrentGuidance(guidanceMessages[guidanceStep]);
      }
    }
  }, [timerActive, currentGuidance, guidanceMessages, guidanceStep]);
  
  // Update current active task when completed tasks change
  useEffect(() => {
    if (completedTasks.length > 0) {
      // Find the next uncompleted task
      for (let i = 0; i < taskList.length; i++) {
        if (!completedTasks.includes(i)) {
          setCurrentActiveTask(i)
          break
        }
      }
    } else {
      setCurrentActiveTask(0) // Start with the first task
    }
  }, [completedTasks, taskList.length])
  
  // Function to complete a task
  const completeTask = (taskIndex) => {
    if (!completedTasks.includes(taskIndex)) {
      setCompletedTasks(prev => [...prev, taskIndex])
      
      // If this is the current active task, move to the next one
      if (taskIndex === currentActiveTask) {
        setCurrentActiveTask(taskIndex + 1) // Use taskIndex instead of prev to ensure sequential progression
      }
    }
  }
  
  // Update isInteractionAllowed to check completed tasks properly
  const isInteractionAllowed = (interactionType) => {
    // 1. It's the interaction type required for the current active task
    const requiredInteraction = taskInteractionTypes[currentActiveTask]
    
    // 2. It's an interaction type from a task that has already been completed
    const isCompletedTaskInteraction = completedTasks.some(taskIndex => 
      taskInteractionTypes[taskIndex] === interactionType
    )
    
    // Always allow EHR interaction after entering the room (task 0)
    if (interactionType === 'ehr-access' && completedTasks.includes(0)) {
      return true
    }
    
    // Always allow patient examination after EHR access (task 1)
    if (interactionType === 'patient-exam' && completedTasks.includes(1)) {
      return true
    }
    
    // Always allow nurse interaction after patient examination (task 2)
    if (interactionType === 'nurse-consult' && completedTasks.includes(2)) {
      return true
    }
    
    return interactionType === requiredInteraction || isCompletedTaskInteraction
  }
  
  // Advance to next guidance step
  const advanceGuidance = (skipMarkingComplete = false) => {
    // Mark current task as completed (unless skipMarkingComplete is true)
    if (!skipMarkingComplete) {
      completeTask(guidanceStep)
    }
    
    // Clear any hidden guidance step
    sessionStorage.removeItem('hidden-guidance-step')
    
    // Move to next guidance step
    setGuidanceStep(prev => {
      const nextStep = prev + 1
      if (nextStep < guidanceMessages.length) {
        // Immediately set the next guidance message
        setCurrentGuidance(guidanceMessages[nextStep])
        return nextStep
      }
      return prev
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
      
      // Clear notes when starting a new simulation run
      sessionStorage.removeItem('icu-simulation-notes')
      
      // Set simulation active flag
      sessionStorage.setItem('icu-simulation-active', 'true')
    }
  }, [showModal])
  
  // Clear simulation active flag when component unmounts
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('icu-simulation-active')
    }
  }, [])
  
  // Listen for EHR access event
  useEffect(() => {
    const handleEHRAccessed = () => {
      // We don't need to mark the task as completed here
      // It will be marked when the EHR is closed
      
      // Set EHR as shown
      setEhrWasShown(true)
    }
    
    window.addEventListener('ehrAccessed', handleEHRAccessed)
    return () => window.removeEventListener('ehrAccessed', handleEHRAccessed)
  }, [])
  
  // Function to handle nurse consultation
  const handleNurseConsulted = () => {
    console.log("Nurse consultation triggered")
    
    // Open the nurse consultation interface
    setShowNurseConsultation(true)
    
    // Unlock the cursor
    setIsLocked(false)
    
    // Add a timeout to check if the state was updated
    setTimeout(() => {
      console.log("Nurse consultation state:", showNurseConsultation)
    }, 100)
  }
  
  // Function to handle nurse consultation completion
  const handleNurseConsultationComplete = () => {
    // Mark "Consult with nurse" as completed
    completeTask(3)
    
    // Advance to information synthesis guidance if we're at the nurse interaction step
    if (guidanceStep === 3) {
      advanceGuidance()
      // Let the user decide when to review their notes
    }
  }
  
  // Function to handle patient examination
  const handlePatientExamined = () => {
    // Open the patient examination interface
    setShowPatientExamination(true)
    
    // Unlock the cursor
    setIsLocked(false)
  }
  
  // Function to handle patient examination completion
  const handlePatientExaminationComplete = () => {
    // Mark "Examine patient" as completed
    completeTask(2)
    
    // Advance to nurse interaction guidance if we're at the patient examination step
    if (guidanceStep === 2) {
      advanceGuidance()
    }
  }
  
  // Listen for nurse consultation event
  useEffect(() => {
    console.log("Setting up nurse consultation event listener")
    
    const handleNurseConsultedEvent = (event) => {
      console.log("Nurse consultation event received")
      handleNurseConsulted()
    }
    
    window.addEventListener('nurseConsulted', handleNurseConsultedEvent)
    
    return () => {
      console.log("Removing nurse consultation event listener")
      window.removeEventListener('nurseConsulted', handleNurseConsultedEvent)
    }
  }, [])
  
  // Listen for patient examination event
  useEffect(() => {
    window.addEventListener('patientExamined', handlePatientExamined)
    return () => window.removeEventListener('patientExamined', handlePatientExamined)
  }, [])
  
  // Show clinical decision dialog when time is up
  useEffect(() => {
    if (timeRemaining === 0) {
      setShowClinicalDecision(true)
      setTimerActive(false)
    }
  }, [timeRemaining])
  
  // Add keydown handler for 'r' key to return to clinical recommendation
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Only respond to 'r' key when no overlays are open
      if (e.key.toLowerCase() === 'r' && !isAnyOverlayOpen && 
          // Only allow re-opening if we've completed enough tasks (currentActiveTask >= 4)
          // or already have a saved recommendation in progress
          (currentActiveTask >= 4 || savedRecommendationText)) {
        e.preventDefault();
        setShowClinicalDecision(true);
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isAnyOverlayOpen, currentActiveTask, savedRecommendationText]);
  
  // Handle clinical recommendation submission
  const handleClinicalDecision = (decision) => {
    // Check if this is a final submission or just saving progress
    if (decision.isComplete === false) {
      // Just save the text for later and don't mark the task as completed
      setSavedRecommendationText(decision.recommendation);
      return;
    }
    
    // This is a final submission
    setClinicalRecommendation(decision);
    setSavedRecommendationText(''); // Clear saved text since we've submitted
    completeTask(4); // Mark "Make clinical recommendation" as completed
    
    // Show completion message with evaluation feedback if available
    if (decision.evaluation && decision.evaluation.status === 'success') {
      const { rating, summary } = decision.evaluation;
      let completionMessage = "Simulation completed! ";
      
      if (rating === 'green') {
        completionMessage += "Excellent work! " + summary;
      } else if (rating === 'yellow') {
        completionMessage += "Good attempt. " + summary;
      } else if (rating === 'red') {
        completionMessage += "Review needed. " + summary;
      }
      
      setCurrentGuidance(completionMessage);
    } else {
      setCurrentGuidance("Simulation completed! Thank you for your participation.");
    }
  }

  const handleLock = () => {
    if (!isAnyOverlayOpen) {
      setIsLocked(true)
      
      // If timer is active, show the current guidance
      if (timerActive) {
        const sessionId = sessionStorage.getItem('simulation-session-id') || Date.now().toString();
        const hiddenStep = sessionStorage.getItem(`hidden-guidance-step-${sessionId}`);
        
        if (guidanceStep !== parseInt(hiddenStep) && guidanceMessages[guidanceStep]) {
          setCurrentGuidance(guidanceMessages[guidanceStep]);
        }
      }
    }
  }

  // Function to toggle between scenes
  const toggleScene = () => {
    // Only allow scene transition if it's the current active task
    if (isInteractionAllowed("corridor-to-room")) {
      // Reset the EHR state when switching scenes
      setShowEHR(false)
      setCurrentScene(currentScene === 'room' ? 'corridor' : 'room')
      
      // Ensure the pointer is unlocked during scene transition
      if (document.pointerLockElement) {
        document.exitPointerLock()
      }
      setIsLocked(false)
      
      // If moving from corridor to room, mark the first task as completed
      if (currentScene === 'corridor') {
        completeTask(0) // Mark "Enter the ICU room" as completed
        
        // Explicitly set the guidance step to 1 (EHR access) and show the guidance
        if (guidanceStep === 0) {
          setGuidanceStep(1)
          setCurrentGuidance(guidanceMessages[1])
          
          // Ensure the current active task is set to 1 (Access patient EHR)
          if (currentActiveTask === 0) {
            setCurrentActiveTask(1)
          }
        }
      }
    } else {
      // Show a message that this interaction is not available yet
      alert("Complete your current task first: " + taskList[currentActiveTask])
    }
  }
  
  // Function to handle interaction prompts with custom messages
  const handlePrompt = (show, message = "Press 'E' to engage", type = null) => {
    if (show) {
      setShowInteractPrompt(true)
      setPromptMessage(message)
      // Store the interaction type to use for coloring
      sessionStorage.setItem('current-interaction-type', type || '')
    } else {
      setShowInteractPrompt(false)
    }
  }

  // Toggle task list visibility
  const toggleTaskList = () => {
    // First unlock the pointer if showing task list
    if (!showTaskList && document.pointerLockElement) {
      document.exitPointerLock()
    }
    
    // Then set state after a small delay if showing
    if (!showTaskList) {
      setTimeout(() => {
        setShowTaskList(true)
        setIsLocked(false)
        
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
    } else {
      // Just hide immediately if already showing
      setShowTaskList(false)
      
      // Only re-lock cursor if no other overlays are open
      if (!showModal && !showEHR && !showClinicalDecision && 
          !showNotepad && !showScenario && !showGuide) {
        // Small delay to ensure DOM updates before locking
        setTimeout(() => {
          setIsLocked(true)
        }, 50)
      }
    }
  }

  // Handle menu actions
  const handleOpenNotepad = () => {
    // First unlock the pointer
    if (document.pointerLockElement) {
      document.exitPointerLock()
    }
    
    // Then set state after a small delay
    setTimeout(() => {
      setShowNotepad(true)
      setIsLocked(false)
      
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
  
  const handleOpenScenario = () => {
    // First unlock the pointer
    if (document.pointerLockElement) {
      document.exitPointerLock()
    }
    
    // Then set state after a small delay
    setTimeout(() => {
      setShowScenario(true)
      setIsLocked(false)
      
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
  
  const handleOpenGuide = () => {
    // First unlock the pointer
    if (document.pointerLockElement) {
      document.exitPointerLock()
    }
    
    // Then set state after a small delay
    setTimeout(() => {
      setShowGuide(true)
      setIsLocked(false)
      
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
  
  // Close overlays and return to game
  const handleCloseOverlay = () => {
    // Close all overlays
    if (showNotepad) setShowNotepad(false)
    if (showScenario) setShowScenario(false)
    if (showGuide) setShowGuide(false)
    if (showTaskList) setShowTaskList(false)
    if (showNurseConsultation) setShowNurseConsultation(false)
    if (showPatientExamination) {
      setShowPatientExamination(false)
      handlePatientExaminationComplete()
    }
    
    // Only re-lock cursor if no other overlays are open
    if (!showModal && !showEHR && !showClinicalDecision) {
      // First, make sure isLocked is false to trigger state changes in LookAroundPrompt
      setIsLocked(false)
      
      // Small delay to ensure DOM updates before attempting to lock
      setTimeout(() => {
        // We need to attempt to re-lock, but let the user click to actually lock it
        if (controlsRef.current) {
          // This ensures our LookAroundPrompt will be visible
          // The actual locking will happen when the user clicks
          controlsRef.current.unlock()
        }
      }, 50)
    }
  }

  // Function to handle EHR overlay closing
  const handleEHRClose = () => {
    setShowEHR(false)
    setEhrWasShown(false)
    
    // Only re-lock cursor if no other overlays are open
    if (!showModal && !showClinicalDecision && 
        !showNotepad && !showScenario && !showGuide && !showTaskList) {
      // First, make sure isLocked is false to trigger state changes in LookAroundPrompt
      setIsLocked(false)
      
      // Small delay to ensure DOM updates before attempting to lock
      setTimeout(() => {
        // We need to attempt to re-lock, but let the user click to actually lock it
        if (controlsRef.current) {
          // This ensures our LookAroundPrompt will be visible
          // The actual locking will happen when the user clicks
          controlsRef.current.unlock()
        }
      }, 50)
    }
    
    // Mark "Access patient EHR" as completed
    completeTask(1)
    
    // Advance guidance to the next step (patient examination)
    if (guidanceStep === 1) {
      advanceGuidance()
    }
  }

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining <= 120) { // 2 minutes or less
      return 'bg-red-500/90 border-red-600 text-white'
    } else if (timeRemaining <= 300) { // 5 minutes or less
      return 'bg-yellow-500/90 border-yellow-600 text-white'
    } else {
      return 'bg-background/90 border-border text-foreground'
    }
  }

  // Get the border color for the interaction prompt based on the task type
  const getInteractionPromptBorderColor = () => {
    // Check if this is a "Complete current task first" message
    if (promptMessage === "Complete current task first" || promptMessage === "Complete your current task first") {
      return 'border-black'
    }
    
    const type = sessionStorage.getItem('current-interaction-type')
    
    switch (type) {
      case 'corridor-to-room':
        return 'border-purple-500' // Purple for room transitions
      case 'ehr-access':
        return 'border-blue-500' // Blue for EHR
      case 'patient-exam':
        return 'border-orange-500' // Orange for patient exam
      case 'nurse-consult':
        return 'border-blue-500' // Blue for nurse consultation
      default:
        return 'border-yellow-400' // Default yellow
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Mobile Warning */}
      <MobileWarning />
      
      {/* Countdown Timer */}
      {timerActive && (
        <div className={`fixed top-0 left-1/2 -translate-x-1/2 ${getTimerColor()} border px-4 py-2 rounded-b-lg z-10 transition-colors duration-300`}>
          <span className="text-lg font-medium">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </span>
        </div>
      )}
      
      {/* Container for prompt and guidance overlay */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 max-w-md w-[90%] md:w-[450px]">
        {/* Interaction prompt - positioned higher to avoid overlap with the collapse button */}
        {showInteractPrompt && !showEHR && (
          <div className={`bg-background border-2 ${getInteractionPromptBorderColor()} text-foreground px-4 py-2 rounded-lg shadow-md inline-block mb-9`}>
            <p className="text-sm">{promptMessage}</p>
          </div>
        )}
        
        {/* Guidance overlay */}
        {currentGuidance && (
          <GuidanceOverlay
            message={currentGuidance}
            onDismiss={advanceGuidance}
            isFinalStep={guidanceStep === 4} // Final step is the synthesis step
            onMakeDecision={() => setShowClinicalDecision(true)}
          />
        )}
      </div>
      
      {showModal && (
        <div 
          className="absolute inset-0 bg-black/70"
          style={{ zIndex: 1 }}
        />
      )}
      
      {/* Canvas for 3D scene */}
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
              currentActiveTask={currentActiveTask}
              isInteractionAllowed={isInteractionAllowed}
            />
          ) : (
            <CorridorScene 
              isLocked={isLocked} 
              onShowEHR={setShowEHR}
              onShowPrompt={handlePrompt}
              onSwitchScene={toggleScene}
              currentActiveTask={currentActiveTask}
              isInteractionAllowed={isInteractionAllowed}
            />
          )}
          {!isAnyOverlayOpen && (
            <PointerLockControls 
              ref={controlsRef}
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
      
      {/* Modal screens */}
      {showModal && (
        <Modal 
          step={modalStep}
          onContinue={setModalStep}
          onStart={() => {
            setShowModal(false)
            setTimerActive(true)
            // Reset any hidden guidance steps when starting a new session
            const sessionId = Date.now().toString();
            sessionStorage.setItem('simulation-session-id', sessionId);
            // Ensure the first guidance message appears
            setCurrentGuidance(guidanceMessages[0]);
            // Clear any notes from previous sessions
            // We don't need to remove old notes as they'll be tied to their own session IDs
          }}
        />
      )}
      
      {/* Menu Bar */}
      {!showModal && !showEHR && !showClinicalDecision && !showNotepad && !showScenario && !showGuide && !showTaskList && (
        <>
          <CommandMenu 
            onToggleTaskList={toggleTaskList}
            onOpenNotepad={handleOpenNotepad}
            onOpenScenario={handleOpenScenario}
            onOpenGuide={handleOpenGuide}
          />
          <div className="fixed bottom-4 right-4 text-sm text-muted-foreground">
            <kbd className="px-2 py-1 bg-muted rounded-md mr-1">⌘</kbd>
            <kbd className="px-2 py-1 bg-muted rounded-md">K</kbd>
            <span className="ml-2">for menu</span>
          </div>
        </>
      )}
      
      {/* Notepad Overlay */}
      {showNotepad && (
        <Notepad onClose={handleCloseOverlay} />
      )}
      
      {/* Scenario Overlay */}
      {showScenario && (
        <Scenario onClose={handleCloseOverlay} />
      )}
      
      {/* Guide Overlay */}
      {showGuide && (
        <Guide onClose={handleCloseOverlay} />
      )}
      
      {/* Task List Overlay */}
      {showTaskList && (
        <TaskList 
          onClose={handleCloseOverlay} 
          taskList={taskList}
          completedTasks={completedTasks}
          currentActiveTask={currentActiveTask}
        />
      )}
      
      {/* Nurse Consultation Overlay */}
      {showNurseConsultation && (
        <NurseConsultation 
          onClose={handleCloseOverlay}
          onSubmit={handleNurseConsultationComplete}
        />
      )}
      
      {/* Patient Examination Overlay */}
      {showPatientExamination && (
        <PatientExamination 
          onClose={handleCloseOverlay}
        />
      )}
      
      {/* EHR Overlay */}
      {showEHR && (
        <EHROverlay onClose={handleEHRClose} />
      )}
      
      {/* Clinical Decision Overlay */}
      {showClinicalDecision && (
        <ClinicalDecision 
          onClose={() => {
            setShowClinicalDecision(false)
            
            // Only re-lock cursor if no other overlays are open
            if (!showModal && !showEHR && 
                !showNotepad && !showScenario && !showGuide && !showTaskList) {
              // First, make sure isLocked is false to trigger state changes in LookAroundPrompt
              setIsLocked(false)
              
              // Small delay to ensure DOM updates before attempting to lock
              setTimeout(() => {
                // We need to attempt to re-lock, but let the user click to actually lock it
                if (controlsRef.current) {
                  // This ensures our LookAroundPrompt will be visible
                  // The actual locking will happen when the user clicks
                  controlsRef.current.unlock()
                }
              }, 50)
            }
          }}
          onSubmit={handleClinicalDecision}
          initialRecommendation={savedRecommendationText}
        />
      )}
      
      {/* Look Around Prompt */}
      <LookAroundPrompt isLocked={isLocked} isAnyOverlayOpen={isAnyOverlayOpen} />
    </div>
  )
}

export default App
