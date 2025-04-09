import { useGLTF } from '@react-three/drei'
import BaseScene from './BaseScene'
import { useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import InteractionHighlight from './InteractionHighlight'

// Custom component to handle the hospital room models
const RoomModel = () => {
  // Set up base URL for models - use environment variable if available
  const baseUrl = import.meta.env.VITE_MODEL_BASE_URL || '';
  
  // Handle paths differently based on whether we're using local or remote URLs
  const getModelPath = (filename) => {
    // If using a base URL (production/GitHub Pages), don't include /models/ prefix
    if (baseUrl) {
      return `${baseUrl}/${filename}`;
    }
    // For local development, use the /models/ prefix
    return `/models/${filename}`;
  };
  
  // Load all model parts with appropriate URLs
  const { scene: roomScene } = useGLTF(getModelPath('Private-Ward.glb'))
  const { scene: equipmentScene } = useGLTF(getModelPath('Hospital-Private-Ward-Surrounding-Equipments.glb'))
  const { scene: bedScene } = useGLTF(getModelPath('Hospital-Private-Ward-Headbedset.glb'))
  const { scene: patientScene } = useGLTF(getModelPath('Private-Ward-Patient-on-Ventilator.glb'))
  
  // Reference for the container group
  const modelRef = useRef()
  
  // Position all models once loaded
  useEffect(() => {
    if (modelRef.current) {
      // Position the entire group
      modelRef.current.position.set(0, 0, 0)
      modelRef.current.rotation.set(0, 0, 0)
    }
  }, [roomScene, equipmentScene, bedScene, patientScene])
  
  return (
    <group ref={modelRef}>
      <primitive object={roomScene} />
      <primitive object={equipmentScene} />
      <primitive object={bedScene} />
      <primitive object={patientScene} />
    </group>
  )
}

// Preload models to avoid loading delays during scene transitions
// Use environment variable base URL if available
const baseUrl = import.meta.env.VITE_MODEL_BASE_URL || '';

// Handle paths differently based on whether we're using local or remote URLs
const getModelPath = (filename) => {
  // If using a base URL (production/GitHub Pages), don't include /models/ prefix
  if (baseUrl) {
    return `${baseUrl}/${filename}`;
  }
  // For local development, use the /models/ prefix
  return `/models/${filename}`;
};

useGLTF.preload(getModelPath('Private-Ward.glb'))
useGLTF.preload(getModelPath('Hospital-Private-Ward-Surrounding-Equipments.glb'))
useGLTF.preload(getModelPath('Hospital-Private-Ward-Headbedset.glb'))
useGLTF.preload(getModelPath('Private-Ward-Patient-on-Ventilator.glb'))

export default function Room({ isLocked, onShowEHR, onShowPrompt, onSwitchScene, currentActiveTask, isInteractionAllowed }) {
  const { camera } = useThree()
  const [patientExamined, setPatientExamined] = useState(false)
  const [ehrAccessed, setEhrAccessed] = useState(false)
  
  const boundaryLimits = {
    front: 1.25,
    back: 4,
    left: 1.25,
    right: 4
  }

  const bedBoundary = {
    x: 1.25,
    z: 3.5,
    width: 2,
    length: 3
  }

  // Check if player is in the scene transition zone
  const checkTransitionZone = (position) => {
    // Exact transition zone coordinates from testing
    const transitionZone = {
      minX: 3,
      maxX: 5,
      minZ: -1.1,
      maxZ: 0.9
    }
    
    return (
      position.x >= transitionZone.minX && 
      position.x <= transitionZone.maxX && 
      position.z >= transitionZone.minZ && 
      position.z <= transitionZone.maxZ
    )
  }

  // Check if in EHR interaction zone
  const checkEHRZone = (position) => {
    return position.x < -boundaryLimits.left + 1.5 && 
           position.z > boundaryLimits.back - 2
  }
  
  // Check if near patient bed for examination
  const checkPatientZone = (position) => {
    // Calculate distance from the adjusted bed center (shifted to the left)
    const adjustedBedX = bedBoundary.x - 0.8
    const distanceX = Math.abs(position.x - adjustedBedX)
    const distanceZ = Math.abs(position.z - bedBoundary.z)
    
    // Check if within 2 units of the adjusted bed center
    return distanceX < 2 && distanceZ < 1.8
  }

  // Check if player is in any interaction zone
  const checkInteractionZone = (position) => {
    const isInEHRZone = checkEHRZone(position)
    const isInTransitionZone = checkTransitionZone(position)
    const isInPatientZone = checkPatientZone(position)
    
    // Show prompt for interactions based on current active task
    if (isInEHRZone && isInteractionAllowed("ehr-access")) {
      onShowPrompt(true, "Press 'E' to view EHR", "ehr-access")
      return true
    } else if (isInTransitionZone && isInteractionAllowed("corridor-to-room")) {
      onShowPrompt(true, "Press 'E' to exit", "corridor-to-room")
      return true
    } else if (isInPatientZone && !patientExamined && isInteractionAllowed("patient-exam")) {
      onShowPrompt(true, "Press 'E' to examine patient", "patient-exam")
      return true
    } else if ((isInEHRZone && !isInteractionAllowed("ehr-access")) || 
               (isInPatientZone && !patientExamined && !isInteractionAllowed("patient-exam"))) {
      // Show a "not yet" prompt for interactions that aren't currently allowed
      onShowPrompt(true, "Complete current task first")
      return true
    } else {
      onShowPrompt(false)
      return false
    }
  }
  
  // Handle interaction (E key press)
  useEffect(() => {
    const handleInteract = (e) => {
      if (e.code === 'KeyE' && isLocked) {
        console.log("E key pressed in Room component")
        const isInEHRZone = checkEHRZone(camera.position)
        const isInTransitionZone = checkTransitionZone(camera.position)
        const isInPatientZone = checkPatientZone(camera.position)
        
        console.log(`- In EHR zone: ${isInEHRZone}`)
        console.log(`- In transition zone: ${isInTransitionZone}`)
        console.log(`- In patient zone: ${isInPatientZone}`)
        console.log(`- EHR access allowed: ${isInteractionAllowed("ehr-access")}`)
        console.log(`- Patient exam allowed: ${isInteractionAllowed("patient-exam")}`)
        console.log(`- Corridor-to-room allowed: ${isInteractionAllowed("corridor-to-room")}`)
        
        if (isInEHRZone && !isInTransitionZone && isInteractionAllowed("ehr-access")) {
          console.log("Opening EHR")
          // Show EHR only if not in transition zone and it's the current task
          onShowEHR(true)
          document.exitPointerLock()
          
          // Dispatch a custom event to notify that EHR was accessed
          window.dispatchEvent(new CustomEvent('ehrAccessed'))
        } else if (isInTransitionZone && isInteractionAllowed("corridor-to-room")) {
          console.log("Switching to corridor scene")
          // Switch to corridor scene if it's the current task
          onSwitchScene()
        } else if (isInPatientZone && !patientExamined && isInteractionAllowed("patient-exam")) {
          console.log("Examining patient")
          // Examine patient if it's the current task
          setPatientExamined(true)
          
          // Unlock cursor for the patient examination interface
          document.exitPointerLock()
          
          // Trigger patient examination - this will be handled in App.jsx
          window.dispatchEvent(new CustomEvent('patientExamined'))
        } else if ((isInEHRZone && !isInteractionAllowed("ehr-access")) || 
                   (isInPatientZone && !patientExamined && !isInteractionAllowed("patient-exam"))) {
          console.log("Interaction not allowed yet")
          // Show a message that this interaction is not available yet
          alert("Complete your current task first")
        } else {
          console.log("No valid interaction found")
        }
      }
    }
    
    window.addEventListener('keydown', handleInteract)
    return () => window.removeEventListener('keydown', handleInteract)
  }, [camera.position, isLocked, onShowEHR, onSwitchScene, patientExamined, isInteractionAllowed])

  // Custom collision check for the bed
  const checkCollision = (nextX, nextZ) => {
    // Check bed collision
    const isBedCollision = 
      nextX > bedBoundary.x - bedBoundary.width/2 && 
      nextX < bedBoundary.x + bedBoundary.width/2 && 
      nextZ > bedBoundary.z - bedBoundary.length/2 && 
      nextZ < bedBoundary.z + bedBoundary.length/2

    return !isBedCollision
  }

  // Listen for EHR accessed event
  useEffect(() => {
    const handleEhrAccessed = () => {
      setEhrAccessed(true)
    }
    
    window.addEventListener('ehrAccessed', handleEhrAccessed)
    return () => window.removeEventListener('ehrAccessed', handleEhrAccessed)
  }, [])

  return (
    <BaseScene 
      isLocked={isLocked}
      onShowEHR={onShowEHR}
      onShowPrompt={onShowPrompt}
      boundaryLimits={boundaryLimits}
      interactionCheck={checkInteractionZone}
      moveSpeed={0.15}
      playerHeight={1.7}
    >
      <RoomModel />
      
      {/* Bed collision boundary */}
      <mesh 
        position={[bedBoundary.x, 0.85, bedBoundary.z]} 
        receiveShadow
      >
        <boxGeometry args={[bedBoundary.width, 1.7, bedBoundary.length]} />
        <meshStandardMaterial visible={false} />
      </mesh>
      
      {/* Patient examination zone indicator */}
      <InteractionHighlight 
        position={[bedBoundary.x - 0.8, 0, bedBoundary.z - 0.3]}
        radius={1.2}
        color="#f97316" /* orange-500 */
        active={isInteractionAllowed("patient-exam")}
        completed={patientExamined}
      />
      
      {/* EHR interaction zone indicator */}
      <InteractionHighlight 
        position={[-boundaryLimits.left + 0.5, 0, boundaryLimits.back - 1.2]}
        radius={0.8}
        color="#3b82f6" /* blue-500 */
        active={isInteractionAllowed("ehr-access")}
        completed={ehrAccessed}
      />
      
      {/* Door exit zone indicator */}
      <InteractionHighlight 
        position={[3.5, 0, -0.2]}
        radius={0.8}
        color="#a855f7" /* purple-500 */
        active={isInteractionAllowed("corridor-to-room")}
        completed={false}
      />
    </BaseScene>
  )
} 