import { useGLTF } from '@react-three/drei'
import BaseScene from './BaseScene'
import { useEffect, useRef } from 'react'
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

export default function CorridorScene({ isLocked, onShowEHR, onShowPrompt, onSwitchScene }) {
  const { camera } = useThree()
  
  // Boundary limits for player movement - perfect settings found through testing
  const boundaryLimits = {
    front: 0.5,
    back: 17.9,
    left: 1.9,
    right: 1.9
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

  // Check if player is in interaction zone - this is for the prompt display
  const checkInteractionZone = (position) => {
    const isInTransitionZone = checkTransitionZone(position)
    
    // Show prompt when in transition zone
    if (isInTransitionZone && isLocked) {
      onShowPrompt(true, "Press 'E' to enter")
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
        
        if (isInTransitionZone) {
          // Switch to the room scene
          onSwitchScene()
        }
      }
    }
    
    window.addEventListener('keydown', handleInteract)
    return () => window.removeEventListener('keydown', handleInteract)
  }, [camera.position, isLocked, onSwitchScene])

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
    </BaseScene>
  )
} 