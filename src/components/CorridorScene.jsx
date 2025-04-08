import { useGLTF } from '@react-three/drei'
import BaseScene from './BaseScene'
import { useEffect, useRef, useState } from 'react'
import { Box3, Vector3 } from 'three'
import { useThree } from '@react-three/fiber'
import InteractionHighlight from './InteractionHighlight'

// Custom component to handle the corridor model's positioning
const CorridorModel = ({ useTextured = true }) => {
  const modelPath = useTextured ? '/models/corridor-textured.glb' : '/models/corridor.glb'
  const { scene } = useGLTF(modelPath)
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

export default function CorridorScene({ isLocked, onShowEHR, onShowPrompt, onSwitchScene, currentActiveTask, isInteractionAllowed, useTexturedModel = true }) {
  const { camera } = useThree()
  const [nurseConsulted, setNurseConsulted] = useState(false)
  const [completedToRoom, setCompletedToRoom] = useState(false)
  
  // Listen for room entry completion
  useEffect(() => {
    const handleRoomEntry = () => {
      setCompletedToRoom(true)
    }
    
    // If the first task is already completed, the player entered the room
    if (currentActiveTask > 0) {
      setCompletedToRoom(true)
    }
    
    return () => {}
  }, [currentActiveTask])
  
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
    
    if (isInTransitionZone && isInteractionAllowed("corridor-to-room")) {
      onShowPrompt(true, "Press 'E' to enter patient room", "corridor-to-room")
      return true
    } else if (isInNurseZone && !nurseConsulted && isInteractionAllowed("nurse-consult")) {
      onShowPrompt(true, "Press 'E' to speak with nurse", "nurse-consult")
      return true
    } else if (isInTransitionZone && isLocked && !isInteractionAllowed("corridor-to-room")) {
      // Show a "not yet" prompt for interactions that aren't currently allowed
      onShowPrompt(true, "Complete your current task first")
      return true
    } else if (isInNurseZone && !nurseConsulted && !isInteractionAllowed("nurse-consult")) {
      // Show a "not yet" prompt for interactions that aren't currently allowed
      onShowPrompt(true, "Complete your current task first")
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
          console.log("Nurse zone interaction detected")
          console.log("isInteractionAllowed:", isInteractionAllowed("nurse-consult"))
          console.log("nurseConsulted:", nurseConsulted)
          
          setNurseConsulted(true)
          
          // Unlock cursor for the nurse consultation interface
          document.exitPointerLock()
          
          // Trigger nurse consultation - this will be handled in App.jsx
          console.log("Dispatching nurseConsulted event")
          const event = new CustomEvent('nurseConsulted')
          window.dispatchEvent(event)
          console.log("Event dispatched:", event)
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
      <CorridorModel useTextured={useTexturedModel} />
      <ExteriorWalls />
      
      {/* Room entrance indicator */}
      <InteractionHighlight 
        position={[-1.9, 0.3, 11.5]}
        radius={0.9}
        color="#a855f7" /* purple-500 */
        active={isInteractionAllowed("corridor-to-room")}
        completed={completedToRoom}
      />
      
      {/* Nurse position indicator */}
      <mesh 
        position={[nursePosition.x, 1.7, nursePosition.z]} 
        receiveShadow
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={nurseConsulted ? "#4caf50" : isInteractionAllowed("nurse-consult") ? "#3b82f6" : "#666"} />
      </mesh>
      
      {/* Nurse interaction zone indicator */}
      <InteractionHighlight 
        position={[nursePosition.x, 0.3, nursePosition.z]}
        radius={0.9}
        color="#3b82f6" /* blue-500 */
        active={isInteractionAllowed("nurse-consult")}
        completed={nurseConsulted}
      />
    </BaseScene>
  )
} 