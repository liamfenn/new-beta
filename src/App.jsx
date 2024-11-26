import { Canvas } from '@react-three/fiber'
import { PointerLockControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useState } from 'react'
import Scene from './components/Scene'
import './App.css'

function App() {
  const [isLocked, setIsLocked] = useState(false)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas 
        style={{ background: '#1a1a1a' }}
        camera={{ fov: 75, near: 0.1, far: 1000 }}
      >
        <Suspense fallback={null}>
          <Scene isLocked={isLocked} />
          <PointerLockControls 
            onLock={() => setIsLocked(true)}
            onUnlock={() => setIsLocked(false)}
          />
          <PerspectiveCamera makeDefault position={[0, 1.7, 0]} />
          <ambientLight intensity={0.5} />
        </Suspense>
      </Canvas>
      
      {!isLocked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white select-none">
          Click to start
          <br />
          (WASD to move, Mouse to look)
          <br />
          ESC to exit
        </div>
      )}
    </div>
  )
}

export default App
