"use client";
import { useEffect, useState } from "react";
import Hero from "@/components/Home/Hero";
import Musicalnight from "@/components/Home/Musicalnight";
import Eventdata from "@/components/Eventdata";
import Aboutdept from "@/components/Home/Aboutdept";
import AboutPage from "@/components/Home/AboutComponent";
import Currentsponsor from "@/components/currentsponsor";
// import HomeClientWrapper from "@/components/Home/HomeClientWrapper";
import Proshows from "@/components/Home/Proshows";
import Marquee from "react-fast-marquee";
import Image from "next/image";

const Page = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(true);
      } else {
        // Scrolling up
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    // <HomeClientWrapper>
      <div className="relative bg-black">
        <Hero />
        <div
          className={`sticky top-0 z-[20] bg-gradient-to-r from-pink-600 to-purple-800 
          text-white overflow-hidden shadow-lg 
          transition-all duration-300 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full"
          }`}
        >
          <div hidden>
            <Marquee
              direction="left"
              className="py-3 px-4 font-bold text-lg flex items-center"
            >
              <span className="flex items-center">
                <span className="animate-pulse mr-2">🔴</span>
                🎵 Join us for a FLASHMOB at 3:30 PM today for the Musical Night
                Ticket Reveal! Don&apos;t miss out! 🎟️
              </span>
            </Marquee>
          </div>
        </div>
        <div id="about">
          <AboutPage />
        </div>
        <div id="events">
          <Eventdata />
        </div>
        <div>
          <Proshows />
        </div>
        <div id="sponsor">
          <Currentsponsor />
        </div>

        {/* Map Section */}
        <div className="my-12 container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 font-thuast">
            MAP
          </h2>
          <div className="flex justify-center">
            <div className="relative w-full max-w-4xl aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/assets/map.png"
                alt="Event Map"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Next section */}
      </div>
    // </HomeClientWrapper>
  );
};
export default Page;
