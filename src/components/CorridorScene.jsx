import { useGLTF } from '@react-three/drei'
import BaseScene from './BaseScene'
import { useEffect, useRef, useState } from 'react'
import { Box3, Vector3 } from 'three'
import { useThree } from '@react-three/fiber'

// Custom component to handle the corridor model's positioning
const CorridorModel = () => {
  const { scene } = useGLTF('/models/corridor.glb')
  const modelRef = useRef()
  
  // Center the model on the grid with the perfect coordinates
  useEffect(() => {
    if (modelRef.current) {
      // These are the perfect coordinates found through testing
      modelRef.current.position.set(-83.18, 0.5, 28.60)
    }
  }, [scene])
  
  return (
    <group ref={modelRef}>
      <primitive 
        object={scene} 
        scale={1} 
      />
    </group>
  )
}

// Component for the exterior walls to block the view into space
const ExteriorWalls = () => {
  // Wall dimensions
  const wallHeight = 5
  const wallWidth = 50
  const wallDepth = 0.5
  const wallDistance = 5 // Distance from the boundary
  
  return (
    <group>
      {/* Left exterior wall */}
      <mesh position={[-7, wallHeight/2, 0]}>
        <boxGeometry args={[wallDepth, wallHeight, wallWidth]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      
      {/* Right exterior wall */}
      <mesh position={[7, wallHeight/2, 0]}>
        <boxGeometry args={[wallDepth, wallHeight, wallWidth]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      
      {/* Front exterior wall (black) */}
      <mesh position={[0, wallHeight/2, -5]}>
        <boxGeometry args={[15, wallHeight, wallDepth]} />
        <meshStandardMaterial color="#000" />
      </mesh>
    </group>
  )
}

export default function CorridorScene({ isLocked, onShowEHR, onShowPrompt, onSwitchScene, currentActiveTask, isInteractionAllowed }) {
  const { camera } = useThree()
  const [nurseConsulted, setNurseConsulted] = useState(false)
  
  // Boundary limits for player movement - perfect settings found through testing
  const boundaryLimits = {
    front: 0.5,
    back: 17.9,
    left: 1.9,
    right: 1.9
  }
  
  // Nurse position at the far end of the corridor
  const nursePosition = {
    x: 0,
    z: 15,
    radius: 1.5
  }

  // Check if player is in the scene transition zone
  const checkTransitionZone = (position) => {
    // Exact transition zone coordinates from testing
    const transitionZone = {
      minX: -3.4,
      maxX: -0.4,
      minZ: 10.08,
      maxZ: 13.08
    }
    
    return (
      position.x >= transitionZone.minX && 
      position.x <= transitionZone.maxX && 
      position.z >= transitionZone.minZ && 
      position.z <= transitionZone.maxZ
    )
  }
  
  // Check if near nurse for consultation
  const checkNurseZone = (position) => {
    const distanceX = Math.abs(position.x - nursePosition.x)
    const distanceZ = Math.abs(position.z - nursePosition.z)
    const distance = Math.sqrt(distanceX * distanceX + distanceZ * distanceZ)
    
    return distance < nursePosition.radius
  }

  // Check if player is in interaction zone - this is for the prompt display
  const checkInteractionZone = (position) => {
    const isInTransitionZone = checkTransitionZone(position)
    const isInNurseZone = checkNurseZone(position)
    
    // Show prompt when in transition zone and interaction is allowed
    if (isInTransitionZone && isLocked && isInteractionAllowed("corridor-to-room")) {
      onShowPrompt(true, "Press 'E' to enter")
      return true
    } else if (isInNurseZone && !nurseConsulted && isInteractionAllowed("nurse-consult")) {
      onShowPrompt(true, "Press 'E' to speak with nurse")
      return true
    } else if (isInTransitionZone && isLocked && !isInteractionAllowed("corridor-to-room")) {
      // Show a "not yet" prompt for interactions that aren't currently allowed
      onShowPrompt(true, "Complete current task first")
      return true
    } else if (isInNurseZone && !nurseConsulted && !isInteractionAllowed("nurse-consult")) {
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
        const isInTransitionZone = checkTransitionZone(camera.position)
        const isInNurseZone = checkNurseZone(camera.position)
        
        if (isInTransitionZone && isInteractionAllowed("corridor-to-room")) {
          // Switch to the room scene if it's the current task
          onSwitchScene()
        } else if (isInNurseZone && !nurseConsulted && isInteractionAllowed("nurse-consult")) {
          // Show nurse consultation dialog if it's the current task
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
        } else if (isInTransitionZone && !isInteractionAllowed("corridor-to-room")) {
          // Show a message that this interaction is not available yet
          alert("Complete your current task first")
        } else if (isInNurseZone && !nurseConsulted && !isInteractionAllowed("nurse-consult")) {
          // Show a message that this interaction is not available yet
          alert("Complete your current task first")
        }
      }
    }
    
    window.addEventListener('keydown', handleInteract)
    return () => window.removeEventListener('keydown', handleInteract)
  }, [camera.position, isLocked, onSwitchScene, isInteractionAllowed, nurseConsulted])

  return (
    <BaseScene 
      isLocked={isLocked}
      onShowEHR={onShowEHR}
      onShowPrompt={onShowPrompt}
      boundaryLimits={boundaryLimits}
      interactionCheck={checkInteractionZone}
      gridSize={30} // Use a larger grid for the corridor
    >
      <CorridorModel />
      <ExteriorWalls />
      
      {/* Room entrance indicator */}
      <mesh 
        position={[-1.9, 0.05, 11.5]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial 
          color={isInteractionAllowed("corridor-to-room") ? "#ff9800" : "#666"} 
          transparent={true} 
          opacity={0.3} 
        />
      </mesh>
      
      {/* Nurse position indicator */}
      <mesh 
        position={[nursePosition.x, 1.7, nursePosition.z]} 
        receiveShadow
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={nurseConsulted ? "#4caf50" : isInteractionAllowed("nurse-consult") ? "#4a90e2" : "#666"} />
      </mesh>
      
      {/* Nurse interaction zone indicator */}
      <mesh 
        position={[nursePosition.x, 0.05, nursePosition.z]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[nursePosition.radius, 32]} />
        <meshStandardMaterial 
          color={nurseConsulted ? "#4caf50" : isInteractionAllowed("nurse-consult") ? "#ff9800" : "#666"} 
          transparent={true} 
          opacity={0.3} 
        />
      </mesh>
    </BaseScene>
  )
} 