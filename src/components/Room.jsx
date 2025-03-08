import { useGLTF } from '@react-three/drei'
import BaseScene from './BaseScene'
import { useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'

export default function Room({ isLocked, onShowEHR, onShowPrompt, onSwitchScene }) {
  const { scene: roomModel } = useGLTF('/models/room.glb')
  const { camera } = useThree()
  const [patientExamined, setPatientExamined] = useState(false)
  const [nurseConsulted, setNurseConsulted] = useState(false)
  
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
  
  const nursePosition = {
    x: -1.5,
    z: 1.5,
    radius: 1.2
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
  
  // Check if near nurse for consultation
  const checkNurseZone = (position) => {
    const distanceX = Math.abs(position.x - nursePosition.x)
    const distanceZ = Math.abs(position.z - nursePosition.z)
    const distance = Math.sqrt(distanceX * distanceX + distanceZ * distanceZ)
    
    return distance < nursePosition.radius
  }

  // Check if player is in any interaction zone
  const checkInteractionZone = (position) => {
    const isInEHRZone = checkEHRZone(position)
    const isInTransitionZone = checkTransitionZone(position)
    const isInPatientZone = checkPatientZone(position)
    const isInNurseZone = checkNurseZone(position)
    
    // Show prompt for interactions
    if (isInEHRZone) {
      onShowPrompt(true, "Press 'E' to view EHR")
      return true
    } else if (isInTransitionZone) {
      onShowPrompt(true, "Press 'E' to exit")
      return true
    } else if (isInPatientZone && !patientExamined) {
      onShowPrompt(true, "Press 'E' to examine patient")
      return true
    } else if (isInNurseZone && !nurseConsulted) {
      onShowPrompt(true, "Press 'E' to speak with nurse")
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
        const isInNurseZone = checkNurseZone(camera.position)
        
        if (isInEHRZone && !isInTransitionZone) {
          // Show EHR only if not in transition zone
          onShowEHR(true)
          document.exitPointerLock()
        } else if (isInTransitionZone) {
          // Switch to corridor scene
          onSwitchScene()
        } else if (isInPatientZone && !patientExamined) {
          // Show patient examination dialog
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
        } else if (isInNurseZone && !nurseConsulted) {
          // Show nurse consultation dialog
          setNurseConsulted(true)
          
          // Unlock cursor for alert dialog
          document.exitPointerLock()
          
          // Display nurse information in a modal or alert
          alert("Nurse Report: The patient's condition has been deteriorating over the past hour. Blood pressure is dropping, and respiratory rate is increasing. The patient has a history of COPD and was admitted for pneumonia.")
          
          // Trigger guidance update - this will be handled in App.jsx
          window.dispatchEvent(new CustomEvent('nurseConsulted'))
          
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
        }
      }
    }
    
    window.addEventListener('keydown', handleInteract)
    return () => window.removeEventListener('keydown', handleInteract)
  }, [camera.position, isLocked, onShowEHR, onSwitchScene, patientExamined, nurseConsulted])

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
      
      {/* Nurse position indicator */}
      <mesh 
        position={[nursePosition.x, 1.7, nursePosition.z]} 
        receiveShadow
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
      
      {/* Patient examination zone indicator */}
      <mesh 
        position={[bedBoundary.x, 0.05, bedBoundary.z]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial 
          color={patientExamined ? "#4caf50" : "#ff9800"} 
          transparent={true} 
          opacity={0.3} 
        />
      </mesh>
      
      {/* Nurse interaction zone indicator */}
      <mesh 
        position={[nursePosition.x, 0.05, nursePosition.z]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[nursePosition.radius, 32]} />
        <meshStandardMaterial 
          color={nurseConsulted ? "#4caf50" : "#ff9800"} 
          transparent={true} 
          opacity={0.3} 
        />
      </mesh>
    </BaseScene>
  )
} 