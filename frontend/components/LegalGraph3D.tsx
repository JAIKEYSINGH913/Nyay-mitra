"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Text, Line, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

const NODE_COUNT = 15; // Reduced as requested previously
const COLORS = ["#00E0FF", "#FFB900", "#E01E22", "#10B981", "#8B5CF6"];

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
  const { theme } = useTheme();

  const nodes: Node[] = useMemo(() => {
    const temp: Node[] = [];
    const labels = [
      "IPC_302", "BNS_101", "LAWS", "MURDER", "ASSAULT",
      "IPC_420", "BNS_204", "FRAUD", "THEFT", "CYBER",
      "STATUTE", "RULES", "JUDICIARY", "EVIDENCE", "COURT"
    ];
    
    for (let i = 0; i < NODE_COUNT; i++) {
      temp.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
        ],
        color: COLORS[i % COLORS.length],
        label: labels[i % labels.length],
      });
    }
    return temp;
  }, []);

  const edges: Edge[] = useMemo(() => {
    const temp: Edge[] = [];
    for (let i = 0; i < nodes.length; i++) {
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

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.x += 0.0005;
    }
  });

  const edgeColor = theme === "dark" ? "#ffffff" : "#000000";
  const edgeWidth = theme === "dark" ? 1 : 2.5; // Thicker lines for light mode
  const edgeOpacity = theme === "dark" ? 0.3 : 0.8;

  return (
    <group ref={groupRef}>
      {theme === "dark" && (
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      )}
      <ambientLight intensity={theme === "dark" ? 0.5 : 1} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={theme === "dark" ? "#00E0FF" : "#ffffff"} />
      <pointLight position={[-10, -10, -10]} intensity={1} color={theme === "dark" ? "#FFB900" : "#ffffff"} />

      {/* Render Edges */}
      {edges.map((edge, i) => (
        <Line
          key={`edge-${i}`}
          points={[edge.start, edge.end]}
          color={edgeColor}
          lineWidth={edgeWidth}
          transparent
          opacity={edgeOpacity}
        />
      ))}

      {/* Render Nodes */}
      {nodes.map((node) => (
        <Float
          key={`node-${node.id}`}
          speed={2}
          rotationIntensity={1}
          floatIntensity={1.5}
          position={node.position}
        >
          <Sphere args={[0.4, 32, 32]}>
            <MeshDistortMaterial
              color={node.color}
              speed={2}
              distort={0.3}
              radius={1}
              emissive={node.color}
              emissiveIntensity={theme === "dark" ? 2 : 0.5}
            />
          </Sphere>
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.35}
            color={theme === "dark" ? "white" : "#000000"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor={theme === "dark" ? "#000000" : "#ffffff"}
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
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
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
