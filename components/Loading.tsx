"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

const LoadingComponent = () => {
  // Add useEffect to handle scroll
  useEffect(() => {
    // Disable scroll when component mounts
    document.body.style.overflow = "hidden";

    // Re-enable scroll when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="h-screen w-screen fixed overflow-y-hidden z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Infinity loader - enlarged */}
        <svg width="120" height="60" viewBox="0 0 60 30">
          <motion.path
            d="M15,15 C15,7.5 22.5,7.5 30,15 C37.5,22.5 45,22.5 45,15 C45,7.5 37.5,7.5 30,15 C22.5,22.5 15,22.5 15,15 Z"
            fill="transparent"
            strokeWidth="3"
            stroke="rgba(255,255,255,0.2)"
            strokeLinecap="round"
          />
          <motion.path
            d="M15,15 C15,7.5 22.5,7.5 30,15 C37.5,22.5 45,22.5 45,15 C45,7.5 37.5,7.5 30,15 C22.5,22.5 15,22.5 15,15 Z"
            fill="transparent"
            strokeWidth="3"
            stroke="#ec4899" // pink-500 color
            strokeLinecap="round"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{
              pathLength: 1,
              pathOffset: 1,
              transition: {
                pathLength: { duration: 2, repeat: Infinity, ease: "linear" },
                pathOffset: { duration: 2, repeat: Infinity, ease: "linear" },
              },
            }}
          />
        </svg>
      </motion.div>

      {/* Simple text with subtle fade animation */}
      <motion.div className="mt-6 hidden md:block animate-pulse font-thuast text-base font-light text-gray-300">
        Entering into the world of Texus...
      </motion.div>
    </div>
  );
};

export default LoadingComponent;
