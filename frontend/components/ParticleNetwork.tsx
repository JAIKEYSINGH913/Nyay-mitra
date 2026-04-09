"use client";
import { useRef, useEffect } from "react";

interface Particle {
  x: number; y: number; z: number;
  originX: number; originY: number; originZ: number;
  vx: number; vy: number; vz: number;
  radius: number; color: string;
  angleY: number; angleX: number;
}

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // THE SOVEREIGN COCKPIT colors
    const colors = ["#e01e22", "#0043eb", "#e5e2e1", "#e01e22", "#353534"];

    const NUM_PARTICLES = 300;
    const particles: Particle[] = Array.from({ length: NUM_PARTICLES }, () => {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = Math.random() * 250 + 50;
      
      const px = r * Math.sin(phi) * Math.cos(theta);
      const py = r * Math.sin(phi) * Math.sin(theta);
      const pz = r * Math.cos(phi);

      return {
        x: px, y: py, z: pz,
        originX: px, originY: py, originZ: pz,
        vx: 0, vy: 0, vz: 0,
        radius: Math.random() * 2.0 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        angleY: Math.random() * Math.PI * 2,
        angleX: Math.random() * Math.PI * 2,
      };
    });

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      targetRotY = (x / width) * 0.8;
      targetRotX = (y / height) * 0.8;
    };
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", () => { targetRotX = 0; targetRotY = 0; });

    const fov = 500;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);
      const cosY = Math.cos(currentRotY - 0.001); 
      const sinY = Math.sin(currentRotY - 0.001);
      
      currentRotY -= 0.001;

      particles.forEach((p) => {
        p.angleY += 0.0005;
        p.angleX += 0.0005;
        
        p.vx += (p.originX - p.x) * 0.002;
        p.vy += (p.originY - p.y) * 0.002;
        p.vz += (p.originZ - p.z) * 0.002;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.vz *= 0.95;

        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        const scale = fov / (fov + z2 + 350);
        const px = x1 * scale + width / 2;
        const py = y2 * scale + height / 2;

        if (z2 + 350 > 0) {
          const r = p.radius * scale;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.1, r), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          if (p.color === "#e01e22") {
            ctx.shadowBlur = 15 * scale;
            ctx.shadowColor = "#e01e22";
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const resizeHandler = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeHandler);
      canvas.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
