"use client";

import { ReactLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useEffect, ReactNode, useState } from "react";
import { X, Music, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface HomeClientWrapperProps {
  children: ReactNode;
}

const HomeClientWrapper = ({ children }: HomeClientWrapperProps) => {
  const [showPopup, setShowPopup] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  // Artist images for the carousel
  const artistImages = [
    {
      src: "/assets/proshow/Masala Coffee.png", // Update with actual path to the Masala Coffee band image
      alt: "Masala Coffee",
    },
    {
      src: "/assets/proshow/candice-banner.png", // Update with actual path to the Masala Coffee band image
      alt: "Candice Banner",
    },
    {
      src: "/assets/proshow/harry-banner.png", // Update with actual path to the Masala Coffee band image
      alt: "Harry Banner",
    },
    {
      src: "/assets/proshow/rubz-banner.png", // Update with actual path to the Masala Coffee band image
      alt: "Rubz Banner",
    },
    {
      src: "/assets/proshow/sparrow-banner.png", // Update with actual path to the Masala Coffee band image
      alt: "Sparrow Banner",
    },
  ];

  // Auto-rotate images
  useEffect(() => {
    if (!showPopup) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % artistImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [showPopup, artistImages.length]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animation for DemoPage
    gsap.from("#demo", {
      scrollTrigger: {
        trigger: "#demo",
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
      opacity: 0,
      y: 100,
    });

    // Animation for Aboutdept
    gsap.from("#aboutdept", {
      scrollTrigger: {
        trigger: "#aboutdept",
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
      opacity: 0,
      y: 100,
    });

    // Animation for Musicalnight
    // gsap.from("#musicalnight", {
    //   scrollTrigger: {
    //     trigger: "#musicalnight",
    //     start: "top center",
    //     end: "bottom center",
    //     scrub: 1,
    //   },
    //   opacity: 0,
    //   y: 100,
    // });
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % artistImages.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + artistImages.length) % artistImages.length
    );
  };

  return (
    <ReactLenis root options={{ smoothWheel: true, lerp: 0.1 }}>
      {children}
      <span>
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="fixed bottom-6 md:right-6 right-5 left-5 z-50 max-w-md"
            >
              <div className="relative overflow-hidden rounded-xl shadow-2xl shadow-purple-500/30 backdrop-blur-md border border-purple-500/20 bg-black">
                {/* Close button with enhanced style */}
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-3 left-3 p-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-colors z-20"
                  aria-label="Close popup"
                >
                  <X size={16} />
                </button>

                {/* Image carousel */}
                <div className="relative aspect-[16.5/6] overflow-hidden">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10"></div>

                  <div className="absolute inset-0 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={artistImages[currentImage].src}
                          alt={artistImages[currentImage].alt}
                          fill
                          className="object-cover object-center transform hover:scale-110 transition-transform duration-700"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Carousel navigation buttons */}
                  {/* <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={20} />
                </button> */}

                  {/* Carousel indicators */}
                  {/* <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {artistImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImage === index ? "bg-white w-4" : "bg-white/50"
                      }`}
                    />
                  ))}
              </div> */}
                </div>

                {/* Content section with floating particles */}
                <div className="relative overflow-hidden p-4">
                  <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-purple-500/30 blur-sm animate-float-slow"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          width: `${Math.random() * 10 + 5}px`,
                          height: `${Math.random() * 10 + 5}px`,
                          animationDelay: `${Math.random() * 3}s`,
                          animationDuration: `${Math.random() * 5 + 10}s`,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Event title with enhanced styling */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                        <Music size={14} className="text-white" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-xl font-bold text-white font-montserrat">
                          PROSHOW NIGHT
                        </h3>
                        <span className="text-xs text-purple-300 uppercase tracking-wider font-medium">
                          TEXUS &apos;25 Presents
                        </span>
                        {/* <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 font-montserrat">
                          2 Day Passes for Musical Night 2025 + Merch Inclusive
                        </h3> */}
                      </div>
                    </div>

                    {/* Price tag */}

                    {/* Featured artists banner */}
                    <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-2 mb-3 border border-purple-500/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs text-purple-300 block"></span>
                          <span className="text-xs uppercase font-bold text-white">
                            2 Day Passes for Musical Night 2025 + Merch
                            Inclusive
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 mb-3">
                      Experience an unforgettable night of rhythm and melodies
                      at TEXUS &apos;25!{" "}
                      <span className="text-yellow-300 font-medium">
                        Phase I tickets limited - grab yours before they&apos;re
                        gone!
                      </span>
                    </p>

                    {/* Date and action button */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">
                          March 28-29, 2025
                        </span>
                        <span className="text-xs text-purple-300 font-medium">
                          SRM IST Ramapuram
                        </span>
                      </div>
                      <div className="mt-1 mb-2 mr-4 md:mr-0 inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        ₹699 only
                      </div>
                      <Link href="/musical-night" className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
                        <button className="relative px-2 md:px-4 py-2 rounded-lg bg-gradient-to-br from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 whitespace-nowrap text-white text-sm font-medium transition-all duration-300 transform hover:scale-105">
                          Grab Tickets
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Gradient border */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </ReactLenis>
  );
};

export default HomeClientWrapper;
