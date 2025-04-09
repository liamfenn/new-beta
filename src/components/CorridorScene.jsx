import { useGLTF } from '@react-three/drei'
import BaseScene from './BaseScene'
import { useEffect, useRef, useState } from 'react'
import { Box3, Vector3 } from 'three'
import { useThree } from '@react-three/fiber'
import InteractionHighlight from './InteractionHighlight'

// Custom component to handle the corridor model's positioning
const CorridorModel = () => {
  const baseUrl = import.meta.env.VITE_MODEL_BASE_URL || '';
  
  // Helper function to get the correct model path
  const getModelPath = (filename) => {
    // If using a base URL (production/GitHub Pages), don't include /models/ prefix
    if (baseUrl) {
      return `${baseUrl}/${filename}`;
    }
    // For local development, use the /models/ prefix
    return `/models/${filename}`;
  };
  
  const modelPath = getModelPath('corridor-textured.glb');
  const { scene } = useGLTF(modelPath)
  const modelRef = useRef()
  
  // Center the model on the grid with the perfect coordinates
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.position.set(0, 0.15, 22)
      modelRef.current.rotation.set(0, 0, 0)
      modelRef.current.scale.set(1.4, 1.4, 1.4)
    }
  }, [scene])
  
  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={1} />
    </group>
  )
}

// Component for exterior walls to block the view through windows
const ExteriorWalls = () => {
  // Create a complete enclosure box
  return (
    <group>
      {/* Top wall (ceiling) */}
      <mesh position={[0, 8, 15]}>
        <boxGeometry args={[80, 0.5, 80]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Bottom wall (floor) */}
      <mesh position={[0, -1, 15]}>
        <boxGeometry args={[80, 0.5, 80]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-40, 4, 15]}>
        <boxGeometry args={[0.5, 10, 80]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[40, 4, 15]}>
        <boxGeometry args={[0.5, 10, 80]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Front wall - moved closer to block view through front entrance */}
      <mesh position={[0, 4, -4]}>
        <boxGeometry args={[80, 10, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Additional front wall to ensure complete coverage */}
      <mesh position={[0, 4, -2]}>
        <boxGeometry args={[80, 10, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Window backings - only on sides where windows exist */}
      {/* Left side window backings */}
      <mesh position={[-5.9, 3, 5]}>
        <boxGeometry args={[0.1, 7, 25]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Right side window backings */}
      <mesh position={[5.9, 3, 5]}>
        <boxGeometry args={[0.1, 7, 25]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Front door/window backing - close to front entrance */}
      <mesh position={[0, 3, -2.5]}>
        <boxGeometry args={[15, 7, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

export default function CorridorScene({ 
  isLocked, 
  onShowEHR, 
  onShowPrompt, 
  onSwitchScene, 
  currentActiveTask, 
  isInteractionAllowed
}) {
  const { camera } = useThree()
  const [nurseConsulted, setNurseConsulted] = useState(false)
  const [completedToRoom, setCompletedToRoom] = useState(false)
  
  // Listen for room entry completion
  useEffect(() => {
    // If the first task is already completed, the player entered the room
    if (currentActiveTask > 0) {
      setCompletedToRoom(true)
    }
  }, [currentActiveTask])
  
  // Boundary limits for player movement
  const boundaryLimits = {
    front: 1.3,
    back: 25,
    left: 2.3,
    right: 2.3
  }
  
  // Nurse position
  const nursePosition = {
    x: 0,
    z: 22,
    radius: 1.5
  }

  // Room entrance position
  const roomEntrancePosition = {
    x: -2.0,
    y: 0.1,
    z: 16,
  }

  // Check if player is in the scene transition zone
  const checkTransitionZone = (position) => {
    const transitionZone = {
      minX: -3.0,
      maxX: -1.0,
      minZ: 15.0,
      maxZ: 17.0
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
      onShowPrompt(true, "Complete your current task first")
      return true
    } else if (isInNurseZone && !nurseConsulted && !isInteractionAllowed("nurse-consult")) {
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
          onSwitchScene()
        } else if (isInNurseZone && !nurseConsulted && isInteractionAllowed("nurse-consult")) {
          setNurseConsulted(true)
          
          // Unlock cursor for the nurse consultation interface
          document.exitPointerLock()
          
          // Trigger nurse consultation
          const event = new CustomEvent('nurseConsulted')
          window.dispatchEvent(event)
        } else if (isInTransitionZone && !isInteractionAllowed("corridor-to-room")) {
          alert("Complete your current task first")
        } else if (isInNurseZone && !nurseConsulted && !isInteractionAllowed("nurse-consult")) {
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
      gridSize={30}
      moveSpeed={0.135}
    >
      <CorridorModel />
      <ExteriorWalls />
      
      {/* Room entrance indicator */}
      <InteractionHighlight 
        position={[roomEntrancePosition.x, roomEntrancePosition.y, roomEntrancePosition.z]}
        radius={0.7}
        color="#a855f7"
        active={isInteractionAllowed("corridor-to-room")}
        completed={completedToRoom}
      />
      
      {/* Nurse position indicator */}
      <mesh 
        position={[nursePosition.x, 1.9, nursePosition.z]} 
        receiveShadow
      >
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={nurseConsulted ? "#4caf50" : isInteractionAllowed("nurse-consult") ? "#3b82f6" : "#666"} />
      </mesh>
      
      {/* Nurse interaction zone indicator */}
      <InteractionHighlight 
        position={[nursePosition.x, 0.1, nursePosition.z]}
        radius={0.7}
        color="#3b82f6"
        active={isInteractionAllowed("nurse-consult")}
        completed={nurseConsulted}
      />
    </BaseScene>
  )
} 