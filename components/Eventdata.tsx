"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PaperCard,
  PaperHeading,
  PaperText,
  PaperButton,
  PAPER,
} from "./PaperComponents";

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
}: EventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <PaperCard className="h-full flex flex-col" withTape={true} withTrees={false}>
        <div className="flex-grow flex flex-col">
          <div
            className="inline-block px-3 py-1.5 mb-3 rounded-full text-sm font-bold"
            style={{
              backgroundColor: PAPER.accent,
              border: `2px solid ${PAPER.ink}`,
              boxShadow: `3px 3px 0 ${PAPER.shadow}`,
              color: PAPER.ink,
            }}
          >
            {title}
          </div>
          <PaperText className="flex-grow mb-4 text-sm">
            {description}
          </PaperText>
          {disabled ? (
            <button
              disabled={true}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-extrabold opacity-50 cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #D9695F 0%, #F27E7E 100%)",
                color: PAPER.white,
                border: `3px solid ${PAPER.ink}`,
                boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                fontFamily: "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)",
              }}
            >
              {buttonText}
            </button>
          ) : isExternal ? (
            <Link href={buttonLink} target="_blank" className="w-full">
              <button
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-extrabold transition-transform hover:scale-105 hover:-translate-y-1 active:translate-y-[1px]"
                style={{
                  background: "linear-gradient(135deg, #D9695F 0%, #F27E7E 100%)",
                  color: PAPER.white,
                  border: `3px solid ${PAPER.ink}`,
                  boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                  fontFamily: "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)",
                }}
              >
                {buttonText}
              </button>
            </Link>
          ) : (
            <Link href={buttonLink} className="w-full">
              <button
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-extrabold transition-transform hover:scale-105 hover:-translate-y-1 active:translate-y-[1px]"
                style={{
                  background: "linear-gradient(135deg, #D9695F 0%, #F27E7E 100%)",
                  color: PAPER.white,
                  border: `3px solid ${PAPER.ink}`,
                  boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                  fontFamily: "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)",
                }}
              >
                {buttonText}
              </button>
            </Link>
          )}
        </div>
      </PaperCard>
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
    <div className="max-w-6xl mx-auto px-4 py-20">
      <motion.div
        className="flex flex-col items-center justify-center w-full mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1
          className="text-center font-extrabold text-4xl md:text-7xl mb-6"
          style={{
            color: PAPER.ink,
            WebkitTextStroke: `2px ${PAPER.ink}`,
            fontFamily: "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', 'Kalam', ui-rounded, system-ui)",
          }}
        >
          EVENTS
        </h1>
        <p
          className="text-sm md:text-lg text-center max-w-2xl mx-auto"
          style={{
            color: PAPER.ink,
            opacity: 0.8,
            fontFamily: "var(--font-paper, 'Kalam', 'Patrick Hand', ui-rounded, system-ui)",
          }}
        >
          Experience 60+ exhilarating events at Texus Fest!
          <br />
          From workshops to coding challenges and much more
        </p>
      </motion.div>

      {/* First row: Technical and Non-Technical (2 columns) */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {technicalEvent && (
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
          />
        )}

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
          />
        )}
      </motion.div>

      {/* Second row: Workshop and Hackathon (2 columns) */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
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
          />
        )}

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
          />
        )}
      </motion.div>

      {/* Third row: Blood Donation, Souvenir, Go Greener (3 columns) */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
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
          />
        )}

        {souvenirEvent && (
          <EventCard
            key="souvenir"
            index={6}
            title={souvenirEvent.title}
            description={souvenirEvent.shortDescription}
            color={souvenirEvent.color}
            buttonText={souvenirEvent.buttonText}
            buttonLink={souvenirEvent.buttonLink}
            isExternal={souvenirEvent.isExternal}
            disabled={souvenirEvent.disabled}
          />
        )}

        {goGreenerEvent && (
          <EventCard
            key="go-greener"
            index={7}
            title={goGreenerEvent.title}
            description={goGreenerEvent.shortDescription}
            color={goGreenerEvent.color}
            buttonText={goGreenerEvent.buttonText}
            buttonLink={goGreenerEvent.buttonLink}
            isExternal={goGreenerEvent.isExternal}
            disabled={goGreenerEvent.disabled}  
          />
        )}
      </motion.div>
    </div>
  );
}
