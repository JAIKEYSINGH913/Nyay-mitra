"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Text, Line, Stars } from "@react-three/drei";
import * as THREE from "three";

const NODE_COUNT = 24; 
const COLORS = ["#E01E22", "#0043eb", "#ffffff", "#3b82f6", "#ef4444"];

interface Node {
  id: number;
  position: [number, number, number];
  color: string;
  label: string;
}

interface Edge {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

function GraphContent() {
  const groupRef = useRef<THREE.Group>(null);

  const nodes: Node[] = useMemo(() => {
    const temp: Node[] = [];
    const labels = [
      "IPC_302", "BNS_101", "STATUTE", "CORE_NODE", "JURIS_PRUDENCE",
      "LEGAL_SYNC", "DELTA_01", "ALPHA_VAULT", "JUDICIARY", "EVIDENCE",
      "MIGRATION", "PROTOCOL", "TELEMETRY", "VERACITY", "SOVEREIGN",
      "NEURAL_MAP", "DATA_SILO", "VOICE_VANI", "GRAPH_DB", "BRIDGE"
    ];
    
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      const radius = 7 + Math.random() * 3;
      temp.push({
        id: i,
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 10,
          Math.sin(angle) * radius,
        ],
        color: COLORS[i % COLORS.length],
        label: labels[i % labels.length] || `NODE_${i}`,
      });
    }
    return temp;
  }, []);

  const edges: Edge[] = useMemo(() => {
    const temp: Edge[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const connectionCount = 2;
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = (i + Math.floor(Math.random() * 5) + 1) % nodes.length;
        temp.push({
          start: nodes[i].position,
          end: nodes[targetIndex].position,
          color: nodes[i].color
        });
      }
    }
    return temp;
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={1.5} />
      <pointLight position={[15, 15, 15]} intensity={3} color="#ffffff" />
      <directionalLight position={[0, 10, 0]} intensity={1.5} />
      <pointLight position={[-15, -15, -15]} intensity={2} color="#ffffff" />

      {/* Industrial Grid Base (Cinematic) */}
      <gridHelper args={[60, 60, "#ffffff", "#333333"]} position={[0, -12, 0]} opacity={0.15} transparent />

      {/* Render Edges - Cinematic Glow Lines */}
      {edges.map((edge, i) => (
        <Line
          key={`edge-${i}`}
          points={[edge.start, edge.end]}
          color={edge.color}
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      ))}

      {/* Render Nodes - High Contrast Spheres */}
      {nodes.map((node) => (
        <Float
          key={`node-${node.id}`}
          speed={1.5}
          rotationIntensity={0.5}
          floatIntensity={1}
          position={node.position}
        >
          <Sphere args={[0.7, 32, 32]}>
            <MeshDistortMaterial
              color={node.color}
              speed={3}
              distort={0.4}
              radius={1}
              emissive={node.color}
              emissiveIntensity={5}
            />
          </Sphere>
          
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.08}
            outlineColor="#000000"
          >
            {node.label}
          </Text>

          {/* Core glow point */}
          <pointLight intensity={1} color={node.color} distance={5} />
        </Float>
      ))}
    </group>
  );
}

export default function LegalGraph3D() {
  return (
    <div className="w-full h-full min-h-[600px] relative">
      <Canvas 
        camera={{ position: [0, 8, 25], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000');
        }}
      >
        <React.Suspense fallback={null}>
          <GraphContent />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={false}
            rotateSpeed={0.5}
          />
        </React.Suspense>
      </Canvas>

      {/* HUD Overlays - Integrated directly to ensure visibility */}
      <div className="absolute inset-0 z-10 pointer-events-none p-10 flex flex-col justify-between">
         <div className="flex justify-between items-start">
            <div className="font-space text-[12px] text-white font-black tracking-[0.5em] bg-black/60 p-4 border-l-2 border-white/50 backdrop-blur-sm">NEURAL_GRAPH_HYDRATION_ACTIVE</div>
            <div className="font-mono text-[10px] text-white/60 text-right uppercase bg-black/40 p-2 backdrop-blur-sm">NODES: 24<br />EDGES: 48<br />SYNC_LEVEL: STABLE</div>
         </div>
         <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  );
}
