"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  PaperCard,
  PaperHeading,
  PaperText,
  PaperButton,
  PAPER,
} from "./PaperComponents";
import { FaCode, FaPalette, FaTools, FaLaptopCode, FaTint, FaBook, FaSeedling } from "react-icons/fa";

// Add type definitions
interface EventCardProps {
  title: string;
  description: string | React.ReactNode;
  color: string;
  buttonText: string;
  buttonLink: string;
  isExternal?: boolean;
  disabled?: boolean;
  index: number;
  featured?: boolean;
  icon?: React.ReactNode;
  thumbnail?: string;
  compact?: boolean;
}

// Card component for grid layout with paper theme
const EventCard = ({
  title,
  description,
  color,
  buttonText,
  buttonLink,
  isExternal = false,
  disabled = false,
  index,
  featured = false,
  icon,
  thumbnail,
  compact = false,
}: EventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -8, 
        rotate: featured ? -1 : -0.5,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="h-full group"
    >
      <div
        className={`h-full flex flex-col relative rounded-2xl ${
          featured ? 'md:row-span-2' : ''
        }`}
        style={{
          background: `${PAPER.bg} url('/textures/paper.png')`,
          backgroundRepeat: "repeat",
          border: `4px solid ${PAPER.ink}`,
          boxShadow: `8px 8px 0 ${PAPER.shadow}`,
          transition: "all 0.3s ease",
          maxHeight: compact ? '300px' : 'none',
          overflow: 'visible',
        }}
      >
        {/* Decorative corner fold */}
        <div 
          className="absolute top-0 right-0 w-16 h-16 overflow-hidden z-10"
          style={{ 
            filter: 'brightness(0.95)',
          }}
        >
          <div 
            className="absolute transform rotate-45 translate-x-8 -translate-y-8"
            style={{
              width: '100px',
              height: '100px',
              background: PAPER.accent,
              border: `2px solid ${PAPER.ink}`,
              opacity: 0.3,
            }}
          />
        </div>

        {/* Tape decoration */}
        <img
          src="/textures/tape.png"
          alt="tape"
          className="absolute -top-3 left-8 w-20 h-auto transform -rotate-3 z-30 opacity-80"
        />

        {/* Thumbnail Image */}
        {thumbnail && (
          <div className={`relative w-full ${featured ? 'h-48 md:h-64' : 'h-40'} rounded-t-2xl overflow-hidden`}>
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              style={{
                filter: 'brightness(0.9) contrast(1.1)',
              }}
            />
            {/* Overlay gradient */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(242,242,242,0) 0%, rgba(242,242,242,0.8) 100%)',
              }}
            />
          </div>
        )}
        
        <div className={`${compact ? 'p-4' : 'p-6'} ${featured ? 'md:p-8' : ''} flex flex-col flex-grow relative z-[1]`}>
          {/* Icon and Badge */}
          <div className="flex items-start justify-between mb-3">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-md"
              style={{
                backgroundColor: PAPER.accent,
                border: `3px solid ${PAPER.ink}`,
                boxShadow: `4px 4px 0 ${PAPER.shadow}`,
                color: PAPER.ink,
                fontSize: compact ? '0.75rem' : featured ? '1rem' : '0.875rem',
              }}
            >
              {icon && <span className={compact ? 'text-base' : 'text-lg'}>{icon}</span>}
              {title}
            </div>
          </div>

          {/* Description */}
          <div 
            className={`flex-grow ${compact ? 'mb-3' : 'mb-6'} ${compact ? 'text-xs' : featured ? 'text-base md:text-lg' : 'text-sm'}`}
            style={{
              fontFamily: "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)",
              color: PAPER.ink,
              opacity: 0.85,
              lineHeight: '1.6',
            }}
          >
            {description}
          </div>

          {/* Button */}
          {disabled ? (
            <button
              disabled={true}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-extrabold opacity-50 cursor-not-allowed transform transition-all"
              style={{
                background: PAPER.lightAccent,
                color: PAPER.ink,
                border: `3px solid ${PAPER.ink}`,
                boxShadow: `4px 4px 0 ${PAPER.shadow}`,
                fontFamily: "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)",
                width: 'fit-content',
              }}
            >
              {buttonText}
            </button>
          ) : isExternal ? (
            <Link href={buttonLink} target="_blank">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98, y: 0 }}
                className={`inline-flex items-center justify-center gap-2 ${compact ? 'px-4 py-2 text-sm' : 'px-6 py-3'} rounded-xl font-extrabold transform transition-all`}
                style={{
                  background: PAPER.lightAccent,
                  color: PAPER.ink,
                  border: `3px solid ${PAPER.ink}`,
                  boxShadow: `5px 5px 0 ${PAPER.shadow}`,
                  fontFamily: "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)",
                  width: 'fit-content',
                }}
              >
                {buttonText}
                <span className="text-lg">→</span>
              </motion.button>
            </Link>
          ) : (
            <Link href={buttonLink}>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98, y: 0 }}
                className={`inline-flex items-center justify-center gap-2 ${compact ? 'px-4 py-2 text-sm' : 'px-6 py-3'} rounded-xl font-extrabold transform transition-all`}
                style={{
                  background: PAPER.lightAccent,
                  color: PAPER.ink,
                  border: `3px solid ${PAPER.ink}`,
                  boxShadow: `5px 5px 0 ${PAPER.shadow}`,
                  fontFamily: "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)",
                  width: 'fit-content',
                }}
              >
                {buttonText}
                <span className="text-lg">→</span>
              </motion.button>
            </Link>
          )}
        </div>

        {/* Background doodle pattern */}
        <div 
          className="absolute bottom-0 right-0 w-32 h-32 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${PAPER.ink} 1px, transparent 1px)`,
            backgroundSize: '12px 12px',
          }}
        />
      </div>
    </motion.div>
  );
};

// Define Event interface
interface Event {
  id: string;
  title: string;
  shortDescription: string;
  color: string;
  buttonText: string;
  buttonLink: string;
  isExternal?: boolean;
  disabled?: boolean;
  featured: boolean;
}

// Category tabs with grid layout
export default function Eventdata() {
  // Define events data with paper theme colors
  const events: Event[] = [
    {
      id: "technical",
      title: "TECHNICAL EVENTS",
      shortDescription:
        "Experience 40+ exhilarating tech events at Texus Fest!",
      color: PAPER.purple,
      buttonText: "Explore Now",
      buttonLink: "/events/technical",
      disabled: false,
      featured: true,
    },
    {
      id: "non-technical",
      title: "NON TECHNICAL EVENTS",
      shortDescription:
        "Embark on a journey of creativity with 15+ non-technical events!",
      color: "#E1DB90",
      buttonText: "Explore Now",
      buttonLink: "/events/nontechnical",
      disabled: false,
      featured: true,
    },
    {
      id: "workshops",
      title: "WORKSHOPS",
      shortDescription:
        "Enhance your skills with 7+ expert-led workshops designed for hands-on learning.",
      color: "#3B82F6",
      buttonText: "Explore Now",
      buttonLink: "/events/workshop",
      disabled: false,
      featured: false,
    },
    {
      id: "hackathon",
      title: "HACKATHON",
      shortDescription:
        "Join HackVerse for a 24-hour in-person hackathon embracing Web3 innovation.",
      color: "#F97316",
      buttonText: "Explore Now",
      buttonLink: "/events/hackathon",
      disabled: false,
      featured: false,
    },
    {
      id: "souvenir",
      title: "SOUVENIR",
      shortDescription:
        "Celebrate the spirit of TEXUS '26 with a collection of memories and creativity.",
      color: PAPER.pink,
      buttonText: "Register Now",
      buttonLink:
        "https://docs.google.com/forms/d/e/1FAIpQLSc22ZwNER2sL7r51h2vx7gC86HiI6j4Sxx2gUNpnrK5uRgybg/viewform",
      isExternal: true,
      featured: false,
      disabled: false,
    },
    {
      id: "blood-donation",
      title: "BLOOD DONATION CAMP",
      shortDescription:
        "Make a difference by donating blood and helping those in need.",
      color: "#DC2626",
      buttonText: "Register Now",
      buttonLink:
        "https://docs.google.com/forms/d/e/1FAIpQLSc_xLDfYSDpkS6bpMiCqn4rlmOEXcH79L-76Lqco18oaDaTJQ/viewform?pli=1",
      isExternal: true,
      featured: false,
      disabled: false,
    },
    {
      id: "go-greener",
      title: "GO GREENER",
      shortDescription:
        "Experience our eco-friendly initiative to create a sustainable future for our planet.",
      color: PAPER.green,
      buttonText: "Learn More",
      buttonLink: "https://gogreener.texus.io",
      featured: false,
      disabled: false,
    },
  ];

  // Organize events by category for specific layout
  const technicalEvent = events.find((event) => event.id === "technical");
  const nonTechnicalEvent = events.find(
    (event) => event.id === "non-technical"
  );
  const workshopEvent = events.find((event) => event.id === "workshops");
  const hackathonEvent = events.find((event) => event.id === "hackathon");
  const bloodDonationEvent = events.find(
    (event) => event.id === "blood-donation"
  );
  const souvenirEvent = events.find((event) => event.id === "souvenir");
  const goGreenerEvent = events.find((event) => event.id === "go-greener");

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Header */}
      <motion.div
        className="flex flex-col items-center justify-center w-full mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-center font-extrabold text-5xl md:text-7xl mb-4"
          style={{
            color: PAPER.ink,
            WebkitTextStroke: `2px ${PAPER.ink}`,
            fontFamily: "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', 'Kalam', ui-rounded, system-ui)",
            textShadow: "4px 4px 0 rgba(18, 89, 15, 0.2)",
          }}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          EVENTS
        </motion.h1>
        
        {/* Decorative underline */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            height: "6px",
            background: PAPER.accent,
            border: `2px solid ${PAPER.ink}`,
            boxShadow: `3px 3px 0 ${PAPER.shadow}`,
            borderRadius: "9999px",
            marginBottom: "1rem",
          }}
        />

        <p
          className="text-sm md:text-lg text-center max-w-2xl mx-auto leading-relaxed"
          style={{
            color: PAPER.ink,
            opacity: 0.85,
            fontFamily: "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)",
          }}
        >
          Experience 60+ exhilarating events at Texus Fest!
          <br />
          From workshops to coding challenges and much more
        </p>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {/* Technical - Larger but not spanning 2 rows */}
        {technicalEvent && (
          <div className="md:col-span-2">
            <EventCard
              key="technical"
              index={0}
              title={technicalEvent.title}
              description={technicalEvent.shortDescription}
              color={technicalEvent.color}
              buttonText={technicalEvent.buttonText}
              buttonLink={technicalEvent.buttonLink}
              isExternal={technicalEvent.isExternal}
              disabled={technicalEvent.disabled}
              featured={true}
              icon={<FaCode />}
              thumbnail="/events-thumbnail/technical.jpg"
            />
          </div>
        )}

        {/* Non-Technical */}
        {nonTechnicalEvent && (
          <EventCard
            key="non-technical"
            index={1}
            title={nonTechnicalEvent.title}
            description={nonTechnicalEvent.shortDescription}
            color={nonTechnicalEvent.color}
            buttonText={nonTechnicalEvent.buttonText}
            buttonLink={nonTechnicalEvent.buttonLink}
            isExternal={nonTechnicalEvent.isExternal}
            disabled={nonTechnicalEvent.disabled}
            icon={<FaPalette />}
            thumbnail="/events-thumbnail/non-technical.jpg"
          />
        )}

        {/* Workshops */}
        {workshopEvent && (
          <EventCard
            key="workshops"
            index={2}
            title={workshopEvent.title}
            description={workshopEvent.shortDescription}
            color={workshopEvent.color}
            buttonText={workshopEvent.buttonText}
            buttonLink={workshopEvent.buttonLink}
            isExternal={workshopEvent.isExternal}
            disabled={workshopEvent.disabled}
            icon={<FaTools />}
            thumbnail="/events-thumbnail/workshop.jpg"
          />
        )}

        {/* Hackathon */}
        {hackathonEvent && (
          <EventCard
            key="hackathon"
            index={3}
            title={hackathonEvent.title}
            description={hackathonEvent.shortDescription}
            color={hackathonEvent.color}
            buttonText={hackathonEvent.buttonText}
            buttonLink={hackathonEvent.buttonLink}
            isExternal={hackathonEvent.isExternal}
            disabled={hackathonEvent.disabled}
            icon={<FaLaptopCode />}
            thumbnail="/events-thumbnail/hackathon.jpg"
          />
        )}

        {/* Blood Donation */}
        {bloodDonationEvent && (
          <EventCard
            key="blood-donation"
            index={4}
            title={bloodDonationEvent.title}
            description={bloodDonationEvent.shortDescription}
            color={bloodDonationEvent.color}
            buttonText={bloodDonationEvent.buttonText}
            buttonLink={bloodDonationEvent.buttonLink}
            isExternal={bloodDonationEvent.isExternal}
            disabled={bloodDonationEvent.disabled}
            icon={<FaTint />}
            thumbnail="/events-thumbnail/blood-donation.jpg"
          />
        )}

        {/* Souvenir - No thumbnail */}
        {souvenirEvent && (
          <EventCard
            key="souvenir"
            index={5}
            title={souvenirEvent.title}
            description={souvenirEvent.shortDescription}
            color={souvenirEvent.color}
            buttonText={souvenirEvent.buttonText}
            buttonLink={souvenirEvent.buttonLink}
            isExternal={souvenirEvent.isExternal}
            disabled={souvenirEvent.disabled}
            icon={<FaBook />}
            compact={true}
          />
        )}

        {/* Go Greener - No thumbnail */}
        {goGreenerEvent && (
          <EventCard
            key="go-greener"
            index={6}
            title={goGreenerEvent.title}
            description={goGreenerEvent.shortDescription}
            color={goGreenerEvent.color}
            buttonText={goGreenerEvent.buttonText}
            buttonLink={goGreenerEvent.buttonLink}
            isExternal={goGreenerEvent.isExternal}
            disabled={goGreenerEvent.disabled}
            icon={<FaSeedling />}
            compact={true}
          />
        )}
      </div>
    </div>
  );
}
