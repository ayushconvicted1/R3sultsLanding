"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef(null);
  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

function Product3DScene({ url }: { url: string }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <Suspense fallback={null}>
        <Model url={url} />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls
        enableZoom
        enablePan
        enableRotate
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
    </>
  );
}

export default function Product3DViewer({ url }: { url: string }) {
  return (
    <div className="relative w-full aspect-square bg-slate-100 rounded-xl overflow-hidden">
      <Canvas
        camera={{ position: [2, 2, 2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <Product3DScene url={url} />
      </Canvas>
    </div>
  );
}
