import { useGLTF } from '@react-three/drei'
import BaseScene from './BaseScene'

export default function Room({ isLocked, onShowEHR, onShowPrompt }) {
  const { scene: roomModel } = useGLTF('/models/room.glb')
  
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

  // Check if in interaction zone
  const checkInteractionZone = (position) => {
    return position.x < -boundaryLimits.left + 2 && 
           position.z > boundaryLimits.back - 2
  }

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
        <meshStandardMaterial visible={false} /> {/* Set to true to see boundary */}
      </mesh>
    </BaseScene>
  )
} 