import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useGLTF } from '@react-three/drei'

export default function Scene({ isLocked }) {
  const { scene: roomModel } = useGLTF('/models/room.glb')
  const { camera } = useThree()
  const moveSpeed = 0.1
  const playerHeight = 1.7 // Camera height
  
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

    // Keep camera at constant height
    camera.position.y = playerHeight

    // Add rotation limits
    const euler = state.camera.rotation.reorder('YXZ')
    euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x))
    state.camera.rotation.copy(euler)

    // Horizontal movement
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
    
    // Apply horizontal movement
    camera.position.x += direction.x
    camera.position.z += direction.z

    // Boundary constraints
    const boundaryLimit = 9 // Slightly less than grid size to stay within bounds
    camera.position.x = Math.max(-boundaryLimit, Math.min(boundaryLimit, camera.position.x))
    camera.position.z = Math.max(-boundaryLimit, Math.min(boundaryLimit, camera.position.z))
  })

  return (
    <>
      <primitive object={roomModel} position={[0, 0, 0]} />
      
      {/* Add these lights */}
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={1} castShadow />
      <hemisphereLight intensity={0.5} groundColor="#000000" />
      <pointLight position={[0, 4, 0]} intensity={0.5} />

      <gridHelper args={[20, 20]} />
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#666" />
      </mesh>
    </>
  )
} 