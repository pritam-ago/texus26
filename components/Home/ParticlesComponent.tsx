import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  className?: string;
  reduced?: boolean;
}

const ParticlesComponent = ({
  className = "",
  reduced = false,
}: ParticlesProps) => {
  // Reduce particle count based on the reduced prop
  const particleCount = reduced ? 25 : 100;

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: 0,
          }}
          animate={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

export default ParticlesComponent;
