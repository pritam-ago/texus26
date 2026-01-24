"use client";
import { useEffect, useState } from "react";
import Hero from "@/components/Home/Hero";
import AboutPage from "@/components/Home/AboutComponent";
import Currentsponsor from "@/components/currentsponsor";
import Marquee from "react-fast-marquee";

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
        <div id="sponsor">
          <Currentsponsor />
        </div>
      </div>
    // </HomeClientWrapper>
  );
};
export default Page;
