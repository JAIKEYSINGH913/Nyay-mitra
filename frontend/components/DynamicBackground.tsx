"use client";
import React, { useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let particles: any[] = [];
    const particleCount = theme === "dark" ? 400 : 150;

    class Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
      distance: number;
      opacity: number;

      constructor() {
        this.init();
      }

      init() {
        if (theme === "dark") {
          // Vortex / Starfield effect
          this.distance = Math.random() * Math.max(width, height);
          this.angle = Math.random() * Math.PI * 2;
          this.z = Math.random() * 1000;
          this.x = Math.cos(this.angle) * this.distance;
          this.y = Math.sin(this.angle) * this.distance;
          this.size = Math.random() * 1.5 + 0.5;
          const colors = ["#ffffff", "#E01E22", "#ffffff", "#ffffff"]; // More white, less color for stability
          this.color = colors[Math.floor(Math.random() * colors.length)];
          this.speed = Math.random() * 2 + 1;
          this.opacity = Math.random();
        } else {
          // Multicolored floating particles
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.size = Math.random() * 4 + 2;
          const colors = ["#4285f4", "#ea4335", "#fbbc04", "#34a853"];
          this.color = colors[Math.floor(Math.random() * colors.length)];
          this.speed = Math.random() * 0.5 + 0.2;
          this.angle = Math.random() * Math.PI * 2;
          this.opacity = Math.random() * 0.5 + 0.2;
        }
      }

      update() {
        if (theme === "dark") {
          this.z -= this.speed * 2;
          if (this.z <= 0) {
            this.z = 1000;
            this.angle = Math.random() * Math.PI * 2;
            this.distance = Math.random() * Math.max(width, height);
          }
          
          // Perspective projection
          const scale = 500 / (500 + this.z);
          this.x = Math.cos(this.angle) * this.distance * scale + width / 2;
          this.y = Math.sin(this.angle) * this.distance * scale + height / 2;
          
          // Rotation for vortex feel
          this.angle += 0.002;
        } else {
          this.x += Math.cos(this.angle) * this.speed;
          this.y += Math.sin(this.angle) * this.speed;

          if (this.x < 0 || this.x > width) this.angle = Math.PI - this.angle;
          if (this.y < 0 || this.y > height) this.angle = -this.angle;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        if (theme === "dark") {
          const scale = 500 / (500 + this.z);
          const r = this.size * scale;
          ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = (1 - this.z / 1000) * this.opacity;
          if (this.color === "#E01E22") {
            ctx.shadowBlur = 4 * scale; // Minimal red glow to avoid "brown" shift
            ctx.shadowColor = this.color;
          } else {
            ctx.shadowBlur = 0;
          }
        } else {
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = this.opacity;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // In dark mode, add a slight trail effect
      if (theme === "dark") {
        ctx.fillStyle = "rgba(5, 5, 5, 0.1)"; // Match the charcoal black exactly
        ctx.fillRect(0, 0, width, height);
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none transition-colors duration-500"
      style={{ background: "var(--bg-primary)" }}
    />
  );
}
