"use client";

import Image from "next/image";
// import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  IndianRupee,
  CalendarClock,
  MapPin,
  Users,
  TriangleAlert,
  TriangleAlertIcon,
  X,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Search,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";

import { createClient } from "@/supabase/client";
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

import { Badge } from "./ui/badge";
import { cn, encrypt } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  MapPinIcon,
  CreditCardIcon,
  UserIcon,
  PlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/auth";
import { Label } from "@/components/ui/label";
import { XCircle } from "lucide-react";
import { toast } from "sonner";

// Paper theme colors - unified across the site
const PAPER = {
  bg: "#F2F2F2",
  ink: "#12590F",
  accent: "#79A677",
  lightAccent: "#ABBFA8",
  shadow: "#12590F",
  white: "#FFFFFF",
  coral: "linear-gradient(135deg, #D9695F 0%, #F27E7E 100%)",
};

type UserProfile = {
  texus_id: string;
  name: string;
  email: string;
  contact_number: string;
  profile_pic?: string;
  user_auth_id: string;
};

type Event = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  rules: string[];
  venue: string;
  datetime: string;
  fee: number;
  prizes: Prize[];
  max_participants: number;
  min_participants: number;
  slots: number;
  student_coordinators: Studentcoordinator[];
  faculty_coordinators: Studentcoordinator[];
  department: string;
  banner: string;
  event_type: string;
  organized_by: string;
  site_url?: string;
};

type Prize = {
  title: string;
  description: string;
};

type Studentcoordinator = {
  name: string;
  contact: string;
};

type TeamMember = {
  texusId: string;
  name: string;
  email: string;
  phone: string;
  profile_pic?: string;
  user_auth_id: string;
};

type Registration = {
  id: number;
  event_id: number;
  team: string[];
  amount: number;
  payment_status: string;
  attended: boolean;
};

const getColorScheme = (eventType: string) => {
  // All events now use the same paper theme
  return {
    bg: `bg-[${PAPER.accent}]`,
    bgHover: `hover:bg-[${PAPER.ink}]`,
    border: `border-[${PAPER.ink}]`,
    borderHover: `hover:border-[${PAPER.accent}]`,
    shadow: `hover:shadow-[${PAPER.ink}]/40`,
    text: `text-[${PAPER.accent}]`,
    gradient: `from-[${PAPER.accent}] to-[${PAPER.ink}]`,
  };
};

export default function EventDescriptionPageClient({
  event,
  initialUser,
  initialUserData,
}: {
  event: Event;
  initialUser: User | null;
  initialUserData: UserProfile | null;
}) {
  const [eventData, setEventData] = useState<Event>(event);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentTexusId, setCurrentTexusId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<TeamMember[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!initialUser);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(
    initialUserData
      ? {
          texusId: initialUserData.texus_id,
          name: initialUserData.name,
          email: initialUserData.email,
          phone: initialUserData.contact_number.toString(),
          profile_pic: initialUserData.profile_pic,
          user_auth_id: initialUserData.user_auth_id,
        }
      : null
  );
  const [registrationCount, setRegistrationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [referralCode, setReferralCode] = useState("");
  const expectedReferralCode = useMemo(() => {
    if (
      eventData?.event_type === "workshop" &&
      eventData?.rules &&
      eventData?.rules[0]
    ) {
      const parts = eventData.rules[0].split(":");
      return parts.length > 1 ? parts[1].trim() : "";
    }
    return "";
  }, [eventData]);

  const router = useRouter();

  // Memoize color scheme calculation
  const colorScheme = useMemo(
    () => getColorScheme(eventData.event_type),
    [eventData.event_type]
  );

  // Fetch registration count with useCallback
  const fetchRegistrationCount = useCallback(async () => {
    try {
      const supabase = createClient();
      const { count, error } = await supabase
        .from("registrations")
        .select("*", { count: "exact" })
        .eq("event_id", event.id);

      if (error) throw error;
      setRegistrationCount(count || 0);
    } catch (err) {
      console.error("Error fetching registration count:", err);
    }
  }, [event.id]);

  useEffect(() => {
    const checkUserRegistration = async () => {
      // Skip if we don't have a user
      if (!currentUser) return;

      const supabase = createClient();
      // Check if user is registered for this event
      const { data: registrationData } = await supabase
        .from("registrations")
        .select("*")
        .eq("event_id", event.id)
        .contains("team", [currentUser.texusId]);

      if (registrationData && registrationData.length > 0) {
        setIsAlreadyRegistered(true);
      } else {
        setIsAlreadyRegistered(false);
      }

      // Fetch initial registration count
      await fetchRegistrationCount();
    };

    // If we already have user data from the server, just check registration
    if (initialUserData) {
      checkUserRegistration();
    } else {
      // Otherwise do the full auth check
      const checkUserAuth = async () => {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setIsUserLoggedIn(!!user);

        if (user) {
          // Get current user's details
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("user_auth_id", user.id)
            .single();

          if (userData) {
            const currentUserData: TeamMember = {
              texusId: userData.texus_id,
              name: userData.name,
              email: userData.email,
              phone: userData.contact_number,
              profile_pic: userData.profile_pic,
              user_auth_id: userData.user_auth_id,
            };
            setCurrentUser(currentUserData);

            // Then check registration status
            const { data: registrationData } = await supabase
              .from("registrations")
              .select("*")
              .eq("event_id", event.id)
              .contains("team", [userData.texus_id]);

            if (registrationData && registrationData.length > 0) {
              setIsAlreadyRegistered(true);
            } else {
              setIsAlreadyRegistered(false);
            }
          }
        }

        // Fetch initial registration count
        await fetchRegistrationCount();
      };

      checkUserAuth();
    }

    // Set up real-time subscription for event updates and registrations
    const supabase = createClient();

    // Event updates subscription
    const eventSubscription = supabase
      .channel("event-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `id=eq.${event.id}`,
        },
        (payload: RealtimePostgresChangesPayload<Event>) => {
          console.log("Real-time event update:", payload);
          if (payload.new) {
            setEventData(payload.new as Event);
          }
        }
      )
      .subscribe();

    // Registration updates subscription
    const registrationSubscription = supabase
      .channel("registration-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
          filter: `event_id=eq.${event.id}`,
        },
        async (payload: RealtimePostgresChangesPayload<Registration>) => {
          console.log("Real-time registration update:", payload);

          // Update registration count
          await fetchRegistrationCount();

          // If current user exists, check if they're part of any registration for this event
          if (currentUser) {
            const { data: registrationData } = await supabase
              .from("registrations")
              .select("*")
              .eq("event_id", event.id)
              .contains("team", [currentUser.texusId]);

            setIsAlreadyRegistered(
              !!registrationData && registrationData.length > 0
            );
          }

          // Update the list of registered users for search filtering
          const { data: registeredUsers } = await supabase
            .from("registrations")
            .select("team")
            .eq("event_id", event.id);

          const registeredTexusIds = new Set(
            registeredUsers?.flatMap((registration) => registration.team) || []
          );

          // Update search results to exclude newly registered users
          setSearchResults((prevResults) =>
            prevResults.filter((user) => !registeredTexusIds.has(user.texusId))
          );
        }
      )
      .subscribe();

    // Add a specific subscription for the current user's registration status
    let userRegistrationSubscription: RealtimeChannel | null = null;

    if (currentUser) {
      userRegistrationSubscription = supabase
        .channel("user-registration-status")
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
            schema: "public",
            table: "registrations",
            // We don't filter by event_id here to catch any registration change that might include this user
          },
          async () => {
            // When any registration changes, check if the current user is registered for this event
            if (currentUser) {
              const { data: userRegistrations } = await supabase
                .from("registrations")
                .select("*")
                .eq("event_id", event.id)
                .contains("team", [currentUser.texusId]);

              setIsAlreadyRegistered(
                !!userRegistrations && userRegistrations.length > 0
              );
            }
          }
        )
        .subscribe();
    }

    // Cleanup subscriptions
    return () => {
      eventSubscription.unsubscribe();
      registrationSubscription.unsubscribe();
      if (userRegistrationSubscription) {
        userRegistrationSubscription.unsubscribe();
      }
    };
  }, [event.id, fetchRegistrationCount, currentUser, initialUserData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // const { toast } = useToast();

  // Optimize user search with useCallback
  const searchUser = useCallback(
    async (texusId: string) => {
      if (texusId.length < 2) return;

      setIsSearching(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .ilike("texus_id", `%${texusId}%`)
          .limit(5);

        if (error) throw error;

        const formattedResults = data?.map(
          (user: {
            texus_id: string;
            name: string;
            email: string;
            phone: string;
            contact_number: string;
            profile_pic?: string;
            user_auth_id: string;
          }) => ({
            texusId: user.texus_id,
            name: user.name,
            email: user.email,
            phone: user.contact_number,
            profile_pic: user.profile_pic,
            user_auth_id: user.user_auth_id,
          })
        );

        // Filter out users that are already in the team
        const filteredResults = formattedResults?.filter(
          (user) =>
            !teamMembers.some((member) => member.texusId === user.texusId)
        );

        setSearchResults(filteredResults || []);
        setIsDropdownOpen(true);
      } catch (error) {
        console.error("Error searching for user:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [teamMembers]
  );

  // Optimize handlers with useCallback
  const handleSelectUser = useCallback(
    (user: TeamMember) => {
      setTeamMembers((prev) => {
        if (prev.length < eventData?.max_participants) {
          return [...prev, user];
        }
        return prev;
      });
      setCurrentTexusId("");
      setSearchResults([]);
      setIsDropdownOpen(false);
    },
    [eventData?.max_participants]
  );

  const handleRemoveTeamMember = useCallback((texusId: string) => {
    setTeamMembers((prev) =>
      prev.filter((member) => member.texusId !== texusId)
    );
  }, []);

  const handleSubmitTeam = async () => {
    // Check if event is full
    if (registrationCount >= eventData.slots) {
      toast.error(
        "This event is already at full capacity. No more slots available."
      );
      return;
    }

    if (teamMembers.length < eventData?.min_participants) return;

    // No validation for referral code, just proceed with whatever was entered

    // Create a new registration object
    const newRegistration = {
      event_id: eventData.id,
      team: teamMembers.map((member) => member.texusId),
      amount: eventData.fee,
      payment_status: "pending",
      attended: false,
      referral: referralCode === "" ? false : referralCode,
    };

    const encryptedRegistration = encrypt(
      JSON.stringify(newRegistration),
      currentUser?.user_auth_id || ""
    );

    const url = new URL("/payment_portal", window.location.origin);
    url.searchParams.set("registrationData", encryptedRegistration);

    router.push(url.toString());
  };

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsModalOpen(open);
      if (open && currentUser && teamMembers.length === 0) {
        setTeamMembers([currentUser]);
      }
    },
    [currentUser, teamMembers.length]
  );

  const [showWarningPopup, setShowWarningPopup] = useState(true);

  if (!eventData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-white text-2xl">event not found</h1>
      </div>
    );
  }

  // Enhanced and simplified motion animations
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  // const staggerContainer = {
  //   animate: {
  //     transition:
  //       staggerChildren: 0.1,
  //     },
  //   },
  // };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen relative"
    >
      {/* Paper background with hero image */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `${PAPER.bg} url('/assets/hero-bg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `url('/textures/paper.png')`,
            backgroundRepeat: "repeat",
            opacity: 0.5,
          }}
        />
      </div>
      {/* Fixed Warning Popup */}
      {eventData.event_type !== "hackathon" && showWarningPopup && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
          className="fixed right-0 top-1/3 z-50 max-w-xs w-full transform -translate-y-1/2 pr-4 md:pr-6"
        >
          <div
            className="p-4 rounded-lg relative"
            style={{
              background: `${PAPER.bg} url('/textures/paper.png')`,
              border: `3px solid ${PAPER.ink}`,
              boxShadow: `4px 4px 0 ${PAPER.shadow}`,
            }}
          >
            <button
              onClick={() => setShowWarningPopup(false)}
              className="absolute top-2 right-2 transition-colors"
              style={{ color: PAPER.ink }}
            >
              <X size={16} />
            </button>
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="h-5 w-5 flex-shrink-0 mt-0.5"
                style={{ color: PAPER.accent }}
              />
              <div className="space-y-2">
                <h4 className="font-bold text-sm" style={{ color: PAPER.ink }}>
                  Participation Eligibility
                </h4>
                <p 
                  className="text-xs font-montserrat"
                  style={{ color: PAPER.ink, opacity: 0.8 }}
                >
                  Students from other institutions and colleges are allowed to
                  register for this event.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <main className="container max-w-7xl mx-auto px-4 pt-20 sm:pt-24 md:pt-28 pb-16 space-y-6 md:space-y-8">
        {/* Warning banner for SRMIST Ramapuram students */}
        {/* {eventData.event_type !== "workshop" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full bg-gradient-to-r from-amber-500/20 to-yellow-600/30 border border-amber-500/40 rounded-lg p-4 mt-6 mb-2 backdrop-blur-sm shadow-inner"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-400 h-6 w-6 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-amber-200 font-montserrat font-medium text-lg">
                  Important Notice for SRMIST Ramapuram Students
                </p>
                <p className="text-gray-300 font-montserrat text-sm">
                  Students from SRMIST Ramapuram campus are not permitted to
                  participate in this event. Please note that if you have
                  already purchased tickets, they are non-refundable.
                </p>
              </div>
            </div>
          </motion.div>
        )} */}
        {/* Hero Section - Paper styled */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full rounded-xl overflow-hidden"
          style={{
            border: `3px solid ${PAPER.ink}`,
            boxShadow: `6px 6px 0 ${PAPER.shadow}`,
          }}
        >
          {event.banner && (
            <Image
              src={eventData!.banner}
              alt={eventData!.name}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              priority
            />
          )}

          {/* Paper-themed gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent">
            <div className="absolute bottom-0 p-6 md:p-8 w-full">
              <h1 
                className="text-2xl md:text-5xl font-bold mb-2"
                style={{
                  color: PAPER.white,
                  fontFamily: "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', ui-rounded, system-ui)",
                }}
              >
                {eventData?.name}
              </h1>
            </div>
          </div>
        </motion.div>

        <div className="w-full px-4">
          {event.event_type !== "workshop" && (
            <h1 
              className="text-xl md:text-3xl mb-2"
              style={{
                color: PAPER.ink,
                fontFamily: "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', ui-rounded, system-ui)",
              }}
            >
              Organised By {event.organized_by}
            </h1>
          )}
          <Badge
            className="px-3 py-1 rounded-md font-bold border-2"
            style={{
              background: PAPER.lightAccent,
              color: PAPER.ink,
              borderColor: PAPER.ink,
            }}
          >
            <h1 className="font-montserrat">{event.department}</h1>
          </Badge>
        </div>

        {/* Slot information - Paper styled */}
        <div 
          className="flex flex-col gap-3 w-full p-4 rounded-lg"
          style={{
            background: `${PAPER.bg} url('/textures/paper.png')`,
            border: `3px solid ${PAPER.ink}`,
            boxShadow: `4px 4px 0 ${PAPER.shadow}`,
          }}
        >
          <div className="flex items-center justify-between">
            <h1 
              className="font-montserrat font-bold text-xl md:text-2xl"
              style={{ color: PAPER.ink }}
            >
              {Number(event.slots) - Number(registrationCount) > 0 ? (
                <>
                  <span style={{ color: PAPER.accent }}>
                    {Number(event.slots) - Number(registrationCount)}
                  </span>{" "}
                  Slots left
                </>
              ) : (
                <span className="text-rose-500">No Slots Available</span>
              )}
            </h1>
            <Badge
              variant="outline"
              className="border-2 font-bold"
              style={{
                background: PAPER.accent,
                color: PAPER.white,
                borderColor: PAPER.ink,
              }}
            >
              {registrationCount} registered
            </Badge>
          </div>
          {Number(event.slots) - Number(registrationCount) <= 0 && (
            <div className="flex items-center mt-1">
              <AlertTriangle className="text-rose-500" size={20} />
              <h1 
                className="font-montserrat text-sm md:text-base ml-2 text-rose-500"
              >
                This event is at full capacity
              </h1>
            </div>
          )}
          {eventData.event_type !== "hackathon" && (
            <div className="flex items-center">
              <TriangleAlertIcon size={20} style={{ color: PAPER.accent }} />
              <h1 
                className="font-montserrat text-sm md:text-base ml-2"
                style={{ color: PAPER.ink }}
              >
                Venue is subject to change
              </h1>
            </div>
          )}
        </div>

        <motion.div
          // variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {/* Left Column - Event details */}
          <motion.div variants={fadeInUp} className="space-y-6 md:space-y-8">
            {/* Event Details Card - Paper styled */}
            <Card
              className="transition-all duration-300"
              style={{
                background: `${PAPER.bg} url('/textures/paper.png')`,
                border: `3px solid ${PAPER.ink}`,
                boxShadow: `4px 4px 0 ${PAPER.shadow}`,
              }}
            >
              <CardHeader>
                <CardTitle 
                  style={{
                    color: PAPER.ink,
                    fontFamily: "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', ui-rounded, system-ui)",
                  }}
                >
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Venue",
                    value: event.venue,
                    icon: <MapPin size={28} style={{ color: PAPER.accent }} />,
                  },
                  {
                    label: "Date & Time",
                    value: eventData?.datetime
                      ? new Date(eventData.datetime).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "",
                    icon: (
                      <CalendarClock size={28} style={{ color: PAPER.accent }} />
                    ),
                  },
                  {
                    label: "Entry Fee",
                    value: event.fee,
                    icon: (
                      <IndianRupee size={28} style={{ color: PAPER.accent }} />
                    ),
                  },
                  {
                    label: "Team Size",
                    value:
                      event.min_participants === event.max_participants
                        ? event.min_participants === 1
                          ? "Solo"
                          : `${event.max_participants}`
                        : event.max_participants === 1
                        ? "Solo"
                        : `${event.min_participants} - ${event.max_participants}`,
                    icon: <Users size={28} style={{ color: PAPER.accent }} />,
                  },
                ].map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col gap-2 justify-center items-start p-4 rounded-lg"
                    style={{
                      background: PAPER.white,
                      border: `2px solid ${PAPER.ink}`,
                      boxShadow: `2px 2px 0 ${PAPER.shadow}`,
                    }}
                  >
                    <div className="flex flex-row items-center gap-2">
                      {detail.icon && (
                        <div>{detail.icon}</div>
                      )}
                      <span
                        className="uppercase text-sm font-bold"
                        style={{ color: PAPER.accent }}
                      >
                        {detail.label}
                      </span>
                    </div>
                    <span 
                      className="text-sm font-medium font-montserrat"
                      style={{ color: PAPER.ink }}
                    >
                      {detail.label === "Entry Fee" && event.id === 2599
                        ? "Free"
                        : detail.value}
                    </span>
                  </motion.div>
                ))}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {eventData.event_type === "hackathon" &&
                  eventData?.site_url && (
                    <Button
                      asChild
                      className="w-full group overflow-hidden relative rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
                      style={{
                        background: PAPER.coral,
                        color: PAPER.white,
                        border: `2px solid ${PAPER.ink}`,
                        boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                      }}
                    >
                      <Link href={eventData?.site_url} target="_blank">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex justify-center items-center"
                        >
                          <span className="text-md font-medium">
                            Visit Hackathon Website
                          </span>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                          </div>
                        </motion.div>
                      </Link>
                    </Button>
                  )}
                {!isUserLoggedIn &&
                teamMembers.length === 0 &&
                event.id !== 2599 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full space-y-4"
                  >
                    <div
                      className="p-4 rounded-lg flex flex-col space-y-1 relative overflow-hidden"
                      style={{
                        background: `${PAPER.bg} url('/textures/paper.png')`,
                        border: `2px solid ${PAPER.accent}`,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle
                          className="h-5 w-5"
                          style={{ color: PAPER.accent }}
                        />
                        <p 
                          className="font-montserrat font-medium"
                          style={{ color: PAPER.ink }}
                        >
                          You need to log in to register for this event
                        </p>
                      </div>
                      <p 
                        className="text-sm pl-8 font-montserrat"
                        style={{ color: PAPER.ink, opacity: 0.7 }}
                      >
                        Please log in to continue with event registration
                      </p>
                    </div>

                    <Button
                      onClick={() => signInWithGoogle()}
                      className="w-full group overflow-hidden relative rounded-xl font-bold transition-all duration-300"
                      style={{
                        background: PAPER.coral,
                        color: PAPER.white,
                        border: `2px solid ${PAPER.ink}`,
                        boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-3 flex justify-center items-center"
                      >
                        <div className="text-lg font-medium">
                          Register Now
                        </div>
                      </motion.div>
                    </Button>
                  </motion.div>
                ) : isAlreadyRegistered && event.id !== 2599 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full space-y-4"
                  >
                    <div
                      className="p-4 rounded-lg flex flex-col space-y-1 relative overflow-hidden"
                      style={{
                        background: `${PAPER.bg} url('/textures/paper.png')`,
                        border: `2px solid ${PAPER.accent}`,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle 
                          className="h-5 w-5" 
                          style={{ color: PAPER.accent }}
                        />
                        <p 
                          className="font-montserrat font-medium"
                          style={{ color: PAPER.ink }}
                        >
                          You have already registered for this event
                        </p>
                      </div>
                      <p 
                        className="text-sm pl-8 font-montserrat"
                        style={{ color: PAPER.ink, opacity: 0.7 }}
                      >
                        Check your registration details in your profile
                      </p>
                    </div>
                  </motion.div>
                ) : event.id !== 2599 ? (
                  <Dialog
                    open={isModalOpen}
                    onOpenChange={handleDialogOpenChange}
                  >
                    {/* <p></p> */}
                    <DialogTrigger
                      suppressHydrationWarning
                      className="w-full group overflow-hidden relative rounded-xl font-bold transition-all duration-300"
                      style={{
                        background: PAPER.coral,
                        color: PAPER.white,
                        border: `2px solid ${PAPER.ink}`,
                        boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-3 flex justify-center items-center"
                      >
                        <div className="text-lg font-medium">
                          Register Now
                        </div>
                      </motion.div>
                    </DialogTrigger>

                    <DialogContent className="border-0 overflow-y-auto p-4 overflow-hidden max-w-2xl bg-transparent shadow-2xl" style={{ color: PAPER.ink }}>
                      <DialogTitle
                        hidden
                        className="font-thuast font-thin"
                        style={{ color: PAPER.ink }}
                      >
                        Register for {eventData.name}
                      </DialogTitle>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="rounded-2xl overflow-hidden"
                        style={{
                          background: `${PAPER.bg} url('/textures/paper.png')`,
                          backgroundRepeat: "repeat",
                          border: `3px solid ${PAPER.ink}`,
                          boxShadow: `6px 6px 0 ${PAPER.shadow}`,
                        }}
                      >
                        {/* Modern Banner & Header */}
                        <div className="relative h-32 overflow-hidden" style={{ borderBottom: `2px solid ${PAPER.ink}` }}>
                          <Image
                            src={eventData.banner}
                            alt={eventData.name}
                            layout="fill"
                            objectFit="cover"
                            className="opacity-20"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50"></div>
                          <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <div
                              className="px-2 py-1 rounded-full text-xs font-medium w-fit mb-2"
                              style={{
                                background: PAPER.accent,
                                color: PAPER.white,
                              }}
                            >
                              {eventData.event_type.charAt(0).toUpperCase() +
                                eventData.event_type
                                  .slice(1)
                                  .split("_")
                                  .join(" ")}
                            </div>
                            <h3
                              className="text-2xl font-bold font-montserrat"
                              style={{ color: PAPER.ink }}
                            >
                              {eventData.name}
                            </h3>
                          </div>
                        </div>

                        <div className="p-6 space-y-6">
                          {/* Event Details Summary */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center p-4 rounded-lg" style={{
                              background: PAPER.white,
                              border: `2px solid ${PAPER.ink}`,
                              boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                            }}>
                              <CalendarIcon
                                className="mb-2"
                                size={18}
                                style={{ color: PAPER.accent }}
                              />
                              <span className="text-xs" style={{ color: PAPER.ink, opacity: 0.7 }}>
                                Date
                              </span>
                              <span className="text-sm font-medium" style={{ color: PAPER.ink }}>
                                {new Date(
                                  eventData.datetime
                                ).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            </div>

                            <div className="flex flex-col items-center p-4 rounded-lg" style={{
                              background: PAPER.white,
                              border: `2px solid ${PAPER.ink}`,
                              boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                            }}>
                              <MapPinIcon
                                className="mb-2"
                                size={18}
                                style={{ color: PAPER.accent }}
                              />
                              <span className="text-xs" style={{ color: PAPER.ink, opacity: 0.7 }}>
                                Venue
                              </span>
                              <span className="text-sm font-medium truncate max-w-full" style={{ color: PAPER.ink }}>
                                {eventData.venue}
                              </span>
                            </div>

                            <div className="flex flex-col items-center p-4 rounded-lg" style={{
                              background: PAPER.white,
                              border: `2px solid ${PAPER.ink}`,
                              boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                            }}>
                              <CreditCardIcon
                                className="mb-2"
                                size={18}
                                style={{ color: PAPER.accent }}
                              />
                              <span className="text-xs" style={{ color: PAPER.ink, opacity: 0.7 }}>Fee</span>
                              <span className="text-sm font-medium" style={{ color: PAPER.ink }}>
                                {eventData.fee > 0
                                  ? `₹${eventData.fee}`
                                  : "Free"}
                              </span>
                            </div>
                          </div>

                          {/* Team Members Section */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="space-y-1">
                                <h4 className="font-medium" style={{ color: PAPER.ink }}>Team Members</h4>
                                <p className="text-xs" style={{ color: PAPER.ink, opacity: 0.6 }}>
                                  {teamMembers.length > 0
                                    ? `${teamMembers.length} of ${eventData.max_participants} members added`
                                    : "Add your team members"}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 rounded-full px-3 py-1" style={{
                                background: PAPER.lightAccent,
                              }}>
                                <Users size={14} style={{ color: PAPER.ink }} />
                                <span className="text-xs font-medium" style={{ color: PAPER.ink }}>
                                  {teamMembers.length}/
                                  {eventData.max_participants}
                                </span>
                              </div>
                            </div>

                            {/* Team Members List with modern styling */}
                            {teamMembers.length > 0 ? (
                              <div className="space-y-2 mb-4">
                                {teamMembers.map((member) => (
                                  <motion.div
                                    key={member.texusId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200"
                                    style={{
                                      background: PAPER.white,
                                      border: `2px solid ${PAPER.ink}`,
                                      boxShadow: `2px 2px 0 ${PAPER.shadow}`,
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Avatar
                                        className="h-9 w-9 shadow-sm"
                                        style={{
                                          border: `2px solid ${PAPER.accent}`,
                                        }}
                                      >
                                        {member.profile_pic ? (
                                          <AvatarImage
                                            src={member.profile_pic}
                                            alt={member.name}
                                          />
                                        ) : (
                                          <AvatarFallback
                                            className="text-xs font-medium"
                                            style={{
                                              background: PAPER.lightAccent,
                                              color: PAPER.ink,
                                            }}
                                          >
                                            {member.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        )}
                                      </Avatar>
                                      <div>
                                        <p className="text-sm font-medium tracking-tight" style={{ color: PAPER.ink }}>
                                          {member.name}
                                        </p>
                                        <div className="flex items-center">
                                          <UserIcon
                                            size={10}
                                            className="mr-1"
                                            style={{ color: PAPER.accent }}
                                          />
                                          <p className="text-xs" style={{ color: PAPER.ink, opacity: 0.6 }}>
                                            {member.texusId}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    {member.texusId !==
                                      currentUser?.texusId && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-400"
                                        onClick={() =>
                                          handleRemoveTeamMember(member.texusId)
                                        }
                                      >
                                        <X
                                          size={16}
                                          className="group-hover:text-red-400"
                                          style={{ color: PAPER.ink }}
                                        />
                                      </Button>
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center p-6 rounded-xl border border-dashed mb-4" style={{
                                background: `${PAPER.bg}40`,
                                borderColor: PAPER.ink,
                              }}>
                                <div className="text-center">
                                  <Users
                                    size={24}
                                    className="mx-auto mb-2"
                                    style={{ color: PAPER.accent }}
                                  />
                                  <p className="text-sm" style={{ color: PAPER.ink, opacity: 0.6 }}>
                                    No team members added yet
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Modern Search Input */}
                            {teamMembers.length <
                              eventData.max_participants && (
                              <div className="relative" ref={searchRef}>
                                <div className="flex items-center px-4 py-3 rounded-xl transition-all duration-200" style={{
                                  background: PAPER.white,
                                  border: `2px solid ${PAPER.ink}`,
                                  boxShadow: `2px 2px 0 ${PAPER.shadow}`,
                                }}>
                                  <Search
                                    size={18}
                                    className={isSearching ? "hidden" : "block"}
                                    style={{ color: PAPER.accent, marginRight: '12px' }}
                                  />
                                  {isSearching && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="mr-3"
                                    >
                                      <Loader2
                                        className="animate-spin w-[18px] h-[18px]"
                                        style={{ color: PAPER.accent }}
                                      />
                                    </motion.div>
                                  )}
                                  <Input
                                    type="text"
                                    value={currentTexusId}
                                    onChange={(e) => {
                                      setCurrentTexusId(e.target.value);
                                      if (e.target.value.length >= 2) {
                                        searchUser(e.target.value);
                                      } else {
                                        setIsDropdownOpen(false);
                                      }
                                    }}
                                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-sm"
                                    style={{ color: PAPER.ink }}
                                    placeholder="Search participants by TEXUS ID"
                                  />
                                </div>

                                {/* Modern Search Results Dropdown */}
                                {isDropdownOpen && searchResults.length > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute z-10 mt-2 w-full rounded-xl overflow-hidden"
                                    style={{
                                      background: `${PAPER.white} url('/textures/paper.png')`,
                                      backgroundRepeat: "repeat",
                                      border: `2px solid ${PAPER.ink}`,
                                      boxShadow: `4px 4px 0 ${PAPER.shadow}`,
                                    }}
                                  >
                                    <div className="p-1 max-h-60 overflow-auto">
                                      {searchResults.map((user) => (
                                        <motion.div
                                          key={user.texusId}
                                          whileHover={{
                                            backgroundColor: PAPER.lightAccent,
                                          }}
                                          className="cursor-pointer rounded-lg p-3 transition-colors flex items-center justify-between"
                                          onClick={() => handleSelectUser(user)}
                                        >
                                          <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                              <AvatarImage
                                                src={user.profile_pic}
                                                alt={user.name}
                                              />
                                              <AvatarFallback
                                                className="text-xs"
                                                style={{
                                                  background: PAPER.lightAccent,
                                                  color: PAPER.ink,
                                                }}
                                              >
                                                {user.name.split(" ")[0][0]}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <p className="text-sm font-medium" style={{ color: PAPER.ink }}>
                                                {user.name}
                                              </p>
                                              <p className="text-xs" style={{ color: PAPER.ink, opacity: 0.6 }}>
                                                {user.texusId}
                                              </p>
                                            </div>
                                          </div>
                                          <div
                                            className="h-6 w-6 rounded-full flex items-center justify-center"
                                            style={{
                                              background: PAPER.accent,
                                              color: PAPER.white,
                                            }}
                                          >
                                            <PlusIcon size={14} />
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Registration Requirements */}
                          <div
                            className="p-4 rounded-xl"
                            style={{
                              background: PAPER.white,
                              border: `2px solid ${
                                teamMembers.length >= eventData.min_participants
                                  ? "#22c55e"
                                  : "#f59e0b"
                              }`,
                              boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                            }}
                          >
                            <div className="flex items-start">
                              {teamMembers.length >=
                              eventData.min_participants ? (
                                <CheckCircle2
                                  className="mt-0.5 mr-3 flex-shrink-0"
                                  size={18}
                                  style={{ color: "#22c55e" }}
                                />
                              ) : (
                                <AlertCircle
                                  className="mt-0.5 mr-3 flex-shrink-0"
                                  size={18}
                                  style={{ color: "#f59e0b" }}
                                />
                              )}
                              <div>
                                <p className="text-sm font-medium" style={{ color: PAPER.ink }}>
                                  {teamMembers.length >=
                                  eventData.min_participants
                                    ? "Your team meets the requirements!"
                                    : `Requires at least ${eventData.min_participants} team members`}
                                </p>
                                <p className="text-xs mt-1" style={{ color: PAPER.ink, opacity: 0.6 }}>
                                  {teamMembers.length >=
                                  eventData.min_participants
                                    ? "You can now confirm your registration"
                                    : `Please add ${
                                        eventData.min_participants -
                                        teamMembers.length
                                      } more ${
                                        eventData.min_participants -
                                          teamMembers.length ===
                                        1
                                          ? "member"
                                          : "members"
                                      } to continue`}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Referral Code Input */}
                          {eventData?.event_type === "workshop" &&
                            eventData?.id === 2534 && (
                              <div className="px-6 pb-4">
                                <div className="flex flex-col space-y-2">
                                  <Label
                                    htmlFor="referralCode"
                                    className="text-sm font-medium"
                                    style={{ color: PAPER.ink }}
                                  >
                                    Referral Code
                                  </Label>
                                  <div className="relative">
                                    <Input
                                      id="referralCode"
                                      type="text"
                                      value={referralCode}
                                      onChange={(e) =>
                                        setReferralCode(e.target.value)
                                      }
                                      className="rounded-xl"
                                      style={{
                                        background: PAPER.white,
                                        border: `2px solid ${PAPER.ink}`,
                                        color: PAPER.ink,
                                      }}
                                      placeholder="Enter workshop referral code (optional)"
                                    />
                                    {referralCode && (
                                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        {referralCode ? (
                                          <CheckCircle2 className="h-5 w-5" style={{ color: "#22c55e" }} />
                                        ) : (
                                          <XCircle className="h-5 w-5" style={{ color: "#ef4444" }} />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs" style={{ color: PAPER.ink, opacity: 0.6 }}>
                                    The referral code is optional. If you have
                                    one, it can be found in the event rules.
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>

                        {/* Modern Footer */}
                        <div className="px-6 py-4" style={{
                          borderTop: `2px solid ${PAPER.ink}`,
                          background: `${PAPER.bg} url('/textures/paper.png')`,
                          backgroundRepeat: "repeat",
                        }}>
                          <div className="flex items-center justify-between">
                            <p className="text-xs" style={{ color: PAPER.ink, opacity: 0.6 }}>
                              {`${registrationCount} of ${eventData.slots} slots filled`}
                            </p>
                            <Button
                              onClick={handleSubmitTeam}
                              disabled={
                                teamMembers.length <
                                  eventData.min_participants ||
                                isLoading ||
                                registrationCount >= eventData.slots
                              }
                              className="transition-all px-6 rounded-xl font-medium shadow-lg disabled:opacity-50"
                              style={{
                                background: "linear-gradient(135deg, #D9695F 0%, #F27E7E 100%)",
                                color: PAPER.white,
                                border: `2px solid ${PAPER.ink}`,
                                boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                              }}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : registrationCount >= eventData.slots ? (
                                <>
                                  Event Full
                                  <AlertTriangle className="ml-2 h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  Confirm Registration
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </DialogContent>
                  </Dialog>
                ) : null}
              </CardFooter>
            </Card>

            {/* Prizes Card */}
            {event.event_type !== "workshop" && (
              <Card
                className="transition-colors"
                style={{
                  background: `${PAPER.bg} url('/textures/paper.png')`,
                  border: `3px solid ${PAPER.ink}`,
                  boxShadow: `4px 4px 0 ${PAPER.shadow}`,
                }}
              >
                <CardHeader>
                  <CardTitle 
                    style={{
                      color: PAPER.ink,
                      fontFamily: "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', ui-rounded, system-ui)",
                    }}
                  >
                    Prizes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event?.prizes
                      ? event?.prizes?.map((prize: Prize, index: number) => (
                          <div key={index} className="space-y-1">
                            <Card 
                              className="border-0"
                              style={{
                                background: PAPER.white,
                                boxShadow: `2px 2px 0 ${PAPER.shadow}`,
                              }}
                            >
                              <h4 
                                className="px-2 font-bold"
                                style={{ color: PAPER.accent }}
                              >
                                {prize.title ? prize.title : "TBA"}
                              </h4>
                            </Card>
                            <p 
                              className="font-montserrat"
                              style={{ color: PAPER.ink }}
                            >
                              {prize.description}
                            </p>
                            {index < event?.prizes.length - 1 && (
                              <Separator 
                                className="my-2"
                                style={{ background: PAPER.lightAccent }}
                              />
                            )}
                          </div>
                        ))
                      : "TBA"}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Right Column - Description, Rules, Contacts */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-2 space-y-6 md:space-y-8"
          >
            {/* Description Card */}
            <Card
              className="transition-all duration-300"
              style={{
                background: `${PAPER.bg} url('/textures/paper.png')`,
                border: `3px solid ${PAPER.ink}`,
                boxShadow: `4px 4px 0 ${PAPER.shadow}`,
              }}
            >
              <CardHeader>
                <CardTitle 
                  style={{
                    color: PAPER.ink,
                    fontFamily: "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', ui-rounded, system-ui)",
                  }}
                >
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex gap-2 font-montserrat text-justify"
                  style={{ color: PAPER.ink }}
                >
                  {eventData.description}
                </motion.div>
              </CardContent>
            </Card>

            {/* Rules Card */}
            <Card
              hidden={event.event_type === "workshop"}
              className="transition-all duration-300"
              style={{
                background: `${PAPER.bg} url('/textures/paper.png')`,
                border: `3px solid ${PAPER.ink}`,
                boxShadow: `4px 4px 0 ${PAPER.shadow}`,
              }}
            >
              <CardHeader>
                <CardTitle 
                  style={{
                    color: PAPER.ink,
                    fontFamily: "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', ui-rounded, system-ui)",
                  }}
                >
                  {event.event_type === "workshop" ? "Referral Code" : "Rules"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.ul className="space-y-2">
                  {eventData?.rules?.map((rule: string, index: number) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-2 text-justify"
                    >
                      <span style={{ color: PAPER.accent }}>•</span>
                      <h1 
                        className="font-montserrat"
                        style={{ color: PAPER.ink }}
                      >
                        {rule}
                      </h1>
                    </motion.li>
                  ))}
                </motion.ul>
              </CardContent>
            </Card>

            {/* Contact Details Card */}
            <Card
              className="transition-all duration-300"
              style={{
                background: `${PAPER.bg} url('/textures/paper.png')`,
                border: `3px solid ${PAPER.ink}`,
                boxShadow: `4px 4px 0 ${PAPER.shadow}`,
              }}
            >
              <CardHeader>
                <CardTitle 
                  style={{
                    color: PAPER.ink,
                    fontFamily: "var(--font-cartoon, 'Comic Neue', 'Patrick Hand', ui-rounded, system-ui)",
                  }}
                >
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 
                      className="font-montserrat mb-3 font-bold"
                      style={{ color: PAPER.accent }}
                    >
                      Student Coordinators
                    </h4>
                    {eventData?.student_coordinators?.map(
                      (coordinator: Studentcoordinator, index: number) => (
                        <div 
                          key={index} 
                          className="mb-2"
                          style={{ color: PAPER.ink }}
                        >
                          <p className="font-montserrat font-bold">{coordinator.name}</p>
                          <p className="text-sm font-montserrat">
                            {coordinator.contact}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                  <div>
                    <h4 
                      className="font-montserrat mb-3 font-bold"
                      style={{ color: PAPER.accent }}
                    >
                      Faculty Coordinators
                    </h4>
                    {eventData?.faculty_coordinators?.map(
                      (coordinator: Studentcoordinator, index: number) => (
                        <div key={index} className="text-gray-300 mb-2">
                          <p className="font-montserrat">{coordinator.name}</p>
                          <p className="text-sm font-montserrat">
                            {coordinator.contact}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
