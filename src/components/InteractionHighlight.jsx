import { useFrame } from '@react-three/fiber'
import { useState, useRef } from 'react'
import { MathUtils } from 'three'

// Cylinder-based interaction highlight
export const CylinderHighlight = ({ position, radius, color, active = true, completed = false }) => {
  const materialRef = useRef()
  const innerMaterialRef = useRef()
  const [baseColor, setBaseColor] = useState(() => {
    if (completed) return "#4caf50" // Green for completed
    else if (active) return color || "#ff9800" // Orange for active
    else return "#666666" // Gray for inactive
  })
  
  // Update color when props change
  useFrame(() => {
    if (materialRef.current) {
      if (completed) {
        setBaseColor("#4caf50")
      } else if (active) {
        setBaseColor(color || "#ff9800")
      } else {
        setBaseColor("#666666")
      }
    }
  })
  
  // Create a blinking/pulsing effect
  useFrame(({ clock }) => {
    if (materialRef.current && active && !completed) {
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.4 + 0.6
      materialRef.current.opacity = MathUtils.lerp(0.3, 0.7, pulse)
      materialRef.current.emissiveIntensity = MathUtils.lerp(0.5, 1.5, pulse)
      
      if (innerMaterialRef.current) {
        innerMaterialRef.current.opacity = MathUtils.lerp(0.4, 0.8, pulse)
        innerMaterialRef.current.emissiveIntensity = MathUtils.lerp(0.8, 2, pulse)
      }
    } else if (materialRef.current && completed) {
      materialRef.current.opacity = 0.3
      materialRef.current.emissiveIntensity = 0.4
    } else if (materialRef.current) {
      materialRef.current.opacity = 0.15
      materialRef.current.emissiveIntensity = 0.1
    }
  })

  // Don't render anything if task is completed
  if (completed) {
    return null
  }
  
  return (
    <group position={position}>
      {/* Main cylinder - semi-translucent */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[radius * 0.5, radius * 0.5, 0.4, 32]} />
        <meshStandardMaterial 
          ref={materialRef}
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={1}
          transparent={true}
          opacity={0.6}
        />
      </mesh>
      
      {/* Inner cylinder (only for active) */}
      {active && (
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[radius * 0.3, radius * 0.3, 0.5, 32]} />
          <meshStandardMaterial 
            ref={innerMaterialRef}
            color={baseColor}
            emissive={baseColor}
            emissiveIntensity={1.5}
            transparent={true}
            opacity={0.7}
          />
        </mesh>
      )}
    </group>
  )
}

export default function InteractionHighlight({ 
  position = [0, 0.05, 0], 
  radius = 1, 
  color = "#ff9800", 
  active = true,
  completed = false
}) {
  return (
    <CylinderHighlight 
      position={position}
      radius={radius}
      color={color}
      active={active}
      completed={completed}
    />
  )
} 