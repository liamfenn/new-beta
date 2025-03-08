import { useGLTF } from '@react-three/drei'
import BaseScene from './BaseScene'
import { useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'

export default function Room({ isLocked, onShowEHR, onShowPrompt, onSwitchScene, currentActiveTask, isInteractionAllowed }) {
  const { scene: roomModel } = useGLTF('/models/room.glb')
  const { camera } = useThree()
  const [patientExamined, setPatientExamined] = useState(false)
  
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
    return position.x < -boundaryLimits.left + 2 && 
           position.z > boundaryLimits.back - 2
  }
  
  // Check if near patient bed for examination
  const checkPatientZone = (position) => {
    const distanceX = Math.abs(position.x - bedBoundary.x)
    const distanceZ = Math.abs(position.z - bedBoundary.z)
    
    // Check if within 1.5 units of the bed center
    return distanceX < 1.5 && distanceZ < 1.5
  }

  // Check if player is in any interaction zone
  const checkInteractionZone = (position) => {
    const isInEHRZone = checkEHRZone(position)
    const isInTransitionZone = checkTransitionZone(position)
    const isInPatientZone = checkPatientZone(position)
    
    // Show prompt for interactions based on current active task
    if (isInEHRZone && isInteractionAllowed("ehr-access")) {
      onShowPrompt(true, "Press 'E' to view EHR")
      return true
    } else if (isInTransitionZone && isInteractionAllowed("corridor-to-room")) {
      onShowPrompt(true, "Press 'E' to exit")
      return true
    } else if (isInPatientZone && !patientExamined && isInteractionAllowed("patient-exam")) {
      onShowPrompt(true, "Press 'E' to examine patient")
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
        const isInEHRZone = checkEHRZone(camera.position)
        const isInTransitionZone = checkTransitionZone(camera.position)
        const isInPatientZone = checkPatientZone(camera.position)
        
        if (isInEHRZone && !isInTransitionZone && isInteractionAllowed("ehr-access")) {
          // Show EHR only if not in transition zone and it's the current task
          onShowEHR(true)
          document.exitPointerLock()
        } else if (isInTransitionZone && isInteractionAllowed("corridor-to-room")) {
          // Switch to corridor scene if it's the current task
          onSwitchScene()
        } else if (isInPatientZone && !patientExamined && isInteractionAllowed("patient-exam")) {
          // Show patient examination dialog if it's the current task
          setPatientExamined(true)
          
          // Unlock cursor for alert dialog
          document.exitPointerLock()
          
          // Display patient information in a modal or alert
          alert("Patient Examination: The patient appears to be in respiratory distress. Oxygen saturation is low. The patient is conscious but confused. There are signs of cyanosis around the lips.")
          
          // Trigger guidance update - this will be handled in App.jsx
          window.dispatchEvent(new CustomEvent('patientExamined'))
          
          // Re-lock cursor after alert is closed if still in the game
          setTimeout(() => {
            if (isLocked && document.pointerLockElement === null) {
              try {
                document.body.requestPointerLock()
              } catch (error) {
                console.error("Could not re-lock pointer:", error)
              }
            }
          }, 100)
        } else if ((isInEHRZone && !isInteractionAllowed("ehr-access")) || 
                   (isInPatientZone && !patientExamined && !isInteractionAllowed("patient-exam"))) {
          // Show a message that this interaction is not available yet
          alert("Complete your current task first")
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

  return (
    <BaseScene 
      isLocked={isLocked}
      onShowEHR={onShowEHR}
      onShowPrompt={onShowPrompt}
      boundaryLimits={boundaryLimits}
      interactionCheck={checkInteractionZone}
    >
      <primitive object={roomModel} position={[0, 0, 0]} />
      
      {/* Bed collision boundary */}
      <mesh 
        position={[bedBoundary.x, 0.85, bedBoundary.z]} 
        receiveShadow
      >
        <boxGeometry args={[bedBoundary.width, 1.7, bedBoundary.length]} />
        <meshStandardMaterial visible={false} />
      </mesh>
      
      {/* Patient examination zone indicator */}
      <mesh 
        position={[bedBoundary.x, 0.05, bedBoundary.z]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial 
          color={patientExamined ? "#4caf50" : isInteractionAllowed("patient-exam") ? "#ff9800" : "#666"} 
          transparent={true} 
          opacity={0.3} 
        />
      </mesh>
      
      {/* EHR interaction zone indicator */}
      <mesh 
        position={[-boundaryLimits.left + 1, 0.05, boundaryLimits.back - 1]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial 
          color={isInteractionAllowed("ehr-access") ? "#ff9800" : "#666"} 
          transparent={true} 
          opacity={0.3} 
        />
      </mesh>
    </BaseScene>
  )
} 