"use client";
import React, { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  angle: number;
  isMagnetized: boolean;
  pulseSpeed: number;
}

export default function ParticleSwarm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const particleCount = 600; // Even more dense for the full-fold effect
    const colors = ["#e01e22", "#0042eb", "#ffffff", "#ffffff", "#0042eb"];
    
    // Define the "Logo Shape" - Balance Scales
    const logoPoints: { x: number; y: number }[] = [];
    for (let x = -130; x <= 130; x += 4) logoPoints.push({ x, y: -60 });
    for (let y = -60; y <= 120; y += 4) logoPoints.push({ x: 0, y });
    for (let x = -50; x <= 50; x += 5) logoPoints.push({ x, y: 120 });
    // Left Pan
    for (let i = 0; i < 25; i++) {
        logoPoints.push({ x: -130 - i, y: -60 + i * 4 });
        logoPoints.push({ x: -130 + i, y: -60 + i * 4 });
        logoPoints.push({ x: -155 + i * 2, y: 40 });
    }
    // Right Pan
    for (let i = 0; i < 25; i++) {
        logoPoints.push({ x: 130 - i, y: -60 + i * 4 });
        logoPoints.push({ x: 130 + i, y: -60 + i * 4 });
        logoPoints.push({ x: 105 + i * 2, y: 40 });
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originX: Math.random() * width,
        originY: Math.random() * height,
        vx: 0,
        vy: 0,
        radius: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        isMagnetized: false,
        pulseSpeed: 0.02 + Math.random() * 0.04
      });
    }

    let mouseX = -5000;
    let mouseY = -5000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseX = (e.clientX - rect.left) * scaleX;
      mouseY = (e.clientY - rect.top) * scaleY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const magnetRadius = 380; 

        if (dist < magnetRadius) {
          const point = logoPoints[i % logoPoints.length];
          const targetX = mouseX + point.x;
          const targetY = mouseY + point.y;
          
          p.vx += (targetX - p.x) * 0.11;
          p.vy += (targetY - p.y) * 0.11;
          p.isMagnetized = true;
        } else {
          p.angle += p.pulseSpeed;
          p.vx += Math.cos(p.angle) * 0.15;
          p.vy += Math.sin(p.angle) * 0.15;
          p.vx += (p.originX - p.x) * 0.004;
          p.vy += (p.originY - p.y) * 0.004;
          p.isMagnetized = false;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.87;
        p.vy *= 0.87;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        if (p.isMagnetized) {
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 18;
          ctx.shadowColor = p.color;
        } else {
          ctx.globalAlpha = 0.22;
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();

        if (p.isMagnetized && i % 20 === 0) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = 0.05;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
      
      particles.forEach(p => {
        p.originX = Math.random() * width;
        p.originY = Math.random() * height;
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full h-full relative pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-x-0 bottom-10 text-center pointer-events-none">
         <span className="telemetry-label !text-[7px] opacity-10 uppercase tracking-[0.6em]">SOVEREIGN_NEURAL_COMMAND_FOLD_99</span>
      </div>
    </div>
  );
}
