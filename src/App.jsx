import { Canvas } from '@react-three/fiber'
import { PointerLockControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useState } from 'react'
import Scene from './components/Scene'
import Modal from './components/Modal'
import EHROverlay from './components/EHROverlay'
import './App.css'

function App() {
  const [isLocked, setIsLocked] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [modalStep, setModalStep] = useState('welcome')
  const [showEHR, setShowEHR] = useState(false)
  const [showInteractPrompt, setShowInteractPrompt] = useState(false)

  const handleLock = () => {
    if (!showModal) {
      setIsLocked(true)
    } else {
      document.exitPointerLock()
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {showModal && (
        <div 
          className="absolute inset-0 bg-black/70"
          style={{ zIndex: 1 }}
        />
      )}
      <Canvas 
        style={{ background: '#000' }}
        camera={{ fov: 75, near: 0.1, far: 1000 }}
      >
        <Suspense fallback={null}>
          <Scene 
            isLocked={isLocked} 
            onShowEHR={setShowEHR}
            onShowPrompt={setShowInteractPrompt}
          />
          {!showModal && !showEHR && (
            <PointerLockControls 
              onLock={handleLock}
              onUnlock={() => setIsLocked(false)}
            />
          )}
          <PerspectiveCamera 
            makeDefault 
            position={[3, 1.7, 0]}
            rotation={[0, 2.5, 0]}
          />
          <ambientLight intensity={0.5} />
        </Suspense>
      </Canvas>
      
      {showModal && (
        <Modal 
          step={modalStep}
          onBegin={() => setModalStep('scenario')}
          onStart={() => {
            setShowModal(false)
            setIsLocked(true)
          }}
        />
      )}
      
      {!isLocked && !showModal && !showEHR && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white select-none">
          Click to start
          <br />
          (WASD to move, Mouse to look)
          <br />
          ESC to exit
        </div>
      )}

      {showInteractPrompt && !showEHR && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded">
          Press 'E' to interact
        </div>
      )}

      {showEHR && (
        <EHROverlay onClose={() => {
          setShowEHR(false)
          setIsLocked(true)
        }} />
      )}
    </div>
  )
}

export default App
