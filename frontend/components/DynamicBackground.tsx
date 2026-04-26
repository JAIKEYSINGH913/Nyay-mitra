"use client";
import React, { useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

export default function DynamicBackground({ scrollProgress }: { scrollProgress?: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let particles: any[] = [];
    const particleCount = 1000;

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
        this.distance = Math.random() * Math.max(width, height) * 1.5;
        this.angle = Math.random() * Math.PI * 2;
        this.z = Math.random() * 2000;
        this.x = Math.cos(this.angle) * this.distance;
        this.y = Math.sin(this.angle) * this.distance;
        this.size = Math.random() * 1.5 + 0.1;
        
        if (theme === "dark") {
          const colors = ["#ffffff", "#00E0FF", "#ffffff", "#ffffff", "#F59E0B"];
          this.color = colors[Math.floor(Math.random() * colors.length)];
        } else {
          this.color = "#000000";
        }
        
        this.speed = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.6 + 0.2;
      }

      update(scrollVal: number) {
        // Accelerate speed based on scroll
        const scrollBoost = scrollVal * 20;
        this.z -= (this.speed + scrollBoost);
        
        if (this.z <= 0) {
          this.z = 2000;
          this.angle = Math.random() * Math.PI * 2;
          this.distance = Math.random() * Math.max(width, height) * 1.5;
        }
        
        const scale = 800 / (800 + this.z);
        this.x = Math.cos(this.angle) * this.distance * scale + width / 2;
        this.y = Math.sin(this.angle) * this.distance * scale + height / 2;
        this.angle += 0.001 + (scrollVal * 0.02); // Faster rotation on scroll
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        const scale = 800 / (800 + this.z);
        const r = this.size * scale * 2;
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = (1 - this.z / 2000) * this.opacity;
        
        if (theme === "dark" && this.color !== "#ffffff") {
          ctx.shadowBlur = 4 * scale;
          ctx.shadowColor = this.color;
        } else {
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
      
      const scrollVal = scrollProgress ? scrollProgress.get() : 0;

      particles.forEach((p) => {
        p.update(scrollVal);
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
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
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
