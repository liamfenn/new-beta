import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

export default function BaseScene({ 
  isLocked, 
  onShowEHR, 
  onShowPrompt, 
  boundaryLimits,
  interactionCheck,
  children,
  gridSize = 20 // Default grid size is 20x20
}) {
  const { camera } = useThree()
  const moveSpeed = 0.09
  const playerHeight = 1.7

  const playerRef = useRef({
    keys: {
      forward: false,
      backward: false,
      left: false,
      right: false
    }
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLocked) return
      switch (e.code) {
        case 'KeyW': playerRef.current.keys.forward = true; break
        case 'KeyS': playerRef.current.keys.backward = true; break
        case 'KeyA': playerRef.current.keys.left = true; break
        case 'KeyD': playerRef.current.keys.right = true; break
      }
    }

    const handleKeyUp = (e) => {
      if (!isLocked) return
      switch (e.code) {
        case 'KeyW': playerRef.current.keys.forward = false; break
        case 'KeyS': playerRef.current.keys.backward = false; break
        case 'KeyA': playerRef.current.keys.left = false; break
        case 'KeyD': playerRef.current.keys.right = false; break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isLocked])

  useFrame((state) => {
    if (!isLocked) return

    camera.position.y = playerHeight

    const euler = state.camera.rotation.reorder('YXZ')
    euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x))
    state.camera.rotation.copy(euler)

    const direction = new Vector3()
    const frontVector = new Vector3(
      0, 
      0, 
      Number(playerRef.current.keys.backward) - Number(playerRef.current.keys.forward)
    )
    const sideVector = new Vector3(
      Number(playerRef.current.keys.left) - Number(playerRef.current.keys.right),
      0,
      0
    )
    
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(moveSpeed)
      .applyEuler(camera.rotation)
    
    // Calculate next position
    const nextX = camera.position.x + direction.x
    const nextZ = camera.position.z + direction.z

    // Apply boundaries
    camera.position.x = Math.max(-boundaryLimits.left, Math.min(boundaryLimits.right, nextX))
    camera.position.z = Math.max(-boundaryLimits.front, Math.min(boundaryLimits.back, nextZ))

    // Check if in interaction zone - let the scene component handle the prompt
    interactionCheck(camera.position)
  })

  useEffect(() => {
    const handleInteract = (e) => {
      // We'll let the scene components handle their own interactions
      // This is now handled in the individual scene components
    }

    // Only add the event listener if interactions are enabled
    if (interactionCheck) {
      // No need to add the event listener here anymore
      // window.addEventListener('keydown', handleInteract)
      // return () => window.removeEventListener('keydown', handleInteract)
    }
    
    return undefined
  }, [camera.position, onShowEHR, interactionCheck])

  return (
    <>
      {children}
      
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={1} castShadow />
      <hemisphereLight intensity={0.5} groundColor="#000000" />
      <pointLight position={[0, 4, 0]} intensity={0.5} />

      {/* Grid with customizable size */}
      <gridHelper args={[gridSize, gridSize]} />
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[gridSize, gridSize]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      {/* Add invisible boundary walls */}
      <mesh position={[0, playerHeight/2, boundaryLimits.back]} receiveShadow>
        <boxGeometry args={[10, playerHeight, 0.1]} />
        <meshStandardMaterial visible={false} />
      </mesh>
      <mesh position={[0, playerHeight/2, -boundaryLimits.front]} receiveShadow>
        <boxGeometry args={[10, playerHeight, 0.1]} />
        <meshStandardMaterial visible={false} />
      </mesh>
      <mesh position={[boundaryLimits.right, playerHeight/2, 0]} receiveShadow>
        <boxGeometry args={[0.1, playerHeight, 20]} />
        <meshStandardMaterial visible={false} />
      </mesh>
      <mesh position={[-boundaryLimits.left, playerHeight/2, 0]} receiveShadow>
        <boxGeometry args={[0.1, playerHeight, 20]} />
        <meshStandardMaterial visible={false} />
      </mesh>
    </>
  )
} 