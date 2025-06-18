// BackgroundAn.js
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import MyHome from './MyHome'; 
const AnimatedStars = () => {
  const groupRef = useRef();

  // This will rotate the entire group on the Y-axis for animation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
    </group>
  );
};

const BackgroundAnimation1 = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <AnimatedStars />
        
      </Suspense>
    </Canvas>
  );
};

export default BackgroundAnimation1;
