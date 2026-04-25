"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Text, Line, Stars } from "@react-three/drei";
import * as THREE from "three";

const NODE_COUNT = 25;
const COLORS = ["#00E0FF", "#FFB900", "#E01E22", "#10B981"];

interface Node {
  id: number;
  position: [number, number, number];
  color: string;
  label: string;
}

interface Edge {
  start: [number, number, number];
  end: [number, number, number];
}

function GraphContent() {
  const groupRef = useRef<THREE.Group>(null);

  const nodes: Node[] = useMemo(() => {
    const temp: Node[] = [];
    const labels = [
      "IPC_302", "BNS_101", "CRIMINAL_CODE", "MURDER", "ASSAULT",
      "IPC_420", "BNS_204", "FRAUD", "THEFT", "CYBER_CRIME",
      "STATUTE_7", "PROTOCOL_X", "JUDICIARY", "EVIDENCE", "COURT"
    ];
    
    for (let i = 0; i < NODE_COUNT; i++) {
      temp.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 15, // Increased spread (from 10 to 15)
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
        ],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        label: labels[i % labels.length],
      });
    }
    return temp;
  }, []);

  const edges: Edge[] = useMemo(() => {
    const temp: Edge[] = [];
    for (let i = 0; i < nodes.length; i++) {
      // Connect each node to 1-2 others to simulate a graph
      const connectionCount = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodes.length);
        if (targetIndex !== i) {
          temp.push({
            start: nodes[i].position,
            end: nodes[targetIndex].position,
          });
        }
      }
    }
    return temp;
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003; // Slightly faster rotation
      groupRef.current.rotation.x += 0.001; // Added x-axis rotation for more 3D feel
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.7} />
      <pointLight position={[15, 15, 15]} intensity={2} color="#00E0FF" />
      <pointLight position={[-15, -15, -15]} intensity={1} color="#FFB900" />
      <spotLight position={[0, 20, 0]} intensity={1.5} angle={0.5} penumbra={1} />

      {/* Render Edges */}
      {edges.map((edge, i) => (
        <Line
          key={`edge-${i}`}
          points={[edge.start, edge.end]}
          color="#00E0FF" // Colored edges for more 3D visibility
          lineWidth={1.5} // Thicker lines
          transparent
          opacity={0.3}
        />
      ))}

      {/* Render Nodes */}
      {nodes.map((node) => (
        <Float
          key={`node-${node.id}`}
          speed={3} // Faster floating
          rotationIntensity={1.5}
          floatIntensity={2}
          position={node.position}
        >
          <Sphere args={[0.35, 32, 32]}>
            <MeshDistortMaterial
              color={node.color}
              speed={3}
              distort={0.4}
              radius={1}
              emissive={node.color}
              emissiveIntensity={3} // Higher glow
            />
          </Sphere>
          <Text
            position={[0, 0.7, 0]} // Higher label
            fontSize={0.3} // Larger text
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#000000"
          >
            {node.label}
          </Text>
        </Float>
      ))}
    </group>
  );
}

export default function LegalGraph3D() {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas camera={{ position: [0, 0, 18], fov: 65 }}>
        <React.Suspense fallback={null}>
          <GraphContent />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
