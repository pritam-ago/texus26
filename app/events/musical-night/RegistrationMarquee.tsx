"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/supabase/client";
import Marquee from "react-fast-marquee";
import { Music, User, Clock, RefreshCw } from "lucide-react";
import { getDepartmentInfo } from "@/lib/utils";

type Registration = {
  id: number;
  user_texus_id: string;
  created_at: string;
  user_name?: string;
  department?: string;
};

export default function RegistrationMarquee() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [resetKey, setResetKey] = useState(0); // Key used to force Marquee reset
  const supabase = createClient();
  const marqueeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const newestCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        // First, get the musical_night registrations with minimal data
        const { data: musicalNightData, error } = await supabase
          .from("musical_night")
          .select("id, user_texus_id, created_at")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        if (!musicalNightData || musicalNightData.length === 0) return;

        // Prepare to fetch user details for each registration
        const registrationsWithUserDetails = await Promise.all(
          musicalNightData.map(async (registration) => {
            // Get user details from users table using texus_id
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("name, department")
              .eq("texus_id", registration.user_texus_id)
              .single();

            if (userError || !userData) {
              console.error("Error fetching user data:", userError);
              return {
                ...registration,
                user_name: "Unknown User",
              };
            }

            // Extract registration number from user name if available
            const registerNumber =
              userData.name && userData.name.includes("(")
                ? userData.name.split("(")[1]?.split(")")[0]
                : null;

            // Get department info using the utility function
            const departmentInfo = registerNumber
              ? getDepartmentInfo(registerNumber)
              : null;

            return {
              ...registration,
              user_name: userData.name?.split("(")[0]?.trim() || "Unknown User",
              department: departmentInfo?.success
                ? `${departmentInfo.department} (Year ${departmentInfo.yearOfStudy})`
                : "Unknown Department",
            };
          })
        );

        setRegistrations(registrationsWithUserDetails);
      } catch (error) {
        console.error("Error processing registrations:", error);
      }
    };

    fetchRegistrations();

    // Set up a subscription for real-time updates
    const channel = supabase
      .channel("musical_night_registrations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "musical_night" },
        async (payload) => {
          // When a new registration comes in, fetch the complete data
          try {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("name, department")
              .eq("texus_id", payload.new.user_texus_id)
              .single();

            if (userError) throw userError;

            const registerNumber =
              userData.name && userData.name.includes("(")
                ? userData.name.split("(")[1]?.split(")")[0]
                : null;

            const departmentInfo = registerNumber
              ? getDepartmentInfo(registerNumber)
              : null;

            const newRegistration = {
              id: payload.new.id,
              user_texus_id: payload.new.user_texus_id,
              created_at: payload.new.created_at,
              user_name: userData.name?.split("(")[0]?.trim() || "Unknown User",
              department: departmentInfo?.success
                ? `${departmentInfo.department} (Year ${departmentInfo.yearOfStudy})`
                : "Unknown Department",
            };

            // Update registrations and reset the marquee
            setRegistrations((prev) => [newRegistration, ...prev.slice(0, 49)]);
            setResetKey((prev) => prev + 1); // Force marquee to re-render
          } catch (error) {
            console.error("Error processing new registration:", error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Center the newest card after marquee resets
    if (newestCardRef.current && containerRef.current) {
      setTimeout(() => {
        const container = containerRef.current;
        const newestCard = newestCardRef.current;

        if (container && newestCard) {
          // Get container width
          const containerWidth = container.offsetWidth;

          // Calculate scroll position to center the newest card
          const cardPosition = newestCard.offsetLeft;
          const cardWidth = newestCard.offsetWidth;
          const scrollTo = cardPosition - containerWidth / 2 + cardWidth / 2;

          // Scroll to center
          container.scrollTo({
            left: scrollTo,
            behavior: "smooth",
          });
        }
      }, 100); // Short delay to ensure marquee has rendered
    }
  }, [resetKey]); // Run when resetKey changes (i.e., when marquee resets)

  if (registrations.length === 0) return null;

  // Function to restart the marquee and center the newest card
  const handleRestart = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-900/90 to-pink-800/90 backdrop-blur-sm py-3 md:py-4 shadow-lg border-t border-b border-purple-500/30">
      {/* Title section with controls */}
      <div className="mb-2 md:mb-3 px-2 md:px-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-0 sm:justify-between">
        {/* Live indicator */}
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
          <span className="text-pink-300 text-xs font-medium">LIVE</span>
        </div>

        {/* Center title and restart button */}
        <div className="flex items-center gap-2 md:gap-4 order-1 sm:order-2">
          <div className="flex items-center gap-2">
            <div className="hidden sm:block animate-pulse">
              <Music size={14} className="text-pink-300" />
            </div>
            <h3 className="text-center text-white font-bold tracking-wider uppercase text-xs sm:text-sm">
              Live Registrations
            </h3>
            <div className="hidden sm:block animate-pulse">
              <Music size={14} className="text-pink-300" />
            </div>
          </div>

          {/* Restart button - now centered next to title */}
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 bg-purple-700/50 hover:bg-purple-700/70 text-white text-xs px-2 sm:px-2.5 py-1 rounded-full transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50"
          >
            <RefreshCw size={12} className="text-pink-300" />
            <span className="hidden xs:inline">Restart</span>
          </button>
        </div>

        {/* Empty div to maintain the justify-between layout - hidden on mobile */}
        <div className="hidden sm:block w-[76px] order-3"></div>
      </div>

      {/* Container with ref for scrolling */}
      <div ref={containerRef} className="relative overflow-hidden">
        {/* Key prop forces marquee to restart when a new registration comes in */}
        <Marquee
          key={resetKey}
          speed={35}
          direction="right"
          gradient={false}
          pauseOnHover={true}
          className="py-1 md:py-2"
          ref={marqueeRef}
        >
          <div className="flex items-center gap-6 sm:gap-8 md:gap-12 mx-3 md:mx-5">
            {registrations.map((reg, index) => {
              const animDelay = `${index * 0.05}s`;
              // Highlight the first card (latest registration)
              const isLatest = index === 0;

              return (
                <div
                  key={reg.id}
                  // Add ref to the newest card
                  ref={isLatest ? newestCardRef : null}
                  className={`relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2 md:py-3 rounded-lg ${
                    isLatest
                      ? "bg-gradient-to-r from-purple-500/90 via-fuchsia-600/90 to-pink-600/90 border-pink-400/50 animate-pulse-subtle"
                      : "bg-gradient-to-r from-purple-700/80 via-fuchsia-700/80 to-pink-700/80 border-purple-400/30"
                  } backdrop-blur-md border shadow-lg hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 group animate-fadeIn`}
                  style={{
                    animationDelay: animDelay,
                    animationFillMode: "both",
                  }}
                >
                  {/* Vibrant glow effect on hover */}
                  <div className="absolute inset-0 rounded-lg bg-pink-500/0 group-hover:bg-pink-500/20 transition-colors duration-700"></div>

                  {/* Animated border that pulses with vibrant colors */}
                  <div className="absolute inset-0 rounded-lg border border-purple-400/0 group-hover:border-purple-400/50 transition-colors duration-700 animate-borderPulse"></div>

                  {/* Avatar section with vibrant colors */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full group-hover:bg-pink-600/30 transition-colors duration-700 blur-sm"></div>
                    <div
                      className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full ${
                        isLatest
                          ? "bg-gradient-to-r from-purple-500 to-pink-600"
                          : "bg-gradient-to-r from-purple-600 to-pink-600"
                      } relative z-10 overflow-hidden border border-white/20 group-hover:border-pink-300/50 transition-all duration-500`}
                    >
                      <User
                        size={14}
                        className="text-white group-hover:text-pink-100 transition-colors duration-500"
                      />
                    </div>
                    {/* Animated ring effect with vibrant colors */}
                    <div className="absolute inset-0 rounded-full border border-pink-400/0 group-hover:border-pink-400/50 transition-all duration-700 scale-110 group-hover:scale-125 opacity-0 group-hover:opacity-100"></div>
                  </div>

                  {/* User info section with vibrant text colors */}
                  <div className="flex flex-col min-w-[80px] sm:min-w-[100px] md:min-w-[120px] relative z-10">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="font-medium text-white text-xs sm:text-sm group-hover:text-pink-100 transition-all duration-500 transform group-hover:translate-x-0.5 truncate max-w-[100px] sm:max-w-[120px]">
                        {reg.user_name?.split("(")[0]?.trim()}
                      </span>
                      {isLatest && (
                        <span className="text-[8px] sm:text-[10px] bg-pink-400 text-purple-900 px-1 sm:px-1.5 py-0.5 rounded-full font-bold animate-pulse whitespace-nowrap">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Registration time information with vibrant accents */}
                    <div className="mt-0.5 sm:mt-1 flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[10px] text-purple-200 group-hover:text-pink-200 transition-colors duration-500">
                      <Clock
                        size={8}
                        className="text-pink-400 group-hover:text-pink-300 transition-colors duration-500 animate-pulse"
                      />
                      <span className="transform translate-y-0 group-hover:translate-y-0 transition-transform duration-500 whitespace-nowrap">
                        Joined the party
                      </span>
                    </div>
                  </div>

                  {/* Animated vertical divider with vibrant gradient */}
                  <div className="h-full w-px bg-gradient-to-b from-purple-400/0 via-purple-400/70 to-purple-400/0 ml-1 group-hover:via-pink-400/70 transition-colors duration-700"></div>
                </div>
              );
            })}
          </div>
        </Marquee>
      </div>
    </div>
  );
}
