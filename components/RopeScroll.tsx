"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Leaf {
  id: number;
  yPosition: number; // Position along the rope in pixels (relative to total document)
  side: "left" | "right";
  rotation: number;
  scale: number;
  offsetX: number;
  offsetY: number; // For clustering
  type: "small" | "medium" | "large";
}

export default function RopeScroll() {
  const ropeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leavesContainerRef = useRef<HTMLDivElement>(null);
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [documentHeight, setDocumentHeight] = useState(0);
  const leafRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());

// Generate clustered leaves along the entire document height
  useEffect(() => {
    const updateLeaves = () => {
      const docHeight = document.body.scrollHeight;
      setDocumentHeight(docHeight);
      
      const generatedLeaves: Leaf[] = [];
      const heroHeight = window.innerHeight; // First 100vh is hero
      const startY = heroHeight * 0.1; // Start very early at 10vh
      const endY = docHeight - heroHeight * 0.05; // End very late at 95% for full coverage
      const totalRopeLength = endY - startY;
      
      // Create clusters of leaves - 500% density (5x more leaves)
      const clusterSpacing = 8; // Much denser - cluster every 8px instead of 40px
      const clusterCount = Math.floor(totalRopeLength / clusterSpacing);
      let leafId = 0;
      
      for (let c = 0; c < clusterCount; c++) {
        const clusterY = startY + c * clusterSpacing;
        // Each cluster has 3-10 leaves (500% more than before)
        const leavesInCluster = 3 + Math.floor(Math.random() * 8); // 3-10 leaves per cluster
        
        for (let l = 0; l < leavesInCluster; l++) {
          const types: ("small" | "medium" | "large")[] = ["small", "small", "medium", "medium", "large"];
          const side = l % 2 === 0 ? "left" : "right";
          
          generatedLeaves.push({
            id: leafId++,
            yPosition: clusterY + (Math.random() * 20 - 10), // Tighter spread within cluster
            side: Math.random() > 0.3 ? side : (Math.random() > 0.5 ? "left" : "right"),
            rotation: Math.random() * 80 - 40,
            scale: 0.3 + Math.random() * 0.8, // Slightly more varied sizes
            offsetX: Math.random() * 15 - 7.5, // Similar offset
            offsetY: Math.random() * 8 - 4, // Tighter vertical clustering
            type: types[Math.floor(Math.random() * types.length)],
          });
        }
      }
      
      setLeaves(generatedLeaves);
    };

    // Initial calculation
    updateLeaves();
    
    // Recalculate on resize
    window.addEventListener("resize", updateLeaves);
    
    // Also recalculate after a short delay to ensure DOM is fully loaded
    const timeout = setTimeout(updateLeaves, 500);
    
    return () => {
      window.removeEventListener("resize", updateLeaves);
      clearTimeout(timeout);
    };
  }, []);

useEffect(() => {
    if (leaves.length === 0 || documentHeight === 0) return;

    // Initial state - all leaves hidden
    leafRefsMap.current.forEach((leafEl) => {
      if (!leafEl) return;
      gsap.set(leafEl, {
        opacity: 0,
        scale: 0,
      });
    });

    const viewportHeight = window.innerHeight;
    const heroMidpoint = viewportHeight * 0.1; // Matched to new start position
    const endThreshold = documentHeight - viewportHeight * 0.05; // Matched to new end position
    
    // Throttled scroll update function for better performance
    let ticking = false;
    const updateLeaves = (scrollY: number) => {
      if (ticking) return;
      ticking = true;
      
      requestAnimationFrame(() => {
        // Move the rope texture with scroll
        if (ropeRef.current) {
          ropeRef.current.style.backgroundPositionY = `${scrollY * 0.3}px`;
        }
        
        // Move entire leaves container - creates the "moving with rope" effect
        if (leavesContainerRef.current) {
          leavesContainerRef.current.style.transform = `translateY(${-scrollY}px)`;
        }
        
        ticking = false;
      });
    };
    
    // Main scroll animation - rope and leaves move together
    const scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1, // Increased scrub for smoother, less frequent updates
      onUpdate: (self) => {
        const scrollY = self.scroll();
        updateLeaves(scrollY);
      },
    });

    // Optimize leaf visibility updates - only update visible leaves
    const visibleLeafIndices = new Set<number>();
    
    const updateVisibleLeaves = () => {
      const scrollY = window.scrollY;
      
      leafRefsMap.current.forEach((leafEl, index) => {
        if (!leafEl) return;
        
        const leaf = leaves[index];
        if (!leaf) return;
        
        // Leaf's position on screen after scroll transform
        const leafScreenY = leaf.yPosition - scrollY;
        
        // Check if leaf should be visible
        const shouldBeVisible = 
          scrollY >= heroMidpoint - 100 && 
          scrollY <= endThreshold + 100 &&
          leafScreenY > -80 && 
          leafScreenY < viewportHeight + 80;
        
        const fadeOutZone = 150;
        const fadeInZone = viewportHeight - 80;
        
        let opacity = 0;
        let scale = 0;
        
        if (shouldBeVisible) {
          if (leafScreenY < fadeOutZone) {
            const progress = Math.max(0, (leafScreenY + 80) / (fadeOutZone + 80));
            opacity = progress * progress;
            scale = 0.1 + progress * 0.9;
          } else if (leafScreenY > fadeInZone) {
            const progress = 1 - (leafScreenY - fadeInZone) / (viewportHeight - fadeInZone + 80);
            opacity = Math.max(0, Math.min(1, progress * progress));
            scale = 0.1 + Math.max(0, Math.min(1, progress)) * 0.9;
          } else {
            opacity = 1;
            scale = 1;
          }
          
          // Only animate if state changed
          if (!visibleLeafIndices.has(index)) {
            gsap.to(leafEl, {
              opacity,
              scale: scale * leaf.scale,
              duration: 0.3,
              ease: "power2.out",
            });
            visibleLeafIndices.add(index);
          }
        } else {
          // Hide leaf if it was visible
          if (visibleLeafIndices.has(index)) {
            gsap.to(leafEl, {
              opacity: 0,
              scale: 0,
              duration: 0.2,
              ease: "power2.in",
            });
            visibleLeafIndices.delete(index);
          }
        }
      });
    };

    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateVisibleLeaves();
        }
      });
    }, { threshold: 0.1 });

    // Observe the container
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Reduced sway animations - only for visible leaves
    const setupSwayAnimation = () => {
      leafRefsMap.current.forEach((leafEl, index) => {
        if (!leafEl) return;
        
        const leaf = leaves[index];
        if (!leaf) return;
        
        // Only add sway to some leaves to reduce overhead
        if (index % 3 === 0) { // Every 3rd leaf
          const randomDelay = Math.random() * 5;
          const randomDuration = 3 + Math.random() * 4; // Slower animations
          gsap.to(leafEl, {
            rotation: `+=${Math.random() > 0.5 ? 6 : -6}`, // Smaller rotation
            duration: randomDuration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: randomDelay,
          });
        }
      });
    };

    // Delay setup to reduce initial load
    setTimeout(setupSwayAnimation, 1000);

    return () => {
      scrollTrigger.kill();
      observer.disconnect();
      // Clean up GSAP animations
      leafRefsMap.current.forEach((leafEl) => {
        if (leafEl) {
          gsap.killTweensOf(leafEl);
        }
      });
    };
  }, [leaves, documentHeight]);

  const setLeafRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      leafRefsMap.current.set(index, el);
    }
  };

// Leaf using actual image asset
  const renderLeaf = (leaf: Leaf) => {
    const baseSize = leaf.type === "small" ? 20 : leaf.type === "medium" ? 28 : 36;
    
    return (
      <img
        src="/textures/leaf.png"
        alt="Leaf"
        width={baseSize}
        height={baseSize}
        style={{
          transform: `${leaf.side === "right" ? "scaleX(-1)" : ""} rotate(${leaf.rotation}deg)`,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          objectFit: "contain",
        }}
      />
    );
  };

return (
    <div
      ref={containerRef}
      className="fixed right-3 md:right-6 top-0 z-50 pointer-events-none"
      style={{ 
        width: "70px",
        height: "300vh", // Much more extended height
        marginTop: "-100vh", // Start well above viewport
        marginBottom: "-100vh", // Extend well below viewport
      }}
    >
{/* Realistic Rope */}
      <div
        ref={ropeRef}
        className="absolute left-1/2 -translate-x-1/2 w-3.5 rounded-full"
        style={{
          height: "250vh", // Much longer rope to cover extended container
          top: "25vh", // Start rope higher to match extended container
          background: `
            repeating-linear-gradient(
              180deg,
              #C4A574 0px,
              #A8895A 2px,
              #8B7042 4px,
              #6B5530 6px,
              #8B7042 8px,
              #A8895A 10px,
              #C4A574 12px,
              #D4B584 14px,
              #C4A574 16px
            )
          `,
          backgroundSize: "100% 24px",
          boxShadow: `
            inset 3px 0 6px rgba(0,0,0,0.5),
            inset -3px 0 6px rgba(0,0,0,0.4),
            2px 0 4px rgba(0,0,0,0.3),
            -2px 0 4px rgba(0,0,0,0.3)
          `,
        }}
      >
        {/* Twisted fiber pattern */}
        <div 
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `
              repeating-linear-gradient(
                25deg,
                transparent 0px,
                transparent 1px,
                rgba(255, 240, 200, 0.12) 1px,
                rgba(255, 240, 200, 0.12) 2px,
                transparent 2px,
                transparent 3px
              ),
              repeating-linear-gradient(
                -25deg,
                transparent 0px,
                transparent 1px,
                rgba(60, 40, 20, 0.15) 1px,
                rgba(60, 40, 20, 0.15) 2px,
                transparent 2px,
                transparent 3px
              )
            `,
          }}
        />
        {/* Highlight */}
        <div 
          className="absolute left-0.5 top-0 w-1 h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
          }}
        />
        {/* Shadow edge */}
        <div 
          className="absolute right-0 top-0 w-1 h-full rounded-full"
          style={{
            background: "linear-gradient(270deg, rgba(0,0,0,0.25) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Leaves container - moves with scroll, height matches document */}
      <div 
        ref={leavesContainerRef} 
        className="absolute left-0 right-0 top-0"
        style={{ height: `${documentHeight}px` }}
      >
        {leaves.map((leaf, index) => (
          <div
            key={leaf.id}
            ref={(el) => setLeafRef(el, index)}
            className="absolute"
            style={{
              top: `${leaf.yPosition + leaf.offsetY}px`,
              left: "50%",
              transform: `translateX(${leaf.side === "left" ? -18 + leaf.offsetX : 4 + leaf.offsetX}px) rotate(${leaf.rotation}deg)`,
              transformOrigin: leaf.side === "left" ? "right center" : "left center",
              opacity: 0,
            }}
          >
            {renderLeaf(leaf)}
          </div>
        ))}
        
        {/* Small vine tendrils connecting to rope */}
        {leaves.filter((_, i) => i % 4 === 0).map((leaf) => (
          <div
            key={`tendril-${leaf.id}`}
            className="absolute"
            style={{
              top: `${leaf.yPosition + leaf.offsetY}px`,
              left: "50%",
              width: "12px",
              height: "2px",
              transform: `translateX(${leaf.side === "left" ? -14 : 2}px)`,
              background: `linear-gradient(${leaf.side === "left" ? "90deg" : "270deg"}, #5CB85C 0%, #388E3C 60%, transparent 100%)`,
              borderRadius: "1px",
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
}