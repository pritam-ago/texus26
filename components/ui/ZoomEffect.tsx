"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const ZoomEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "bottom top",
            scrub: true,
            pin: true,
            markers: false, // Set to true for debugging
          },
        })
        .to(imageRef.current, {
          scale: 1.8,
          duration: 1,
          ease: "power2.out",
        })
        .to(
          borderRef.current,
          {
            opacity: 0,
            duration: 0.5,
          },
          "-=0.5" // Overlap with the zoom animation
        );
    });

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div className="h-[200vh] w-full relative">
      <div
        ref={containerRef}
        className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Container for the zoom effect */}
        <div className="relative w-[80vw] h-[80vh] md:w-[70vw] md:h-[70vh] lg:w-[60vw] lg:h-[60vh]">
          {/* White Border */}
          <div
            ref={borderRef}
            className="absolute inset-0 border-4 border-white transition-opacity z-10"
          ></div>

          {/* Image that zooms */}
          <div className="relative w-full h-full">
            <Image
              ref={imageRef}
              src="/assets/eventsbg.png"
              alt="Zoom Effect"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoomEffect;
