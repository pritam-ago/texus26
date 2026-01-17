"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Currentsponsor from "@/components/currentsponsor";
import { FaStar, FaMedal } from "react-icons/fa";
import { AiFillTrophy } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { useInView } from "framer-motion";
import { useRef } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css"; // You can also use <link> for styles

// Add these type definitions at the top of the file
interface Sponsor {
  id: number;
  logo: string;
  link: string;
}

interface SponsorSectionProps {
  year: string;
  description: string;
  sponsors: Sponsor[];
  color: "gold" | "silver" | "blue";
  iconColor: string;
}

// Reusable SponsorSection component
const SponsorSection = ({
  year,
  description,
  sponsors,
  color,

  iconColor,
}: SponsorSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const gradientColors = {
    gold: "from-amber-700/30 via-amber-600/20 to-transparent border-amber-600/30",
    silver:
      "from-slate-600/30 via-slate-500/20 to-transparent border-slate-500/30",
    blue: "from-indigo-700/30 via-indigo-600/20 to-transparent border-indigo-600/30",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className={`mb-24 rounded-2xl border bg-gradient-to-r ${gradientColors[color]} p-8 relative overflow-hidden w-full max-w-7xl shadow-lg`}
    >
      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 w-64 h-64 opacity-10 blur-3xl rounded-full bg-white"></div>
      <div className="absolute -left-20 -bottom-20 w-48 h-48 opacity-5 blur-3xl rounded-full bg-white"></div>

      <div className="text-center mb-10 relative">
        <motion.div
          className="flex items-center justify-center mb-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className={`text-3xl font-bangers tracking-wide ${iconColor}`}>
            {year} <span className="font-mont font-medium">Sponsors</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: "6rem" } : { width: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-4"
        ></motion.div>

        <motion.p
          className="text-gray-400 max-w-2xl mx-auto font-montserrat font-light leading-relaxed"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {description}
        </motion.p>
      </div>

      <motion.div
        className="flex flex-wrap justify-center items-center gap-8 px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {sponsors.map((sponsor: Sponsor) => (
          <motion.div
            key={sponsor.id}
            variants={itemVariants}
            className={`bg-black/50 backdrop-blur-sm rounded-xl border border-${
              color === "gold" ? "yellow" : color === "silver" ? "gray" : "blue"
            }-500/40 shadow-lg p-4 flex items-center justify-center w-48 transition-all duration-300`}
            style={{ height: 140 }}
          >
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <Image
                src={sponsor.logo}
                alt={`Sponsor ${sponsor.id}`}
                width={160}
                height={160}
                loading="lazy"
                className="object-contain max-w-full max-h-full"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const Sponsors = () => {
  const pageRef = useRef(null);
  const isPageInView = useInView(pageRef, { once: true });

  // Your sponsor data
  const sponsor2019 = [
    { id: 1, logo: "/assets/sponsor/image8.png", link: "#" },
    { id: 2, logo: "/assets/sponsor/image7.png", link: "#" },
    { id: 3, logo: "/assets/sponsor/image6.png", link: "#" },
    { id: 4, logo: "/assets/sponsor/image5.png", link: "#" },
    { id: 5, logo: "/assets/sponsor/image4.png", link: "#" },
    { id: 6, logo: "/assets/sponsor/image2.png", link: "#" },
    { id: 7, logo: "/assets/sponsor/image3.png", link: "#" },
  ];

  const sponsor2023 = [
    { id: 2, logo: "/assets/sponsor/image24.png", link: "#" },
    { id: 3, logo: "/assets/sponsor/image22.png", link: "#" },
    { id: 4, logo: "/assets/sponsor/image23.png", link: "#" },
    { id: 5, logo: "/assets/sponsor/image13.png", link: "#" },
    { id: 6, logo: "/assets/sponsor/image12.png", link: "#" },
    { id: 7, logo: "/assets/sponsor/image11.png", link: "#" },
    { id: 8, logo: "/assets/sponsor/image10.png", link: "#" },
    { id: 9, logo: "/assets/sponsor/image9.png", link: "#" },
  ];

  const sponsor2024 = [
    { id: 1, logo: "/assets/sponsor/gsl1.jpg", link: "#" },
    { id: 2, logo: "/assets/sponsor/gsl01.png", link: "#" },
    { id: 3, logo: "/assets/sponsor/gsl02.png", link: "#" },
    { id: 4, logo: "/assets/sponsor/gsl03.png", link: "#" },
    { id: 5, logo: "/assets/sponsor/gsl04.png", link: "#" },
    { id: 6, logo: "/assets/sponsor/gsl05.svg", link: "#" },
    { id: 7, logo: "/assets/sponsor/gsl06.png", link: "#" },
    { id: 8, logo: "/assets/sponsor/gsl07.jpg", link: "#" },
    { id: 9, logo: "/assets/sponsor/gsl08.png", link: "#" },
    { id: 10, logo: "/assets/sponsor/gsl09.jpg", link: "#" },
    { id: 11, logo: "/assets/sponsor/gsl10.png", link: "#" },
    { id: 12, logo: "/assets/sponsor/gsl11.jpg", link: "#" },
    { id: 13, logo: "/assets/sponsor/gsl12.png", link: "#" },
    { id: 14, logo: "/assets/sponsor/gsl13.svg", link: "#" },
    { id: 15, logo: "/assets/sponsor/gsl14.png", link: "#" },
    { id: 16, logo: "/assets/sponsor/gsl15.png", link: "#" },
    { id: 17, logo: "/assets/sponsor/gsl16.png", link: "#" },
    { id: 18, logo: "/assets/sponsor/gsl17.png", link: "#" },
    { id: 19, logo: "/assets/sponsor/gsl18.png", link: "#" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto relative bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 my-16 relative z-10 overflow-hidden">
        <motion.div
          ref={pageRef}
          className="flex flex-col items-center min-h-screen w-full overflow-hidden pt-16 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          {/* Current Sponsors */}
          <Currentsponsor />

          <motion.h1
            className="text-4xl md:text-5xl text-white mb-6 tracking-tight leading-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isPageInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-bangers tracking-wider">Previous</span>{" "}
            <span className="font-bangers font-bold text-amber-500">
              Sponsors
            </span>
          </motion.h1>

          {/* 2024 Sponsors */}
          <SponsorSection
            year="2024"
            description="Our valued partners who made TEXUS 2024 an incredible success"
            sponsors={sponsor2024}
            color="gold"
            iconColor="text-amber-500"
          />

          {/* 2023 Sponsors */}
          <SponsorSection
            year="2023"
            description="Key supporters who brought excellence to TEXUS 2023"
            sponsors={sponsor2023}
            color="silver"
            iconColor="text-slate-300"
          />

          {/* 2019 Sponsors */}
          <SponsorSection
            year="2019"
            description="Valued collaborators who made TEXUS 2019 possible"
            sponsors={sponsor2019}
            color="blue"
            iconColor="text-indigo-400"
          />

          {/* Call to action */}
          <motion.div
            className="mt-16 text-center max-w-2xl mx-auto p-8 rounded-lg border border-amber-600/20 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isPageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bangers text-white mb-4 tracking-wide">
              Become a Sponsor
            </h3>
            <p className="text-gray-300 mb-6 font-montserrat font-light leading-relaxed">
              Join our community of supporters and gain visibility for your
              brand at one of the most anticipated technical events.
            </p>
            <a
              href="#"
              className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 text-white font-mont font-medium py-3 px-8 rounded-full hover:shadow-lg hover:shadow-amber-600/20 transition-all duration-300 transform hover:-translate-y-1 tracking-wide"
            >
              Contact Us
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sponsors;
