'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';

function Model() {
  try {
    const { scene } = useGLTF('/bento/hunts_pip.glb');
    
    // Detect if mobile screen
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    
    return (
      <primitive 
        object={scene} 
        scale={isMobile ? 1.2 : 0.5}
        position={[0, isMobile ? -0.5 : -0.3, 0]}
      />
    );
  } catch (error) {
    console.error('Error loading 3D model:', error);
    return null;
  }
}

export default function Model3DViewer() {
  const [error, setError] = useState(false);

  useEffect(() => {
    // Preload the model
    useGLTF.preload('/bento/hunts_pip.glb');
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        <p>Unable to load 3D model</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 40 }}
        style={{ background: 'transparent' }}
        onError={() => setError(true)}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <spotLight position={[-10, 10, 10]} angle={0.3} intensity={0.5} />
          
          <Model />
          
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            autoRotate
            autoRotateSpeed={2}
            minDistance={8}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
