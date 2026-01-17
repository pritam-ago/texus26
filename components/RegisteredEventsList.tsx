"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/supabase/client";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SupabaseClient,
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { createPortal } from "react-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

// Simple XOR encryption function
const encryptData = (data: string, key: number): string => {
  const keyStr = key.toString();
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(
      data.charCodeAt(i) ^ keyStr.charCodeAt(i % keyStr.length)
    );
  }
  return btoa(result); // Convert to base64
};

interface RegisteredEvent {
  id: number;
  event_id: number;
  team: string[];
  amount: number;
  payment_status: string;
  attended: boolean;
  event: {
    id: number;
    name: string;
    department: string;
    event_type: string;
    description?: string;
    venue?: string;
    venue_name?: string;
    location?: string;
    date?: string;
    event_date?: string;
    start_date?: string;
    time?: string;
    event_time?: string;
    start_time?: string;
    datetime?: string;
    slug?: string;
    [key: string]: unknown; // Use unknown instead of any
  };
  teamNames?: string[]; // Add this new property to store team member names
}

// Define interfaces for the database tables
interface UserRecord {
  texus_id: string;
  name: string;
  user_auth_id?: string;
  [key: string]: unknown;
}

interface EventRecord {
  id: number;
  name: string;
  department: string;
  event_type: string;
  description?: string;
  venue?: string;
  venue_name?: string;
  location?: string;
  date?: string;
  event_date?: string;
  start_date?: string;
  time?: string;
  event_time?: string;
  start_time?: string;
  datetime?: string;
  slug?: string;
  [key: string]: unknown;
}

interface RegistrationRecord {
  id: number;
  event_id: number;
  team: string[];
  amount: number;
  payment_status: string;
  attended: boolean;
  event?: EventRecord;
  [key: string]: unknown;
}

export default function RegisteredEventsList() {
  const [registeredEvents, setRegisteredEvents] = useState<RegisteredEvent[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [selectedQR, setSelectedQR] = useState<{
    value: string;
    eventName: string;
  } | null>(null);
  const [userTexusId, setUserTexusId] = useState<string | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(
    null
  );
  const [shareLoading, setShareLoading] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Supabase client and set up subscriptions
  useEffect(() => {
    const supabase = createClient();

    // Enable realtime functionality explicitly
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.access_token) {
        supabase.realtime.setAuth(data.session.access_token);
      }
    };

    getSession();

    setSupabaseClient(supabase);

    // Get current user and set up initial data
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's texus_id
      const { data: userData } = await supabase
        .from("users")
        .select("texus_id")
        .eq("user_auth_id", user.id)
        .single();

      if (!userData) return;

      setUserTexusId(userData.texus_id);
    };

    fetchUserData();

    // Cleanup function to remove all subscriptions
    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  // Set up realtime subscriptions once we have the user's texus_id
  useEffect(() => {
    if (!userTexusId || !supabaseClient) return;

    setLoading(true);

    // Initial fetch of registrations
    const fetchRegisteredEvents = async () => {
      // Get all registrations where the user's texus_id is in the team array
      const { data: registrations, error } = await supabaseClient
        .from("registrations")
        .select(
          `
          id,
          event_id,
          team,
          amount,
          payment_status,
          attended,
          event:events (
            *
          )
        `
        )
        .contains("team", [userTexusId]);

      if (error) {
        console.error("Error fetching registrations:", error);
        return;
      }

      // Process the registrations to include team names
      await processRegistrationsWithTeamNames(
        registrations as unknown as RegisteredEvent[]
      );
    };

    fetchRegisteredEvents();

    // Create a more specific channel for registration changes
    const registrationsChannel = supabaseClient
      .channel("registration-details-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "registrations",
          filter: `team.cs.{${userTexusId}}`,
        },
        async (payload: RealtimePostgresChangesPayload<RegistrationRecord>) => {
          console.log("Registration change detected:", payload);

          // Handle different types of changes
          if (payload.eventType === "INSERT") {
            // For new registrations, fetch the complete record with event details
            const { data: newRegistration, error } = await supabaseClient
              .from("registrations")
              .select(
                `
                id,
                event_id,
                team,
                amount,
                payment_status,
                attended,
                event:events (
                  *
                )
              `
              )
              .eq("id", payload.new.id)
              .single();

            if (error || !newRegistration) {
              console.error("Error fetching new registration:", error);
              return;
            }

            // Process and add the new registration
            const processedRegistration =
              await processRegistrationWithTeamNames(
                newRegistration as unknown as RegisteredEvent
              );
            setRegisteredEvents((prev) => [...prev, processedRegistration]);
          } else if (payload.eventType === "UPDATE") {
            // For updates, update the specific registration in state
            setRegisteredEvents((prev) => {
              return prev.map((reg) => {
                if (reg.id === payload.new.id) {
                  // Create updated registration with existing event data
                  const updatedReg = {
                    ...reg,
                    ...payload.new,
                    event: reg.event, // Preserve event data
                  };
                  return updatedReg;
                }
                return reg;
              });
            });

            // If payment_status or attended status changed, we might want to highlight this
            if (
              payload.old.payment_status !== payload.new.payment_status ||
              payload.old.attended !== payload.new.attended
            ) {
              // Could add visual feedback here in the future
              console.log("Important status change detected");
            }
          } else if (payload.eventType === "DELETE") {
            // For deletions, remove the registration from state
            setRegisteredEvents((prev) =>
              prev.filter((reg) => reg.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status: string) => {
        console.log("Registration details subscription status:", status);
      });

    // Subscribe to changes in the events table that might affect our registrations
    const eventsChannel = supabaseClient
      .channel("events-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all changes to ensure we don't miss anything
          schema: "public",
          table: "events",
        },
        async (payload: RealtimePostgresChangesPayload<EventRecord>) => {
          console.log("Event update received:", payload);

          // Check if this event update affects any of our registrations
          if (!payload.new || typeof payload.new !== "object") return;
          const eventId = (payload.new as EventRecord).id;
          if (!eventId) return;

          const affectedRegistrations = registeredEvents.some(
            (reg) => reg.event_id === eventId
          );

          if (affectedRegistrations) {
            // Update the event details in all affected registrations
            setRegisteredEvents((prev) => {
              return prev.map((reg) => {
                if (reg.event_id === eventId) {
                  return {
                    ...reg,
                    event: {
                      ...reg.event,
                      ...payload.new,
                    },
                  };
                }
                return reg;
              });
            });
          }
        }
      )
      .subscribe();

    // Subscribe to changes in the users table that might affect team member names
    const usersChannel = supabaseClient
      .channel("users-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all changes to ensure we don't miss anything
          schema: "public",
          table: "users",
        },
        async (payload: RealtimePostgresChangesPayload<UserRecord>) => {
          console.log("User update received:", payload);

          // If a team member's name changed, update our display
          if (!payload.new || typeof payload.new !== "object") return;
          const updatedTexusId = (payload.new as UserRecord).texus_id;
          if (!updatedTexusId) return;

          // Check if this user is in any of our teams
          const hasUserInTeams = registeredEvents.some((reg) =>
            reg.team.includes(updatedTexusId)
          );

          if (hasUserInTeams) {
            // Refresh team names for all registrations
            fetchRegisteredEvents();
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      try {
        supabaseClient.removeChannel(registrationsChannel);
        supabaseClient.removeChannel(eventsChannel);
        supabaseClient.removeChannel(usersChannel);
      } catch (error) {
        console.error("Error removing channels:", error);
      }
    };
  }, [userTexusId]);

  // Helper function to process a single registration and fetch team names
  const processRegistrationWithTeamNames = async (
    registration: RegisteredEvent
  ) => {
    if (!registration || !supabaseClient) {
      console.log("Missing registration or supabase client");
      return registration;
    }

    // Get user details for each team member
    const { data: teamMembers, error: teamError } = await supabaseClient
      .from("users")
      .select("texus_id, name")
      .in("texus_id", registration.team);

    if (teamError) {
      console.error("Error fetching team members:", teamError);
      return registration;
    }

    // Create a mapping of texus_id to name
    const teamMemberMap = new Map();
    teamMembers?.forEach((member: { texus_id: string; name: string }) => {
      teamMemberMap.set(member.texus_id, member.name);
    });

    // Map texus_ids to names while preserving order
    const teamNames = registration.team.map(
      (texusId: string) => teamMemberMap.get(texusId) || texusId
    );

    return {
      ...registration,
      teamNames,
    };
  };

  // Helper function to process registrations and fetch team names
  const processRegistrationsWithTeamNames = async (
    registrations: RegisteredEvent[]
  ) => {
    if (!registrations || !supabaseClient) {
      console.log("Missing registrations or supabase client");
      setLoading(false);
      return;
    }

    console.log("Processing registrations:", registrations.length);

    const registrationsWithTeamNames = await Promise.all(
      registrations.map(async (registration) => {
        return processRegistrationWithTeamNames(registration);
      })
    );

    setRegisteredEvents(registrationsWithTeamNames as RegisteredEvent[]);
    setLoading(false);
  };

  const filteredEvents = registeredEvents.filter((registration) => {
    // Filter by search query
    const matchesSearch = registration?.event?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter by event type
    const matchesEventType =
      eventTypeFilter === "all" ||
      (eventTypeFilter === "technical" &&
        registration?.event?.event_type === "technical_event") ||
      (eventTypeFilter === "non_technical" &&
        registration?.event?.event_type !== "technical_event" &&
        registration?.event?.event_type !== "workshop") ||
      (eventTypeFilter === "workshop" &&
        registration?.event?.event_type === "workshop");

    return matchesSearch && matchesEventType;
  });

  // Calculate event type counts
  const technicalEventsCount = registeredEvents.filter(
    (registration) => registration?.event?.event_type === "technical_event"
  ).length;

  const nonTechnicalEventsCount = registeredEvents.filter(
    (registration) =>
      registration?.event?.event_type !== "technical_event" &&
      registration?.event?.event_type !== "workshop"
  ).length;

  // Add this new count for workshops
  const workshopEventsCount = registeredEvents.filter(
    (registration) => registration?.event?.event_type === "workshop"
  ).length;

  // Function to handle sharing to Instagram
  const handleShareToInstagram = async (registration: RegisteredEvent) => {
    try {
      setShareLoading(registration.id);

      // Create a canvas element if it doesn't exist
      if (!canvasRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1920;
        canvasRef.current = canvas;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Load Texus logo
      const logoImage = new Image();
      logoImage.src = "/assets/texus-color 3.png";

      await new Promise((resolve, reject) => {
        logoImage.onload = resolve;
        logoImage.onerror = reject;
      });

      // Create a modern gradient background with more vibrant colors
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#0A1128");
      gradient.addColorStop(0.3, "#1E293B");
      gradient.addColorStop(0.7, "#1E1E3F");
      gradient.addColorStop(1, "#0A1128");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add animated-looking background elements
      // Create a mesh grid effect
      ctx.strokeStyle = "rgba(79, 156, 249, 0.05)";
      ctx.lineWidth = 1;

      // Diagonal lines for a more dynamic look
      for (let i = -canvas.height; i < canvas.width + canvas.height; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + canvas.height, canvas.height);
        ctx.stroke();
      }

      for (let i = -canvas.height; i < canvas.width + canvas.height; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height);
        ctx.lineTo(i + canvas.height, 0);
        ctx.stroke();
      }

      // Add glowing orbs with gradients
      const orbs = [
        {
          x: 200,
          y: 200,
          radius: 400,
          color1: "rgba(79, 156, 249, 0.3)",
          color2: "rgba(79, 156, 249, 0)",
        },
        {
          x: canvas.width - 200,
          y: canvas.height - 200,
          radius: 400,
          color1: "rgba(192, 132, 252, 0.2)",
          color2: "rgba(192, 132, 252, 0)",
        },
        {
          x: canvas.width - 300,
          y: 300,
          radius: 300,
          color1: "rgba(249, 115, 22, 0.1)",
          color2: "rgba(249, 115, 22, 0)",
        },
        {
          x: 300,
          y: canvas.height - 300,
          radius: 350,
          color1: "rgba(14, 165, 233, 0.15)",
          color2: "rgba(14, 165, 233, 0)",
        },
      ];

      orbs.forEach((orb) => {
        const grd = ctx.createRadialGradient(
          orb.x,
          orb.y,
          50,
          orb.x,
          orb.y,
          orb.radius
        );
        grd.addColorStop(0, orb.color1);
        grd.addColorStop(1, orb.color2);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add floating particles with different sizes and opacities for a more dynamic look
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 4 + 1;
        const alpha = Math.random() * 0.5 + 0.1;

        // Use different colors for particles
        const colors = [
          "255, 255, 255",
          "79, 156, 249",
          "192, 132, 252",
          "249, 115, 22",
        ];
        const colorIndex = Math.floor(Math.random() * colors.length);

        ctx.fillStyle = `rgba(${colors[colorIndex]}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Texus logo at the top with a glow effect
      ctx.shadowColor = "rgba(79, 156, 249, 0.5)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      const logoWidth = 320;
      const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
      ctx.drawImage(
        logoImage,
        (canvas.width - logoWidth) / 2,
        100,
        logoWidth,
        logoHeight
      );

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Draw "OFFICIAL EVENT TICKET" text with a modern gradient
      const ticketTextGradient = ctx.createLinearGradient(
        canvas.width / 2 - 200,
        100 + logoHeight + 40,
        canvas.width / 2 + 200,
        100 + logoHeight + 40
      );
      ticketTextGradient.addColorStop(0, "#4F9CF9");
      ticketTextGradient.addColorStop(1, "#C084FC");

      ctx.font = "bold 32px Arial";
      ctx.fillStyle = ticketTextGradient;
      ctx.textAlign = "center";
      ctx.fillText(
        "OFFICIAL EVENT TICKET",
        canvas.width / 2,
        100 + logoHeight + 40
      );

      // Draw a modern ticket container with enhanced glass morphism effect
      const ticketWidth = 900;
      const ticketHeight = 1000;
      const ticketX = (canvas.width - ticketWidth) / 2;
      const ticketY = 320;

      // Draw ticket shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 15;

      // Draw glass morphism background with more transparency and blur effect
      ctx.fillStyle = "rgba(31, 41, 55, 0.6)";
      roundedRect(ctx, ticketX, ticketY, ticketWidth, ticketHeight, 40);

      // Add a more vibrant border glow
      ctx.strokeStyle = "rgba(79, 156, 249, 0.5)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      roundedRectPath(ctx, ticketX, ticketY, ticketWidth, ticketHeight, 40);
      ctx.stroke();

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw a modern accent bar at the top of the ticket with animated-looking gradient
      const gradientBar = ctx.createLinearGradient(
        ticketX,
        ticketY,
        ticketX + ticketWidth,
        ticketY
      );
      gradientBar.addColorStop(0, "#4F9CF9");
      gradientBar.addColorStop(0.3, "#818CF8");
      gradientBar.addColorStop(0.6, "#C084FC");
      gradientBar.addColorStop(0.9, "#F472B6");
      gradientBar.addColorStop(1, "#4F9CF9");

      ctx.fillStyle = gradientBar;
      roundedRect(ctx, ticketX, ticketY, ticketWidth, 20, 40, true);

      // Draw event type badge with enhanced gradient
      const isTechnical = registration.event.event_type === "technical_event";
      const badgeGradient = ctx.createLinearGradient(
        ticketX + 30,
        ticketY + 50,
        ticketX + 230,
        ticketY + 50
      );

      if (isTechnical) {
        badgeGradient.addColorStop(0, "#4338CA");
        badgeGradient.addColorStop(1, "#818CF8");
      } else {
        badgeGradient.addColorStop(0, "#7E22CE");
        badgeGradient.addColorStop(1, "#C084FC");
      }

      // Add glow effect to badge
      ctx.shadowColor = isTechnical
        ? "rgba(79, 70, 229, 0.5)"
        : "rgba(147, 51, 234, 0.5)";
      ctx.shadowBlur = 15;
      ctx.fillStyle = badgeGradient;
      roundedRect(ctx, ticketX + 30, ticketY + 50, 200, 40, 20);
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      ctx.font = "bold 24px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.fillText(
        isTechnical ? "TECHNICAL" : "NON-TECHNICAL",
        ticketX + 30 + 100,
        ticketY + 50 + 27
      );

      // Draw event name with enhanced modern typography
      ctx.font = "bold 65px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";

      const eventName = registration.event.name || "Event";
      const maxWidth = ticketWidth - 100;

      // Handle long event names by wrapping text
      const words = eventName.split(" ");
      let line = "";
      const lines = [];

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(line);
          line = words[i] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      // Draw event name lines with enhanced text shadow for depth
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 7;

      let nameY = ticketY + 150;
      if (lines.length > 1) {
        nameY = ticketY + 130;
      }

      lines.forEach((line, index) => {
        ctx.fillText(
          line.trim(),
          ticketX + ticketWidth / 2,
          nameY + index * 70
        );
      });

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw department with a subtle highlight and gradient
      const deptGradient = ctx.createLinearGradient(
        ticketX + ticketWidth / 2 - 150,
        nameY + lines.length * 70 + 50,
        ticketX + ticketWidth / 2 + 150,
        nameY + lines.length * 70 + 50
      );
      deptGradient.addColorStop(0, "#94A3B8");
      deptGradient.addColorStop(0.5, "#CBD5E1");
      deptGradient.addColorStop(1, "#94A3B8");

      ctx.font = "bold 32px Arial";
      ctx.fillStyle = deptGradient;
      ctx.textAlign = "center";
      const departmentText = String(registration.event.department || "");
      ctx.fillText(
        departmentText,
        ticketX + ticketWidth / 2,
        nameY + lines.length * 70 + 50
      );

      // Draw a decorative divider with animated-looking gradient
      const dividerY = nameY + lines.length * 70 + 100;
      const dividerGradient = ctx.createLinearGradient(
        ticketX + 50,
        dividerY,
        ticketX + ticketWidth - 50,
        dividerY
      );
      dividerGradient.addColorStop(0, "rgba(79, 156, 249, 0.1)");
      dividerGradient.addColorStop(0.3, "rgba(79, 156, 249, 0.7)");
      dividerGradient.addColorStop(0.5, "rgba(192, 132, 252, 0.7)");
      dividerGradient.addColorStop(0.7, "rgba(244, 114, 182, 0.7)");
      dividerGradient.addColorStop(1, "rgba(244, 114, 182, 0.1)");

      ctx.strokeStyle = dividerGradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ticketX + 50, dividerY);
      ctx.lineTo(ticketX + ticketWidth - 50, dividerY);
      ctx.stroke();

      // Draw date and venue section with enhanced modern icons
      let dateString = "TBA";
      if (registration.event.datetime) {
        dateString = new Date(registration.event.datetime).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );
      } else if (registration.event.date) {
        dateString = new Date(registration.event.date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );
      } else if (registration.event.event_date) {
        dateString = new Date(registration.event.event_date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );
      } else if (registration.event.start_date) {
        dateString = new Date(registration.event.start_date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );
      }

      let timeString = "";
      if (registration.event.datetime) {
        timeString = new Date(registration.event.datetime).toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        );
      } else if (registration.event.time) {
        timeString = registration.event.time;
      } else if (registration.event.event_time) {
        timeString = registration.event.event_time;
      } else if (registration.event.start_time) {
        timeString = registration.event.start_time;
      }

      // Draw date and time with enhanced icon
      const dateTimeY = dividerY + 80;

      // Draw calendar icon with gradient and glow
      const calendarGradient = ctx.createLinearGradient(
        ticketX + 50,
        dateTimeY - 25,
        ticketX + 100,
        dateTimeY + 25
      );
      calendarGradient.addColorStop(0, "#4F9CF9");
      calendarGradient.addColorStop(1, "#818CF8");

      ctx.shadowColor = "rgba(79, 156, 249, 0.5)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = calendarGradient;
      roundedRect(ctx, ticketX + 50, dateTimeY - 25, 50, 50, 10);
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Enhanced calendar icon drawing
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(ticketX + 60, dateTimeY - 15, 30, 5);
      ctx.fillRect(ticketX + 65, dateTimeY - 5, 5, 20);
      ctx.fillRect(ticketX + 80, dateTimeY - 5, 5, 20);

      // Draw date and time text with shadow for depth
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 5;
      ctx.font = "bold 36px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "left";
      ctx.fillText(
        dateString + (timeString ? " • " + timeString : ""),
        ticketX + 120,
        dateTimeY + 10
      );
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Draw venue with enhanced icon
      const venue =
        registration.event.venue ||
        registration.event.venue_name ||
        registration.event.location ||
        "TBA";

      const venueY = dateTimeY + 80;

      // Draw location pin icon with gradient and glow
      const locationGradient = ctx.createLinearGradient(
        ticketX + 50,
        venueY - 25,
        ticketX + 100,
        venueY + 25
      );
      locationGradient.addColorStop(0, "#818CF8");
      locationGradient.addColorStop(1, "#C084FC");

      ctx.shadowColor = "rgba(129, 140, 248, 0.5)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = locationGradient;
      roundedRect(ctx, ticketX + 50, venueY - 25, 50, 50, 10);
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Enhanced location pin drawing
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(ticketX + 75, venueY - 10, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(ticketX + 75, venueY);
      ctx.lineTo(ticketX + 65, venueY + 15);
      ctx.lineTo(ticketX + 85, venueY + 15);
      ctx.closePath();
      ctx.fill();

      // Draw venue text with shadow for depth
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 5;
      ctx.font = "bold 36px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "left";
      ctx.fillText(venue, ticketX + 120, venueY + 10);
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Draw team section with enhanced modern styling
      const teamY = venueY + 80;

      // Team section header with gradient
      const teamHeaderGradient = ctx.createLinearGradient(
        ticketX + 50,
        teamY,
        ticketX + 150,
        teamY
      );
      teamHeaderGradient.addColorStop(0, "#4F9CF9");
      teamHeaderGradient.addColorStop(1, "#818CF8");

      ctx.font = "bold 32px Arial";
      ctx.fillStyle = teamHeaderGradient;
      ctx.textAlign = "left";
      ctx.fillText("TEAM", ticketX + 50, teamY);

      // Draw team members with enhanced modern list style
      ctx.font = "32px Arial";
      ctx.fillStyle = "#FFFFFF";

      let memberY = teamY + 50;
      const teamMembers = registration.teamNames || registration.team;
      teamMembers.forEach((name, index) => {
        if (index < 4) {
          // Draw bullet point with gradient
          const bulletGradient = ctx.createRadialGradient(
            ticketX + 60,
            memberY - 10,
            0,
            ticketX + 60,
            memberY - 10,
            5
          );
          bulletGradient.addColorStop(0, "#FFFFFF");
          bulletGradient.addColorStop(1, "#4F9CF9");

          ctx.fillStyle = bulletGradient;
          ctx.beginPath();
          ctx.arc(ticketX + 60, memberY - 10, 5, 0, Math.PI * 2);
          ctx.fill();

          // Draw name with subtle shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
          ctx.shadowBlur = 3;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(name, ticketX + 80, memberY);
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;

          memberY += 50;
        } else if (index === 4) {
          // Draw bullet point with gradient
          const bulletGradient = ctx.createRadialGradient(
            ticketX + 60,
            memberY - 10,
            0,
            ticketX + 60,
            memberY - 10,
            5
          );
          bulletGradient.addColorStop(0, "#FFFFFF");
          bulletGradient.addColorStop(1, "#4F9CF9");

          ctx.fillStyle = bulletGradient;
          ctx.beginPath();
          ctx.arc(ticketX + 60, memberY - 10, 5, 0, Math.PI * 2);
          ctx.fill();

          // Draw name with subtle shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
          ctx.shadowBlur = 3;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(
            `+${teamMembers.length - 4} more`,
            ticketX + 80,
            memberY
          );
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }
      });

      // Draw payment status with enhanced modern badge
      const statusY = teamY + 250;

      // Status label with gradient
      const statusHeaderGradient = ctx.createLinearGradient(
        ticketX + 50,
        statusY,
        ticketX + 150,
        statusY
      );
      statusHeaderGradient.addColorStop(0, "#C084FC");
      statusHeaderGradient.addColorStop(1, "#F472B6");

      ctx.font = "bold 32px Arial";
      ctx.fillStyle = statusHeaderGradient;
      ctx.textAlign = "left";
      ctx.fillText("STATUS", ticketX + 50, statusY);

      // Draw status badge with enhanced gradient and glow effect
      const statusGradient = ctx.createLinearGradient(
        ticketX + 50,
        statusY + 20,
        ticketX + 300,
        statusY + 20
      );

      if (registration.payment_status === "completed") {
        statusGradient.addColorStop(0, "#059669");
        statusGradient.addColorStop(1, "#34D399");
        ctx.shadowColor = "rgba(5, 150, 105, 0.5)";
      } else if (registration.payment_status === "pending") {
        statusGradient.addColorStop(0, "#D97706");
        statusGradient.addColorStop(1, "#FBBF24");
        ctx.shadowColor = "rgba(217, 119, 6, 0.5)";
      } else {
        statusGradient.addColorStop(0, "#DC2626");
        statusGradient.addColorStop(1, "#F87171");
        ctx.shadowColor = "rgba(220, 38, 38, 0.5)";
      }

      ctx.shadowBlur = 15;
      ctx.fillStyle = statusGradient;
      roundedRect(ctx, ticketX + 50, statusY + 20, 250, 50, 25);
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Draw status text with subtle shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 5;
      ctx.font = "bold 28px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.fillText(
        registration.payment_status.toUpperCase(),
        ticketX + 50 + 125,
        statusY + 20 + 35
      );
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Draw promotional section at the bottom
      const promoY = ticketY + ticketHeight + 80;

      // Draw "I'M PARTICIPATING!" text with gradient and glow
      const promoGradient = ctx.createLinearGradient(
        canvas.width / 2 - 200,
        promoY,
        canvas.width / 2 + 200,
        promoY
      );
      promoGradient.addColorStop(0, "#4F9CF9");
      promoGradient.addColorStop(0.5, "#C084FC");
      promoGradient.addColorStop(1, "#F472B6");

      ctx.shadowColor = "rgba(79, 156, 249, 0.5)";
      ctx.shadowBlur = 15;
      ctx.font = "bold 45px Arial";
      ctx.fillStyle = promoGradient;
      ctx.textAlign = "center";
      ctx.fillText("I'M PARTICIPATING!", canvas.width / 2, promoY);
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Draw "Join me at TEXUS 2025" text
      ctx.font = "bold 32px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("Join me at TEXUS 2025", canvas.width / 2, promoY + 50);

      // Draw promotional text
      ctx.font = "28px Arial";
      ctx.fillStyle = "#94A3B8";
      ctx.fillText(
        "Register now for the biggest tech fest!",
        canvas.width / 2,
        promoY + 100
      );

      // Draw Instagram handle with enhanced social media icon
      const instaY = promoY + 150;

      // Draw handle text with gradient
      const instaTextGradient = ctx.createLinearGradient(
        canvas.width / 2 - 80,
        instaY,
        canvas.width / 2 + 100,
        instaY
      );
      instaTextGradient.addColorStop(0, "#F472B6");
      instaTextGradient.addColorStop(1, "#C084FC");

      ctx.font = "bold 34px Arial";
      ctx.fillStyle = instaTextGradient;
      ctx.textAlign = "left";
      ctx.fillText("@texus_2k25", canvas.width / 2 - 80, instaY + 5);

      // Helper function for rounded rect path (for strokes)
      function roundedRectPath(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
      ) {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - radius,
          y + height
        );
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
      }

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      if (!blob) {
        throw new Error("Could not create image blob");
      }

      // Create a file from the blob
      const file = new File([blob], "texus-ticket.png", {
        type: "image/png",
      });

      // Create a share data object
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `My Ticket for ${eventName} at TEXUS 2023`,
          text: `I'm participating in ${eventName} at TEXUS 2023!`,
        });
      } else {
        // Fallback for browsers that don't support sharing files
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "texus-ticket.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert("Save this image and share it to your Instagram story!");
      }
    } catch (error) {
      console.error("Error sharing to Instagram:", error);
      alert("Could not share to Instagram. Try again later.");
    } finally {
      setShareLoading(null);
    }
  };

  // Helper function to draw rounded rectangles
  function roundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    topOnly: boolean = false
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

    if (topOnly) {
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x, y + height);
    } else {
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    }

    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F9CF9] mb-4"></div>
        <p className="text-sm text-gray-400">Loading your events...</p>
      </div>
    );
  }

  if (registeredEvents.length === 0) {
    return (
      <div className="bg-[#4F9CF9]/5 rounded-lg p-6 border border-[#4F9CF9]/10">
        <p className="text-center text-gray-400 py-6">
          No registered events found
        </p>
        <p className="text-center text-gray-500 text-sm">
          If you&apos;ve recently registered for an event, please refresh the
          page.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Event Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-[#4F9CF9]/10 to-[#0062E6]/10 rounded-lg p-4 border border-[#4F9CF9]/20 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#4F9CF9]">
              {technicalEventsCount}
            </span>
            <span className="text-gray-300 font-montserrat">
              Technical Events
            </span>
          </div>
          <div className="bg-gradient-to-r from-[#4F9CF9]/10 to-[#0062E6]/10 rounded-lg p-4 border border-[#4F9CF9]/20 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#4F9CF9]">
              {nonTechnicalEventsCount}
            </span>
            <span className="text-gray-300 font-montserrat">
              Non-Technical Events
            </span>
          </div>
          <div className="bg-gradient-to-r from-[#4F9CF9]/10 to-[#0062E6]/10 rounded-lg p-4 border border-[#4F9CF9]/20 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#4F9CF9]">
              {workshopEventsCount}
            </span>
            <span className="text-gray-300 font-montserrat">
              Workshop Events
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#4F9CF9]/5 border-[#4F9CF9]/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="md:w-48">
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="bg-[#4F9CF9]/5 border-[#4F9CF9]/20 text-white">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] border-[#4F9CF9]/20 text-white">
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="non_technical">Non Technical</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <ScrollArea className="h-[60vh] pr-2">
              <div className="flex flex-col gap-3">
                {filteredEvents.map((registration) => (
                  <motion.div
                    key={registration?.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    {/* Minimalist Card Design */}
                    <div className="bg-[#111827] rounded-lg overflow-hidden border border-slate-700/50 shadow-md hover:shadow-lg hover:border-slate-600/50 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row">
                        {/* Event Name and Status Bar */}
                        <div className="sm:w-2/5 p-4 sm:p-5 flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <Badge
                              className={`px-2 py-0.5 text-xs font-medium ${
                                registration?.event?.event_type ===
                                "technical_event"
                                  ? "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                                  : registration?.event?.event_type ===
                                    "workshop"
                                  ? "bg-teal-500/20 text-teal-300 hover:bg-teal-500/30"
                                  : "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                              }`}
                            >
                              {registration?.event?.event_type ===
                              "technical_event"
                                ? "Technical"
                                : registration?.event?.event_type === "workshop"
                                ? "Workshop"
                                : "Non-Technical"}
                            </Badge>

                            <Badge
                              className={`px-2 py-0.5 text-xs font-medium ${
                                registration?.payment_status.toLowerCase() ===
                                "pending"
                                  ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                                  : registration?.payment_status.toLowerCase() ===
                                    "success"
                                  ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                                  : "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                              }`}
                            >
                              {registration?.payment_status.toUpperCase()}
                            </Badge>
                          </div>

                          <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">
                            {registration?.event?.name}
                          </h2>

                          <div className="text-xs text-slate-400 mb-3">
                            {String(registration?.event?.department)}
                          </div>

                          {/* Date and Time */}
                          {(registration?.event?.datetime ||
                            registration?.event?.date ||
                            registration?.event?.event_date ||
                            registration?.event?.start_date) && (
                            <div className="flex items-center text-xs text-slate-300 mb-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5 mr-1.5 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span>
                                {registration?.event?.datetime
                                  ? new Date(
                                      registration.event.datetime
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : registration?.event?.date
                                  ? new Date(
                                      registration.event.date
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : registration?.event?.event_date
                                  ? new Date(
                                      registration.event.event_date
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : registration?.event?.start_date
                                  ? new Date(
                                      registration.event.start_date
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "TBA"}
                                {registration?.event?.datetime ? (
                                  <span className="ml-2 text-slate-400">
                                    {new Date(
                                      registration.event.datetime
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </span>
                                ) : (
                                  (registration?.event?.time ||
                                    registration?.event?.event_time ||
                                    registration?.event?.start_time) && (
                                    <span className="ml-2 text-slate-400">
                                      {registration?.event?.time ||
                                        registration?.event?.event_time ||
                                        registration?.event?.start_time}
                                    </span>
                                  )
                                )}
                              </span>
                            </div>
                          )}

                          {/* Venue */}
                          {(registration?.event?.venue ||
                            registration?.event?.venue_name ||
                            registration?.event?.location) && (
                            <div className="flex items-center text-xs text-slate-300 mb-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5 mr-1.5 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span>
                                {registration?.event?.venue ||
                                  registration?.event?.venue_name ||
                                  registration?.event?.location ||
                                  "TBA"}
                              </span>
                            </div>
                          )}

                          {/* Mobile QR */}
                          <div className="sm:hidden mt-2 flex justify-start">
                            <div
                              className="transform hover:scale-105 transition-transform duration-200 cursor-pointer"
                              onClick={() =>
                                setSelectedQR({
                                  value: encryptData(
                                    JSON.stringify({
                                      id: registration?.id,
                                      event_id: registration?.event_id,
                                      event_name: registration?.event?.name,
                                      team: registration?.team,
                                      payment_status:
                                        registration?.payment_status,
                                      attended: registration?.attended,
                                    }),
                                    registration?.event_id
                                  ),
                                  eventName: registration?.event?.name || "",
                                })
                              }
                            >
                              <div className="bg-white p-1 rounded-md shadow-sm">
                                <QRCodeSVG
                                  value={encryptData(
                                    JSON.stringify({
                                      id: registration?.id,
                                      event_id: registration?.event_id,
                                      event_name: registration?.event?.name,
                                      team: registration?.team,
                                      payment_status:
                                        registration?.payment_status,
                                      attended: registration?.attended,
                                    }),
                                    registration?.event_id
                                  )}
                                  size={64}
                                  level="H"
                                  includeMargin={true}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px bg-slate-700/50 mx-1"></div>

                        {/* Event Details */}
                        <div className="flex-1 p-4 sm:p-5 border-t sm:border-t-0 border-slate-700/50">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                              {/* Team and Amount */}
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <div className="text-xs text-slate-400 mb-1">
                                    Team
                                  </div>
                                  <div className="text-sm text-white">
                                    {registration?.teamNames?.join(", ") ||
                                      registration?.team?.join(", ")}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-xs text-slate-400 mb-1">
                                    Amount
                                  </div>
                                  <div className="text-sm text-white">
                                    ₹{registration?.amount}
                                  </div>
                                </div>
                              </div>

                              {/* Attendance Status */}
                              <div className="mb-4">
                                <div className="text-xs text-slate-400 mb-1">
                                  Status
                                </div>
                                <div
                                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
                                    registration?.attended
                                      ? "bg-emerald-500/10 text-emerald-300"
                                      : "bg-rose-500/10 text-rose-300"
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full mr-1.5 ${
                                      registration?.attended
                                        ? "bg-emerald-400"
                                        : "bg-rose-400"
                                    }`}
                                  ></span>
                                  {registration?.attended
                                    ? "Attended"
                                    : "Not Attended"}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2">
                                <a
                                  href={`/event/${
                                    registration?.event?.slug ||
                                    registration?.event?.id ||
                                    registration?.event_id
                                  }`}
                                  className="inline-flex items-center px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-md transition-colors duration-200 text-xs font-medium"
                                >
                                  View Details
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 ml-1.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                  </svg>
                                </a>

                                <div
                                  onClick={() =>
                                    handleShareToInstagram(registration)
                                  }
                                  className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-pink-300 rounded-md transition-colors duration-200 text-xs font-medium cursor-pointer"
                                >
                                  {shareLoading === registration.id ? (
                                    <span className="flex items-center">
                                      <svg
                                        className="animate-spin -ml-1 mr-2 h-3 w-3 text-pink-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        ></circle>
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                      </svg>
                                      Sharing...
                                    </span>
                                  ) : (
                                    <>
                                      Share
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 ml-1.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                        />
                                      </svg>
                                    </>
                                  )}
                                </div>

                                <div
                                  onClick={() =>
                                    setSelectedQR({
                                      value: encryptData(
                                        JSON.stringify({
                                          id: registration?.id,
                                          event_id: registration?.event_id,
                                          event_name: registration?.event?.name,
                                          team: registration?.team,
                                          payment_status:
                                            registration?.payment_status,
                                          attended: registration?.attended,
                                        }),
                                        registration?.event_id
                                      ),
                                      eventName:
                                        registration?.event?.name || "",
                                    })
                                  }
                                  className="hidden sm:inline-flex items-center px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-md transition-colors duration-200 text-xs font-medium cursor-pointer"
                                >
                                  View QR
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 ml-1.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            {/* QR code - only visible on desktop */}
                            <div className="hidden sm:block">
                              <div
                                className="transform hover:scale-105 transition-transform duration-200 cursor-pointer"
                                onClick={() =>
                                  setSelectedQR({
                                    value: encryptData(
                                      JSON.stringify({
                                        id: registration?.id,
                                        event_id: registration?.event_id,
                                        event_name: registration?.event?.name,
                                        team: registration?.team,
                                        payment_status:
                                          registration?.payment_status,
                                        attended: registration?.attended,
                                      }),
                                      registration?.event_id
                                    ),
                                    eventName: registration?.event?.name || "",
                                  })
                                }
                              >
                                <div className="bg-white p-1.5 rounded-md shadow-sm">
                                  <QRCodeSVG
                                    value={encryptData(
                                      JSON.stringify({
                                        id: registration?.id,
                                        event_id: registration?.event_id,
                                        event_name: registration?.event?.name,
                                        team: registration?.team,
                                        payment_status:
                                          registration?.payment_status,
                                        attended: registration?.attended,
                                      }),
                                      registration?.event_id
                                    )}
                                    size={70}
                                    level="H"
                                    includeMargin={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Scroll indicator that appears at the bottom of the scroll area */}
            {filteredEvents.length > 3 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#4F9CF9]/20 text-[#4F9CF9] text-xs py-1 px-3 rounded-full border border-[#4F9CF9]/30 backdrop-blur-sm flex items-center gap-1.5 animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
                Scroll down for more events
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {selectedQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedQR(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative bg-[#111827] p-8 rounded-xl shadow-2xl border border-slate-700 max-w-[90vw] max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedQR(null)}
                className="absolute -top-4 -right-4 bg-slate-700 text-white p-2 rounded-full hover:bg-slate-600 transition-colors shadow-lg"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <QRCodeSVG
                  value={selectedQR.value}
                  size={Math.min(
                    window.innerWidth * 0.7,
                    window.innerHeight * 0.5
                  )}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <h3 className="text-center mt-6 text-xl font-bold text-white">
                {selectedQR.eventName}
              </h3>

              <p className="text-center mt-2 text-sm text-slate-400">
                Scan this QR code at the event
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
