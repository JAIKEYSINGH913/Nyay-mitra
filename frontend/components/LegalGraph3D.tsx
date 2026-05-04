"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Text, Line, Stars } from "@react-three/drei";
import * as THREE from "three";

const NODE_COUNT = 25; 
const COLORS = ["#E01E22", "#0043eb", "#ffffff", "#00E0FF", "#FFD700"];

interface Node {
  id: number;
  position: [number, number, number];
  color: string;
  label: string;
  size: number;
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
    
    // 1. Central "Sun" Node
    temp.push({
      id: 0,
      position: [0, 0, 0],
      color: "#FFD700", // Sun Gold
      label: "NYAY_KERNEL_CORE",
      size: 1.8
    });

    // 2. Orbiting "Planet" Nodes (Scattered)
    for (let i = 1; i < NODE_COUNT; i++) {
      const radius = 6 + Math.random() * 10; // Increased radius range (6 to 16)
      const angle = Math.random() * Math.PI * 2;
      temp.push({
        id: i,
        position: [
          Math.cos(angle) * radius + (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 18, // Slightly higher vertical variance
          Math.sin(angle) * radius + (Math.random() - 0.5) * 6,
        ],
        color: COLORS[i % COLORS.length],
        label: labels[i % labels.length] || `PROTOCOL_${i}`,
        size: 0.4 + Math.random() * 0.8
      });
    }

    // 3. Collision Avoidance Loop: Spread overlapping nodes
    const MIN_DIST = 5; // Minimum distance to prevent overlaps
    for (let step = 0; step < 10; step++) {
      for (let i = 0; i < temp.length; i++) {
        for (let j = i + 1; j < temp.length; j++) {
          const dx = temp[i].position[0] - temp[j].position[0];
          const dy = temp[i].position[1] - temp[j].position[1];
          const dz = temp[i].position[2] - temp[j].position[2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (dist < MIN_DIST) {
            // Push them apart
            const force = (MIN_DIST - dist) / (dist || 1) * 0.5;
            const mx = dx * force;
            const my = dy * force;
            const mz = dz * force;
            
            temp[i].position[0] += mx;
            temp[i].position[1] += my;
            temp[i].position[2] += mz;
            
            temp[j].position[0] -= mx;
            temp[j].position[1] -= my;
            temp[j].position[2] -= mz;
          }
        }
      }
    }

    return temp;
  }, []);

  const edges: Edge[] = useMemo(() => {
    const temp: Edge[] = [];
    // Distance-based connections for a "Neural Mesh" feel
    for (let i = 0; i < nodes.length; i++) {
      const connections: {idx: number, dist: number}[] = [];
      
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const d = Math.sqrt(
          Math.pow(nodes[i].position[0] - nodes[j].position[0], 2) +
          Math.pow(nodes[i].position[1] - nodes[j].position[1], 2) +
          Math.pow(nodes[i].position[2] - nodes[j].position[2], 2)
        );
        connections.push({idx: j, dist: d});
      }

      // Sort by distance and connect to 2 closest neighbors
      connections.sort((a, b) => a.dist - b.dist);
      for (let k = 0; k < 2; k++) {
        temp.push({
          start: nodes[i].position,
          end: nodes[connections[k].idx].position,
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
      <gridHelper args={[60, 60, "#ffffff", "#333333"]} position={[0, -12, 0]} />

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
          speed={node.id === 0 ? 0.5 : 1.5}
          rotationIntensity={0.5}
          floatIntensity={node.id === 0 ? 0.2 : 1}
          position={node.position}
        >
          <Sphere args={[node.size, 32, 32]}>
            <MeshDistortMaterial
              color={node.color}
              speed={node.id === 0 ? 2 : 3}
              distort={node.id === 0 ? 0.2 : 0.4}
              radius={1}
              emissive={node.color}
              emissiveIntensity={node.id === 0 ? 10 : 5}
            />
          </Sphere>
          
          <Text
            position={[0, node.size + 1, 0]}
            fontSize={node.id === 0 ? 0.8 : 0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.08}
            outlineColor="#000000"
          >
            {node.label}
          </Text>

          {/* Core glow point */}
          <pointLight intensity={node.id === 0 ? 5 : 1} color={node.color} distance={node.id === 0 ? 15 : 5} />
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
