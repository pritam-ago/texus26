"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  image: string;
  rotation: number;
  sway: number;
  repeatDelay: number;
}

const FloatingParticles = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(1000);

  useEffect(() => {
    setIsMounted(true);
    setViewportHeight(window.innerHeight);

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const particles = useMemo(() => {
    if (!isMounted) return [];
    
    const particleArray: Particle[] = [];
    const particleCount = 12; // Reduced for better performance

    for (let i = 0; i < particleCount; i++) {
      const random = Math.random();
      let leafImage: string;
      
      if (random < 0.25) {
        leafImage = "/textures/leaf-1.png"; // 25% chance
      } else if (random < 0.5) {
        leafImage = "/textures/leaf-2.png"; // 25% chance
      } else {
        leafImage = "/textures/leaf-3.png"; // 50% chance
      }
      
      particleArray.push({
        id: i,
        x: Math.random() * 100, // Random horizontal position (%)
        y: -10 - Math.random() * 20, // Start above viewport (-10% to -30%)
        size: 40 + Math.random() * 60, // Larger: 40-100px
        duration: 10 + Math.random() * 15, // Faster falling: 10-25s
        delay: Math.random() * 10, // Random delay 0-10s
        image: leafImage,
        rotation: Math.random() * 360, // Random initial rotation
        sway: 30 + Math.random() * 50, // More horizontal movement: 30-80px
        repeatDelay: Math.random() * 3, // 0-3s pause between cycles
      });
    }

    return particleArray;
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{
            opacity: 0,
            rotate: particle.rotation,
          }}
          animate={{
            opacity: [0, 0.7, 0.7, 0.5, 0],
            y: [
              0,
              viewportHeight * 0.3,
              viewportHeight * 0.6,
              viewportHeight + 100,
            ],
            x: [
              0,
              particle.sway,
              -particle.sway,
              particle.sway / 2,
              -particle.sway / 3,
            ],
            rotate: [
              particle.rotation,
              particle.rotation + 90,
              particle.rotation + 270,
              particle.rotation + 450,
              particle.rotation + 720,
            ],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: particle.repeatDelay,
          }}
        >
          <Image
            src={particle.image}
            alt="floating leaf"
            width={particle.size}
            height={particle.size}
            className="object-contain opacity-60"
            draggable={false}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingParticles;
