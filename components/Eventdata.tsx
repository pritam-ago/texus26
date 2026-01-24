"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./button";
import Link from "next/link";
import { motion } from "framer-motion";
// import TechnicalLottie from "@/public/assets/lottie/technical-event.json";
// import NonTechnicalLottie from "@/public/assets/lottie/non-technical-event.json";
// import WorkshopLottie from "@/public/assets/lottie/workshop.json";
// import HackathonLottie from "@/public/assets/lottie/hackathon.json";
// import Lottie from "lottie-react";

// Add type definitions
interface EventCardProps {
  title: string;
  description: string | React.ReactNode;
  color: string;
  bgColor?: string;
  borderColor?: string;
  buttonText: string;
  buttonLink: string;
  isExternal?: boolean;
  disabled?: boolean;
  index: number;
}

// Card component for grid layout
const EventCard = ({
  title,
  description,
  color,
  bgColor = "bg-black/40",
  borderColor = "border-gray-800",
  buttonText,
  buttonLink,
  isExternal = false,
  disabled = false,
  index,
}: EventCardProps) => {
  return (
    <motion.div
      className={`rounded-xl overflow-hidden border ${borderColor} backdrop-blur-sm ${bgColor} transition-all duration-300 hover:shadow-lg hover:shadow-${color}/20 h-full flex flex-col`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {/* <Lottie
        className="absolute top-0 left-0 w-full h-full"
        animationData={lottie}
        loop={true}
      /> */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className={`${color} font-thuast text-xl md:text-2xl mb-3`}>
          {title}
        </h3>
        <div className="flex-grow mb-4 text-sm md:text-base text-white/80 font-montserrat">
          {description}
        </div>
        <Button
          variant="outline"
          asChild={!disabled}
          className={`mt-auto w-full hover:${color.replace(
            "text-",
            "bg-"
          )} transition-all duration-300`}
          disabled={disabled}
        >
          {disabled ? (
            <span className="font-thuast">{buttonText}</span>
          ) : isExternal ? (
            <Link href={buttonLink} target="_blank" className="font-thuast">
              {buttonText}
            </Link>
          ) : (
            <Link href={buttonLink} className="font-thuast">
              {buttonText}
            </Link>
          )}
        </Button>
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
  colorValue: string;
  bgColor: string;
  borderColor: string;
  buttonText: string;
  buttonLink: string;
  isExternal?: boolean;
  disabled?: boolean;
  featured: boolean;
}

// Define Category interface
interface Category {
  name: string;
  id: string;
}

// Category tabs with grid layout
export default function Eventdata() {
  // Define events data - removed 3D model related properties
  const events: Event[] = [
    {
      id: "technical",
      title: "TECHNICAL EVENTS",
      shortDescription:
        "Experience 40+ exhilarating tech events at Texus Fest!",
      color: "text-purple-500",
      colorValue: "purple",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/50",
      buttonText: "Coming Soon",
      buttonLink: "/events/technical",
      disabled: true,
      featured: true,
    },
    {
      id: "non-technical",
      title: "NON TECHNICAL EVENTS",
      shortDescription:
        "Embark on a journey of creativity with 15+ non-technical events!",
      color: "text-[#E1DB90]",
      colorValue: "#E1DB90",
      bgColor: "bg-[#E1DB90]/10",
      borderColor: "border-[#E1DB90]/50",
      buttonText: "Coming Soon",
      buttonLink: "/events/nontechnical",
      disabled: true,
      featured: true,
    },
    {
      id: "workshops",
      title: "WORKSHOPS",
      shortDescription:
        "Enhance your skills with 7+ expert-led workshops designed for hands-on learning.",
      color: "text-blue-500",
      colorValue: "blue",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/50",
      buttonText: "Coming Soon",
      buttonLink: "/events/workshop",
      disabled: true,
      featured: false,
    },
    {
      id: "hackathon",
      title: "HACKATHON",
      shortDescription:
        "Join HackVerse for a 24-hour in-person hackathon embracing Web3 innovation.",
      color: "text-orange-500",
      colorValue: "orange",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/50",
      buttonText: "Coming Soon",
      buttonLink: "/events/hackathon",
      disabled: true,
      featured: false,
    },
    {
      id: "souvenir",
      title: "SOUVENIR",
      shortDescription:
        "Celebrate the spirit of TEXUS '26 with a collection of memories and creativity.",
      color: "text-pink-500",
      colorValue: "pink",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/50",
      buttonText: "Coming Soon",
      buttonLink:
        "https://docs.google.com/forms/d/e/1FAIpQLSc22ZwNER2sL7r51h2vx7gC86HiI6j4Sxx2gUNpnrK5uRgybg/viewform",
      isExternal: true,
      featured: false,
      disabled: true,
    },
    {
      id: "blood-donation",
      title: "BLOOD DONATION CAMP",
      shortDescription:
        "Make a difference by donating blood and helping those in need.",
      color: "text-red-600",
      colorValue: "red",
      bgColor: "bg-red-600/10",
      borderColor: "border-red-600/50",
      buttonText: "Coming Soon",
      buttonLink:
        "https://docs.google.com/forms/d/e/1FAIpQLSc_xLDfYSDpkS6bpMiCqn4rlmOEXcH79L-76Lqco18oaDaTJQ/viewform?pli=1",
      isExternal: true,
      featured: false,
      disabled: true,
    },

    {
      id: "go-greener",
      title: "GO GREENER",
      shortDescription:
        "Experience our eco-friendly initiative to create a sustainable future for our planet.",
      color: "text-green-500",
      colorValue: "green",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/50",
      buttonText: "Coming Soon",
      buttonLink: "https://gogreener.texus.io",
      featured: false,
      disabled: true,
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
        <h1 className="text-white text-center font-thuast text-4xl md:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
          EVENTS
        </h1>
        <p className="text-white text-sm md:text-lg font-montserrat text-center max-w-2xl mx-auto">
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
            bgColor={technicalEvent.bgColor}
            borderColor={technicalEvent.borderColor}
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
            bgColor={nonTechnicalEvent.bgColor}
            borderColor={nonTechnicalEvent.borderColor}
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
            bgColor={workshopEvent.bgColor}
            borderColor={workshopEvent.borderColor}
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
            bgColor={hackathonEvent.bgColor}
            borderColor={hackathonEvent.borderColor}
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
            bgColor={bloodDonationEvent.bgColor}
            borderColor={bloodDonationEvent.borderColor}
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
            bgColor={souvenirEvent.bgColor}
            borderColor={souvenirEvent.borderColor}
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
            bgColor={goGreenerEvent.bgColor}
            borderColor={goGreenerEvent.borderColor}
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
