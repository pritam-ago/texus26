"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  PAPER,
  headingFont,
  bodyFont,
  Tape,
  CardTree,
  DoodleLine,
  PaperBase,
  Vignette,
} from "@/components/PaperComponents";

// Updated InkBadge to match navbar active button style
const InkBadge = ({ text }: { text: string }) => (
  <motion.span
    whileHover={{ y: -2, scale: 1.05 }}
    transition={{ type: "spring", stiffness: 500, damping: 22 }}
    className="inline-flex items-center px-4 py-2 rounded-xl text-sm md:text-base font-extrabold tracking-wider select-none"
    style={{
      background: PAPER.accent,
      color: PAPER.ink,
      fontFamily: headingFont,
      border: `3px solid ${PAPER.ink}`,
      boxShadow: `3px 3px 0 ${PAPER.shadow}`,
    }}
  >
    {text}
  </motion.span>
);

// Updated PolaroidCard to match Hero section style (simple border)
const PolaroidCard = ({
  src,
  alt,
  rotate = 0,
}: {
  src: string;
  alt: string;
  rotate?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotate: rotate }
          : { opacity: 0, y: 30, rotate: 0 }
      }
      whileHover={{
        y: -10,
        rotate: rotate + 2,
        scale: 1.05,
        boxShadow: `12px 12px 0 ${PAPER.shadow}`,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group"
      style={{ rotate: `${rotate}deg` }}
    >
      {/* Tape on top */}
      <Tape
        className="-top-4 left-1/4 z-20"
        rotate={-6}
      />

      <div
        className="relative rounded-xl overflow-hidden p-3"
        style={{
          background: PAPER.white,
          border: `3px solid ${PAPER.ink}`,
          boxShadow: `8px 8px 0 ${PAPER.shadow}`,
        }}
      >
        <div className="relative w-full aspect-square overflow-hidden rounded-lg">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "linear-gradient(180deg, rgba(247,244,238,0.1), rgba(247,244,238,0.3))",
            }}
          />
        </div>

        {/* Trees at bottom corners */}
        <CardTree className="absolute bottom-1 left-1" side="left" size={40} />
        <CardTree className="absolute bottom-1 right-1" side="right" size={40} />

        {/* Caption area */}
        <div
          className="mt-3 text-center relative z-10"
          style={{
            fontFamily: bodyFont,
            color: PAPER.ink,
            fontSize: "0.75rem",
            opacity: 0.7,
          }}
        >
          TEXUS Memories
        </div>
      </div>
    </motion.div>
  );
};

const SectionHeader = ({
  title,
  subtitle,
  badgeText,
}: {
  title: string;
  subtitle: string;
  badgeText: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 px-4"
    >
      <div className="flex justify-center mb-4">
        <InkBadge text={badgeText} />
      </div>

      <h2
        className="text-3xl md:text-5xl font-extrabold mb-4"
        style={{
          fontFamily: headingFont,
          color: PAPER.ink,
          letterSpacing: "0.05em",
          textShadow: "2px 2px 0 rgba(14,42,68,0.1)",
        }}
      >
        {title}
      </h2>

      <div className="flex justify-center mb-4">
        <DoodleLine />
      </div>

      <p
        className="text-base md:text-lg max-w-2xl mx-auto italic"
        style={{
          fontFamily: bodyFont,
          color: "rgba(18,56,89,0.85)",
        }}
      >
        {subtitle}
      </p>
    </motion.div>
  );
};

// Random rotation generator
const getRandomRotation = (index: number) => {
  const rotations = [-4, -2, 0, 2, 4, -3, 3, -1, 1];
  return rotations[index % rotations.length];
};

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  const hackathon2025 = [
    { src: "/assets/gallery-hackathon/hackathon1.jpg", alt: "Hackathon 1" },
    { src: "/assets/gallery-hackathon/hackathon2.jpg", alt: "Hackathon 2" },
    { src: "/assets/gallery-hackathon/hackathon7.jpg", alt: "Hackathon 3" },
    { src: "/assets/gallery-hackathon/hackathon4.jpg", alt: "Hackathon 4" },
    { src: "/assets/gallery-hackathon/hackathon5.jpg", alt: "Hackathon 5" },
    { src: "/assets/gallery-hackathon/hackathon6.jpg", alt: "Hackathon 6" },
    { src: "/assets/gallery-hackathon/hackathon3.jpg", alt: "Hackathon 7" },
    { src: "/assets/gallery-hackathon/hackathon8.jpg", alt: "Hackathon 8" },
    { src: "/assets/gallery-hackathon/hackathon9.jpg", alt: "Hackathon 9" },
  ];

  const bloodDonation2025 = [
    { src: "/assets/gallery-assets/blooddonation/BD1.jpg", alt: "Blood Donation 1" },
    { src: "/assets/gallery-assets/blooddonation/BD2.jpg", alt: "Blood Donation 2" },
    { src: "/assets/gallery-assets/blooddonation/BD3.jpg", alt: "Blood Donation 3" },
    { src: "/assets/gallery-assets/blooddonation/BD4.jpg", alt: "Blood Donation 4" },
    { src: "/assets/gallery-assets/blooddonation/BD5.jpg", alt: "Blood Donation 5" },
    { src: "/assets/gallery-assets/blooddonation/BD6.jpg", alt: "Blood Donation 6" },
    { src: "/assets/gallery-assets/blooddonation/BD7.jpg", alt: "Blood Donation 7" },
    { src: "/assets/gallery-assets/blooddonation/BD8.jpg", alt: "Blood Donation 8" },
    { src: "/assets/gallery-assets/blooddonation/BD9.jpg", alt: "Blood Donation 9" },
  ];

  const galaRemastered2025 = [
    { src: "/assets/gallery-assets/texus25-gala-remastered/gala-1.png", alt: "Gala 1" },
    { src: "/assets/gallery-assets/texus25-gala-remastered/gala-2.png", alt: "Gala 2" },
    { src: "/assets/gallery-assets/texus25-gala-remastered/gala-3.jpg", alt: "Gala 3" },
    { src: "/assets/gallery-assets/texus25-gala-remastered/gala-4.png", alt: "Gala 4" },
    { src: "/assets/gallery-assets/texus25-gala-remastered/gala-5.png", alt: "Gala 5" },
    { src: "/assets/gallery-assets/texus25-gala-remastered/gala-6.jpg", alt: "Gala 6" },
  ];

  const flashmob2025 = [
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(1).JPG", alt: "Flashmob 1" },
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(2).JPG", alt: "Flashmob 2" },
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(3).JPG", alt: "Flashmob 3" },
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(4).JPG", alt: "Flashmob 4" },
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(5).JPG", alt: "Flashmob 5" },
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(6).JPG", alt: "Flashmob 6" },
    { src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(7).JPG", alt: "Flashmob 7" },
  ];

  const hackathonImages2024 = [
    { src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (1).jpeg", alt: "2024 Hackathon 1" },
    { src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (2).jpeg", alt: "2024 Hackathon 2" },
    { src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (3).jpeg", alt: "2024 Hackathon 3" },
    { src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (4).jpeg", alt: "2024 Hackathon 4" },
    { src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (5).jpeg", alt: "2024 Hackathon 5" },
    { src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (6).jpeg", alt: "2024 Hackathon 6" },
  ];

  const galaImages2024 = [
    { src: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala (1).jpeg", alt: "2024 Gala 1" },
    { src: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala (2).jpeg", alt: "2024 Gala 2" },
    { src: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala (3).jpeg", alt: "2024 Gala 3" },
    { src: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala (4).jpeg", alt: "2024 Gala 4" },
  ];

  // Combine all 2025 images into one array
  const allImages2025 = [
    ...hackathon2025,
    ...bloodDonation2025,
    ...galaRemastered2025,
    ...flashmob2025,
  ];

  // Combine all 2024 images into one array
  const allImages2024 = [
    ...hackathonImages2024,
    ...galaImages2024,
  ];

  // Generate 2023 images array
  const texus2023 = Array.from({ length: 20 }, (_, i) => ({
    src: `/assets/gallery-assets/texus-2k23/texus-2k23 (${i + 1}).jpg`,
    alt: `TEXUS 2023 ${i + 1}`,
  }));

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      <PaperBase />
      <Vignette />

      {/* Floating doodles background */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 rounded-full"
            style={{
              background: PAPER.accent,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              border: `2px solid ${PAPER.ink}`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 sm:pt-28 md:pt-32 pb-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-6"
            style={{
              fontFamily: headingFont,
              color: PAPER.ink,
              letterSpacing: "0.06em",
              textShadow: "3px 3px 0 rgba(14,42,68,0.15)",
            }}
          >
            Memory Scrapbook
          </h1>
          <div className="flex justify-center mb-6">
            <DoodleLine />
          </div>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{
              fontFamily: bodyFont,
              color: "rgba(18,56,89,0.85)",
            }}
          >
            Moments captured, memories preserved—flipping through the pages of TEXUS history
          </p>
        </motion.div>

        {/* TEXUS 2025 - All Events */}
        <section className="mb-32">
          <SectionHeader
            title="TEXUS 2025"
            subtitle="Innovation, community, and unforgettable moments from our latest edition"
            badgeText="2025"
          />
          <div className="flex flex-wrap justify-center gap-8">
            {allImages2025.map((image, index) => (
              <div key={index} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]">
                <PolaroidCard
                  src={image.src}
                  alt={image.alt}
                  rotate={getRandomRotation(index)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* TEXUS 2024 - All Events */}
        <section className="mb-32">
          <SectionHeader
            title="TEXUS 2024"
            subtitle="Where innovation meets code—celebrating last year's achievements"
            badgeText="2024"
          />
          <div className="flex flex-wrap justify-center gap-8">
            {allImages2024.map((image, index) => (
              <div key={index} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]">
                <PolaroidCard
                  src={image.src}
                  alt={image.alt}
                  rotate={getRandomRotation(index)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* TEXUS 2023 - All Events */}
        <section className="mb-20">
          <SectionHeader
            title="TEXUS 2023"
            subtitle="Where it all began—celebrating the legacy of innovation and community"
            badgeText="2023"
          />
          <div className="flex flex-wrap justify-center gap-6">
            {texus2023.map((image, index) => (
              <div key={index} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
                <PolaroidCard
                  src={image.src}
                  alt={image.alt}
                  rotate={getRandomRotation(index)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}