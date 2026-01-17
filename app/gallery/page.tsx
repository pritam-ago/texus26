"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Meteors } from "@/components/ui/Meteors";
import { BentoGrid, BentoGridItem } from "./bento-grid";
import { ParallaxScroll } from "./parallax-scroll";
import Particles from "./particles";

interface LenisOptions {
  duration: number;
  easing: (t: number) => number;
  direction: "vertical" | "horizontal";
  gestureDirection: "vertical" | "horizontal" | "both";
  smooth: boolean;
  mouseMultiplier: number;
  smoothTouch: boolean;
  touchMultiplier: number;
  infinite: boolean;
}

interface WindowWithLenis extends Window {
  Lenis: new (options: LenisOptions) => {
    raf: (time: number) => void;
    destroy: () => void;
  };
}

type LenisInstance = InstanceType<WindowWithLenis["Lenis"]>;

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="mb-0 md:mb-20"
    >
      {children}
    </motion.section>
  );
}

// Add proper type for Lenis
interface LenisType {
  raf: (time: number) => void;
  destroy: () => void;
}

const Gallery = () => {
  const arr = [];
  for (let i = 1; i <= 57; i++) {
    arr.push(`/assets/gallery-assets/texus-2k23/texus-2k23 (${i}).jpg`);
  }
  const hackathonImages = [
    {
      src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (1).jpeg",
      alt: "Gallery Image 1",
    },
    {
      src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (2).jpeg",
      alt: "Gallery Image 2",
    },
    {
      src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (3).jpeg",
      alt: "Gallery Image 3",
    },
    {
      src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (4).jpeg",
      alt: "Gallery Image 4",
    },
    {
      src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (5).jpeg",
      alt: "Gallery Image 5",
    },
    {
      src: "/assets/gallery-assets/texus-2k24-hackathon/texus-2k24-hackathon (6).jpeg",
      alt: "Gallery Image 6",
    },
  ];

  const galaImages = [
    {
      src: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala (1).jpeg",
      alt: "Gallery Image 1",
    },
    {
      src: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala (2).jpeg",
      alt: "Gallery Image 2",
    },
    {
      src: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala (3).jpeg",
      alt: "Gallery Image 3",
    },
    {
      src: "/assets/gallery-assets/texus-2k24-gala/texus-2k24-gala (4).jpeg",
      alt: "Gallery Image 4",
    },
  ];

  const bloodDonation2025 = [
    {
      src: "/assets/gallery-assets/blooddonation/BD1.jpg",
      alt: "Gallery Image 1",
    },
    {
      src: "/assets/gallery-assets/blooddonation/BD2.jpg",
      alt: "Gallery Image 2",
    },
    {
      src: "/assets/gallery-assets/blooddonation/BD3.jpg",
      alt: "Gallery Image 3",
    },
    {
      src: "/assets/gallery-assets/blooddonation/BD4.jpg",
      alt: "Gallery Image 4",
    },
    {
      src: "/assets/gallery-assets/blooddonation/BD5.jpg",
      alt: "Gallery Image 5",
    },
    {
      src: "/assets/gallery-assets/blooddonation/BD6.jpg",
      alt: "Gallery Image 6",
    },
    {
      src: "/assets/gallery-assets/blooddonation/BD7.jpg",
      alt: "Gallery Image 7",
    },
    {
      src: "/assets/gallery-assets/blooddonation/BD8.jpg",
      alt: "Gallery Image 8",
    },
    {
      src: "/assets/gallery-assets/blooddonation/BD9.jpg",
      alt: "Gallery Image 9",
    },
  ];

  const walkathon2025 = [
    {
      src: "/assets/gallery-assets/walkathon/walkathon1.jpg",
      alt: "Walkathon Image 1",
    },
    {
      src: "/assets/gallery-assets/walkathon/walkathon2.jpg",
      alt: "Walkathon Image 2",
    },
    {
      src: "/assets/gallery-assets/walkathon/walkathon3.jpg",
      alt: "Walkathon Image 3",
    },
    {
      src: "/assets/gallery-assets/walkathon/walkathon4.jpg",
      alt: "Walkathon Image 4",
    },
    {
      src: "/assets/gallery-assets/walkathon/walkathon5.jpg",
      alt: "Walkathon Image 5",
    },
    {
      src: "/assets/gallery-assets/walkathon/walkathon6.jpg",
      alt: "Walkathon Image 6",
    },
    {
      src: "/assets/gallery-assets/walkathon/walkathon7.jpg",
      alt: "Walkathon Image 7",
    },
    {
      src: "/assets/gallery-assets/walkathon/walkathon8.jpg",
      alt: "Walkathon Image 8",
    },
    {
      src: "/assets/gallery-assets/walkathon/walkathon9.jpg",
      alt: "Walkathon Image 9",
    },
  ];

  const hackathon2025 = [
    {
      src: "/assets/gallery-hackathon/hackathon1.jpg",
      alt: "Hackathon Image 1",
    },
    {
      src: "/assets/gallery-hackathon/hackathon2.jpg",
      alt: "Hackathon Image 2",
    },
    {
      src: "/assets/gallery-hackathon/hackathon7.jpg",
      alt: "Hackathon Image 3",
    },
    {
      src: "/assets/gallery-hackathon/hackathon4.jpg",
      alt: "Hackathon Image 4",
    },
    {
      src: "/assets/gallery-hackathon/hackathon5.jpg",
      alt: "Hackathon Image 5",
    },
    {
      src: "/assets/gallery-hackathon/hackathon6.jpg",
      alt: "Hackathon Image 6",
    },
    {
      src: "/assets/gallery-hackathon/hackathon3.jpg",
      alt: "Hackathon Image 7",
    },
    {
      src: "/assets/gallery-hackathon/hackathon8.jpg",
      alt: "Hackathon Image 8",
    },
    {
      src: "/assets/gallery-hackathon/hackathon9.jpg",
      alt: "Hackathon Image 9",
    },
  ];

  const galaRemastered2025 = [
    {
      src: "/assets/gallery-assets/texus25-gala-remastered/gala-1.png",
      alt: "Gala Remastered Image 1",
    },
    {
      src: "/assets/gallery-assets/texus25-gala-remastered/gala-2.png",
      alt: "Gala Remastered Image 2",
    },
    {
      src: "/assets/gallery-assets/texus25-gala-remastered/gala-3.jpg",
      alt: "Gala Remastered Image 3",
    },
    {
      src: "/assets/gallery-assets/texus25-gala-remastered/gala-4.png",
      alt: "Gala Remastered Image 4",
    },
    {
      src: "/assets/gallery-assets/texus25-gala-remastered/gala-5.png",
      alt: "Gala Remastered Image 5",
    },
    {
      src: "/assets/gallery-assets/texus25-gala-remastered/gala-6.jpg",
      alt: "Gala Remastered Image 6",
    },
  ];

  const flashmob2025 = [
    {
      src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(1).JPG",
      alt: "Flashmob Image 1",
    },
    {
      src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(2).JPG",
      alt: "Flashmob Image 2",
    },
    {
      src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(3).JPG",
      alt: "Flashmob Image 3",
    },
    {
      src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(4).JPG",
      alt: "Flashmob Image 4",
    },
    {
      src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(5).JPG",
      alt: "Flashmob Image 5",
    },
    {
      src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(6).JPG",
      alt: "Flashmob Image 6",
    },
    {
      src: "/assets/gallery-assets/texus25-flashmob1/flashmob1(7).JPG",
      alt: "Flashmob Image 7",
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden overflow-y-auto relative">
      {/* Add Meteors */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.2}
          particleBaseSize={150}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
        {/* <CosmicNebula /> */}
      </div>

      <div className="relative z-10">
        {/* Add z-10 to keep content above meteors */}
        {/* Hero Section */}
        <AnimatedSection>
          <div className="relative pt-28 md:pb-16">
            <div className="relative flex justify-center items-center">
              {/* Background Text (Pink) */}
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: -6, x: -7, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute text-4xl md:text-8xl font-thuast text-center text-[#DB17D8]"
              >
                Gallery
              </motion.h1>

              {/* Foreground Text (White) */}
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-8xl font-thuast text-center text-white relative"
              >
                Gallery
              </motion.h1>
            </div>
          </div>
        </AnimatedSection>
        {/* Hackathon 2025 Secrion */}
        <AnimatedSection>
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white text-center font-thuast text-xl md:text-5xl mt-10"
          >
            TEXUS 2025 HACKATHON
          </motion.h3>
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white text-center font-bold font-montserrat md:text-3xl mt-10"
          >
            &quot;Code your ideas, create the future, conquer challenges, and
            innovate endlessly!&quot;
          </motion.h3>
        </AnimatedSection>
        {/* Gallery Grid for walkathon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full px-4 pb-20"
        >
          <AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathon2025.map((image, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="relative aspect-square overflow-hidden rounded-lg"
                  key={index}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </motion.div>
        {/* Hackathon 2025 Secrion */}

        {/* Walkathon 2025 Section */}
        <AnimatedSection>
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white text-center font-thuast text-xl md:text-5xl mt-10"
          >
            TEXUS 2025 WALKATHON
          </motion.h3>
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white text-center font-bold font-montserrat md:text-3xl mt-10"
          >
            &quot;Steps of solidarity, miles of purpose—students walk together
            for a common cause&quot;
          </motion.h3>
        </AnimatedSection>
        {/* Gallery Grid for walkathon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full px-4 pb-20"
        >
          <AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {walkathon2025.map((image, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="relative aspect-square overflow-hidden rounded-lg"
                  key={index}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </motion.div>
        {/* Walkathon 2025 Section */}
        <AnimatedSection>
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white text-center font-thuast text-xl md:text-5xl mt-10"
          >
            TEXUS 2025 BLOOD DONATION CAMPAIGN
          </motion.h3>
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white text-center font-bold font-montserrat md:text-3xl mt-10"
          >
            &quot;A drop of blood, a moment of hope&quot;
          </motion.h3>
        </AnimatedSection>
        {/* Gallery Grid for walkathon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full px-4 pb-20"
        >
          <AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bloodDonation2025.map((image, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="relative aspect-square overflow-hidden rounded-lg"
                  key={index}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </motion.div>
        {/* Gallery Grid for galaRemastered2025 */}
        <div className="flex flex-col gap-y-4 justify-center items-center w-full">
          <AnimatedSection>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-white text-center font-thuast text-xl md:text-5xl mt-10"
            >
              TEXUS 2025 GALA REMASTERED
            </motion.h3>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-white text-center font-bold font-montserrat  md:text-3xl mt-10"
            >
              &quot;When students come together, magic happens.&quot;
            </motion.h3>
          </AnimatedSection>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full px-4 pb-20"
          >
            <AnimatedSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galaRemastered2025.map((image, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="relative aspect-square overflow-hidden rounded-lg"
                    key={index}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </motion.div>
          {/* Existing flashmob2025 section */}
          <AnimatedSection>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-white text-center font-thuast text-xl md:text-5xl mt-10"
            >
              TEXUS 2025 LAUNCH
            </motion.h3>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-white text-center font-bold font-montserrat  md:text-3xl mt-10"
            >
              &quot;Where rhythm meets unity—students come together to create
              unforgettable moments&quot;
            </motion.h3>
          </AnimatedSection>
          {/* Gallery Grid for flashmob2025 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full px-4 pb-20"
          >
            <AnimatedSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashmob2025.map((image, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="relative aspect-square overflow-hidden rounded-lg"
                    key={index}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </motion.div>
        </div>
        <AnimatedSection>
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white text-center font-thuast text-xl md:text-5xl mt-10"
          >
            TEXUS 2K24 hackathon
          </motion.h3>
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            // animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white text-center font-bold font-montserrat  md:text-3xl mt-10"
          >
            &quot;Where innovation meets code—teams collaborate, compete, and
            create solutions that shape the future&quot;
          </motion.h3>
        </AnimatedSection>
        {/* Gallery Grid */}
        <div className="flex flex-col gap-y-4 justify-center items-center w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full px-4 pb-20"
          >
            <AnimatedSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackathonImages.map((image, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="relative aspect-square overflow-hidden rounded-lg"
                    key={index}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </motion.div>
          <AnimatedSection>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              // animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-white text-center font-thuast text-3xl md:text-6xl mt-10"
            >
              TEXUS 2K24 Gala
            </motion.h3>
          </AnimatedSection>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="container mx-auto px-4 pb-20"
          >
            <AnimatedSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galaImages.map((val, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-lg bg-transparent border-none ${
                      index % 7 === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative aspect-square"
                    >
                      <Image
                        src={val.src}
                        alt={val.alt}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                        loading="lazy"
                      />
                    </motion.div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </motion.div>
          <AnimatedSection>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              // animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-white text-center font-thuast text-4xl md:text-6xl mt-10"
            >
              TEXUS 2K23
            </motion.h3>
          </AnimatedSection>
          <div className="w-full scrollbar-hide">
            <ParallaxScroll
              images={arr}
              className="scrollbar-hide overflow-x-hidden"
            />
            {/* <div style={{ height: "600px", position: "relative" }}>
              <CircularGallery
                items={arr}
                bend={3}
                textColor="#ffffff"
                borderRadius={0.05}
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
