import { useGLTF } from '@react-three/drei'
import BaseScene from './BaseScene'
import { useEffect, useRef } from 'react'
import { Box3, Vector3 } from 'three'

// Custom component to handle the corridor model's positioning
const CorridorModel = () => {
  const { scene } = useGLTF('/models/corridor.glb')
  const modelRef = useRef()
  
  // Center the model on the grid with the perfect coordinates
  useEffect(() => {
    if (modelRef.current) {
      // These are the perfect coordinates found through testing
      modelRef.current.position.set(-83.18, 0.5, 28.60)
      
      console.log('Model positioned with perfect coordinates', {
        position: modelRef.current.position
      })
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

export default function CorridorScene({ isLocked, onShowEHR, onShowPrompt }) {
  const boundaryLimits = {
    front: 40,
    back: 40,
    left: 40,
    right: 40
  }

  // Always return false for interaction check - no interactions in corridor
  const checkInteractionZone = () => false

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
    </BaseScene>
  )
} 