'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';

function Model() {
  const { scene } = useGLTF('/bento/hunts_pip.glb');
  
  // Detect if mobile screen
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  
  return (
    <primitive 
      object={scene} 
      scale={isMobile ? 2.0 : 1.2}
      position={[0, isMobile ? -0.5 : -0.3, 0]}
    />
  );
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
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} color="#3AF48A" />
          <spotLight position={[-10, 10, 10]} angle={0.3} intensity={0.6} color="#FF0000" />
          <pointLight position={[0, -5, 5]} intensity={0.5} color="#00dd5e" />
          
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
