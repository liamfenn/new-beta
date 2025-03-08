import { useGLTF } from '@react-three/drei'
import BaseScene from './BaseScene'
import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'

export default function Room({ isLocked, onShowEHR, onShowPrompt, onSwitchScene }) {
  const { scene: roomModel } = useGLTF('/models/room.glb')
  const { camera } = useThree()
  
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

  // Check if player is in any interaction zone
  const checkInteractionZone = (position) => {
    const isInEHRZone = checkEHRZone(position)
    const isInTransitionZone = checkTransitionZone(position)
    
    // Show prompt for either interaction
    if (isInEHRZone) {
      onShowPrompt(true, "Press 'E' to view EHR")
      return true
    } else if (isInTransitionZone) {
      onShowPrompt(true, "Press 'E' to exit")
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
        
        if (isInEHRZone && !isInTransitionZone) {
          // Show EHR only if not in transition zone
          onShowEHR(true)
          document.exitPointerLock()
        } else if (isInTransitionZone) {
          // Switch to corridor scene
          onSwitchScene()
        }
      }
    }
    
    window.addEventListener('keydown', handleInteract)
    return () => window.removeEventListener('keydown', handleInteract)
  }, [camera.position, isLocked, onShowEHR, onSwitchScene])

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
    </BaseScene>
  )
} 