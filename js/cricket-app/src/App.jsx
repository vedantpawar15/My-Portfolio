import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { PortfolioProvider } from './context/PortfolioContext';
import { Scene } from './components/Scene';
import { Overlay } from './ui/Overlay';

function SceneFallback() {
  return null;
}

export default function App() {
  useEffect(() => {
    THREE.ColorManagement.enabled = true;
  }, []);

  return (
    <PortfolioProvider>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.18,
        }}
        /* MCG-style: boundary rope height, wide angle, slight X offset — bowl fills frame */
        camera={{ position: [0.85, 1.52, 17.85], fov: 68, near: 0.06, far: 260 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<SceneFallback />}>
          <Scene />
        </Suspense>
      </Canvas>
      <Overlay />
    </PortfolioProvider>
  );
}
