// import { HeroParallaxDemo } from "../abouthero/page";

// const DemoPage = () => {
//   return (
//     <div>
//       <HeroParallaxDemo />
//     </div>
//   );
// };

// export default DemoPage;

"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Dynamically import InfiniteScroll with no SSR to reduce initial bundle
const InfiniteScroll = dynamic(() => import("@/components/ui/InfiniteScroll"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-black/20 animate-pulse"></div>
  ),
});

// Separate loading component for better code splitting
const LoadingComponent = dynamic(() => import("@/components/Loading"), {
  ssr: false,
});

// Initial image path constants to avoid string duplication
const IMAGE_PATHS = {
  GALA_2024: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala",
  TEXUS_2023: "/assets/gallery-assets/texus-2k23/texus-2k23",
};

const DemoPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedBatch, setLoadedBatch] = useState(1);
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  // Only create initial items once
  const initialItems = useMemo(
    () => [
      { content: `${IMAGE_PATHS.GALA_2024} (1).jpeg` },
      { content: `${IMAGE_PATHS.TEXUS_2023} (1).jpg` },
    ],
    []
  );

  // Complete set of images that will be loaded progressively
  const [items, setItems] = useState(initialItems);

  // Load images in batches as component remains in view
  useEffect(() => {
    if (!inView) return;

    // Progressive loading strategy - load in smaller batches
    const loadNextBatch = () => {
      if (loadedBatch === 1) {
        setItems((prevItems) => [
          ...prevItems,
          { content: `${IMAGE_PATHS.GALA_2024} (8).jpeg` },
          { content: `${IMAGE_PATHS.TEXUS_2023} (10).jpg` },
        ]);
        setLoadedBatch(2);
        setIsLoaded(true);
      } else if (loadedBatch === 2) {
        setItems((prevItems) => [
          ...prevItems,
          { content: `${IMAGE_PATHS.GALA_2024} (4).jpeg` },
          { content: `${IMAGE_PATHS.GALA_2024} (6).jpeg` },
          { content: `${IMAGE_PATHS.TEXUS_2023} (3).jpg` },
        ]);
        setLoadedBatch(3);
      } else if (loadedBatch === 3 && inView) {
        // Load remaining images when user has stayed on the component
        setItems((prevItems) => [
          ...prevItems,
          { content: `${IMAGE_PATHS.TEXUS_2023} (5).jpg` },
          { content: `${IMAGE_PATHS.TEXUS_2023} (6).jpg` },
          { content: `${IMAGE_PATHS.TEXUS_2023} (16).jpg` },
          { content: `${IMAGE_PATHS.TEXUS_2023} (24).jpg` },
        ]);
        setLoadedBatch(4);
      }
    };

    const timer = setTimeout(loadNextBatch, loadedBatch * 200);
    return () => clearTimeout(timer);
  }, [inView, loadedBatch, initialItems]);

  // Memoize the about text content to prevent re-creation
  const aboutContent = useMemo(
    () => (
      <motion.p
        initial={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.8 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-white/90 text-justify font-montserrat mt-10 md:text-xl leading-relaxed relative z-10 rounded-2xl"
      >
        TEXUS &apos;26, is the Flagship, International-level tech fest organized
        by the Faculty of Engineering and Technology, SRM IST Ramapuram. It is a
        two-day celebration of innovation and talent, set to be held on FEB 27th
        and 28th, 2026. It features a 24-hour international-level
        hackathon, 35+ technical events, 15+ non-technical events, and 7
        workshops. Beyond these events, attendees can participate in a blood
        donation camp, a walkathon advocating for a drug-free society, and an
        electrifying musical night. More than just a fest, TEXUS &apos;26 is a
        global platform for students to showcase their skills and drive
        innovation.
      </motion.p>
    ),
    []
  );

  return (
    <div className="relative w-full h-full bg-black/30" ref={ref}>
      <div className="absolute z-10 px-10 md:px-40 flex flex-col justify-center top-[35%] items-center mx-auto">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.8 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl lg:text-6xl font-thuast dark:text-white"
        >
          ABOUT TEXUS
        </motion.h1>
        {aboutContent}
      </div>

      {/* Only render InfiniteScroll when we have at least some images */}
      {items.length > 0 && (
        <InfiniteScroll
          items={items}
          isTilted={true}
          tiltDirection="left"
          autoplay={isLoaded}
          autoplaySpeed={2}
          autoplayDirection="down"
          pauseOnHover={true}
        />
      )}
    </div>
  );
};

export default React.memo(DemoPage);
