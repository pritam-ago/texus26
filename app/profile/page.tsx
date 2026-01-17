"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import gsap from "gsap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Meteors } from "@/components/ui/Meteors";
import { Button } from "@/components/ui/button";
import RegisteredEventsList from "@/components/RegisteredEventsList";
import SupportTicketsList from "@/components/SupportTicketsList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "sonner";
import {
  ChevronRight,
  LogOut,
  Calendar,
  CreditCard,
  User as UserIcon,
  Activity,
  Ticket,
} from "lucide-react";
import Link from "next/link";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events");
  const supabase = createClient();

  const fetchUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user details");
    }
  };

  useEffect(() => {
    fetchUser();
  });

  // Separate useEffect for user details and real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const fetchUserDetails = async () => {
      try {
        const { data: userDetailsData, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_auth_id", user.id)
          .single();

        if (error) throw error;

        setUserDetails(userDetailsData);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch profile details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();

    // Set up real-time subscription
    const channel = supabase
      .channel(`users:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes
          schema: "public",
          table: "users",
          filter: `user_auth_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          if (payload.eventType === "UPDATE") {
            const updatedData = payload.new as UserProfile;
            setUserDetails(updatedData);
            toast.info("Profile updated");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, supabase]);

  // GSAP animation in separate useEffect
  useEffect(() => {
    gsap.from(".profile-card", {
      duration: 1,
      y: 100,
      opacity: 0,
      ease: "power3.out",
      delay: 0.2,
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        damping: 15,
      },
    },
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/"; // Redirect to home page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto px-4 py-8 sm:py-16 flex flex-col lg:flex-row gap-4 sm:gap-6"
        >
          <Skeleton className="h-[280px] sm:h-[320px] lg:h-[calc(100vh-8rem)] w-full lg:w-64 rounded-xl sm:rounded-2xl bg-gray-800/50" />
          <div className="flex-1 space-y-4 sm:space-y-6">
            <Skeleton className="h-24 sm:h-32 w-full rounded-xl sm:rounded-2xl bg-gray-800/50" />
            <Skeleton className="h-[280px] sm:h-[calc(100vh-16rem)] w-full rounded-xl sm:rounded-2xl bg-gray-800/50" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-b from-black via-purple-950/20 to-blue-950/30 relative overflow-hidden">
      <Toaster richColors position="top-center" />
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        <Meteors number={20} />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-8 sm:pb-16 relative z-10"
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col lg:flex-row gap-4 sm:gap-6"
        >
          {/* Mobile Tab Navigation - Visible only on smaller screens */}
          <div className="lg:hidden w-full">
            <Card className="bg-white/5 border-blue-300/20 backdrop-blur-xl text-white shadow-md">
              <CardContent className="p-3 sm:p-4">
                <TabsList className="w-full flex bg-black/30 rounded-lg p-1 border border-blue-300/20">
                  <TabsTrigger
                    value="events"
                    className="flex-1 text-xs sm:text-sm text-blue-300 data-[state=active]:bg-blue-500/10 data-[state=active]:text-white transition-all duration-300 rounded-md py-1.5 sm:py-2"
                  >
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    Events
                  </TabsTrigger>
                  <TabsTrigger
                    value="tickets"
                    className="flex-1 text-xs sm:text-sm text-blue-300 data-[state=active]:bg-blue-500/10 data-[state=active]:text-white transition-all duration-300 rounded-md py-1.5 sm:py-2"
                  >
                    <Ticket className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    Tickets
                  </TabsTrigger>
                  <TabsTrigger
                    value="details"
                    className="flex-1 text-xs sm:text-sm text-blue-300 data-[state=active]:bg-blue-500/10 data-[state=active]:text-white transition-all duration-300 rounded-md py-1.5 sm:py-2"
                  >
                    <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    Profile
                  </TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Profile Card - Hidden on mobile when viewing tabs*/}
          <motion.div
            variants={itemVariants}
            className={`w-full lg:w-80 flex-shrink-0 ${
              activeTab !== "details" ? "hidden sm:block" : ""
            } lg:block`}
          >
            <Card className="profile-card h-full bg-white/5 border-blue-300/20 backdrop-blur-xl text-white shadow-lg hover:shadow-[0_0_25px_rgba(147,197,253,0.3)] transition-all duration-300 lg:sticky lg:top-24">
              <CardHeader className="flex flex-col items-center text-center p-4 sm:p-6 relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative"
                >
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-blue-300/30 hover:ring-blue-300/50 transition-all duration-300 mb-3 sm:mb-4">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl sm:text-3xl">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-3 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full border-2 border-black"></div>
                </motion.div>

                <div className="space-y-1 sm:space-y-2">
                  <CardTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 text-transparent bg-clip-text">
                    {user?.user_metadata?.full_name ||
                      user?.email?.split("@")[0]}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-xs sm:text-sm truncate max-w-[90%] mx-auto">
                    {user?.email}
                  </CardDescription>
                </div>

                <div className="mt-2 sm:mt-3 flex justify-center">
                  <span className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500/10 rounded-full text-blue-300 text-xs border border-blue-300/20">
                    {userDetails?.texus_id
                      ? `ID: ${userDetails.texus_id}`
                      : "Texus Attendee"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Desktop sidebar navigation - hidden on mobile */}
                <div className="hidden lg:block border-t border-blue-300/10 py-14">
                  <TabsList className="w-full flex flex-col bg-transparent gap-1 p-2">
                    <TabsTrigger
                      value="events"
                      className={`w-full justify-start text-left px-4 py-3 rounded-lg ${
                        activeTab === "events"
                          ? "bg-blue-500/20 text-white"
                          : "text-blue-300 hover:bg-blue-500/10"
                      } transition-all duration-200 flex items-center gap-3`}
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Registered Events</span>
                      {activeTab === "events" && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="tickets"
                      className={`w-full justify-start text-left px-4 py-3 rounded-lg ${
                        activeTab === "tickets"
                          ? "bg-blue-500/20 text-white"
                          : "text-blue-300 hover:bg-blue-500/10"
                      } transition-all duration-200 flex items-center gap-3`}
                    >
                      <Ticket className="h-5 w-5" />
                      <span>Raised Tickets Issues</span>
                      {activeTab === "tickets" && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="details"
                      className={`w-full justify-start text-left px-4 py-3 rounded-lg ${
                        activeTab === "details"
                          ? "bg-blue-500/20 text-white"
                          : "text-blue-300 hover:bg-blue-500/10"
                      } transition-all duration-200 flex items-center gap-3`}
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>Profile Details</span>
                      {activeTab === "details" && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="px-4 absolute bottom-0 w-full py-4 sm:py-5 border-t border-blue-300/10">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-400">Member since</p>
                        <p className="text-xs sm:text-sm text-white">
                          {user?.created_at
                            ? new Date(user.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Area */}
          <motion.div variants={itemVariants} className="flex-1">
            <Card className="bg-white/5 border-blue-300/20 backdrop-blur-xl text-white shadow-lg hover:shadow-[0_0_25px_rgba(147,197,253,0.3)] transition-all duration-300">
              <CardHeader className="p-4 sm:p-6 border-b border-blue-300/10">
                <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                  {activeTab === "events" && (
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300" />
                  )}
                  {activeTab === "tickets" && (
                    <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300" />
                  )}
                  {activeTab === "details" && (
                    <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300" />
                  )}

                  {activeTab === "events" && "Registered Events"}
                  {activeTab === "tickets" && "Support Tickets"}
                  {activeTab === "details" && "Profile Details"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-400 mt-1">
                  {activeTab === "events" &&
                    "View all your registered Texus events"}
                  {activeTab === "tickets" && (
                    <>
                      <p>View and track your support requests</p>
                      <p>
                        Need help?{" "}
                        <Link
                          href="/support"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          Create a new ticket
                        </Link>
                      </p>
                    </>
                  )}
                  {activeTab === "details" &&
                    "Your personal and academic information"}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-3 sm:p-6">
                <TabsContent value="events" className="mt-0 min-h-[350px]">
                  <RegisteredEventsList />
                </TabsContent>

                <TabsContent value="tickets" className="mt-0 min-h-[350px]">
                  <SupportTicketsList />
                </TabsContent>

                <TabsContent value="details" className="mt-0 min-h-[350px]">
                  <div className="rounded-lg border border-blue-300/10 bg-gradient-to-br from-blue-950/20 to-purple-950/20 backdrop-blur-md">
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                        {/* Personal Information */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-base sm:text-lg font-semibold text-blue-300 border-b border-blue-300/20 pb-2 mb-3 sm:mb-4">
                            Personal Information
                          </h3>
                          <div className="space-y-3 sm:space-y-4">
                            <div className="space-y-1 sm:space-y-2">
                              <Label
                                htmlFor="name"
                                className="text-xs sm:text-sm text-gray-400"
                              >
                                Full Name
                              </Label>
                              <Input
                                id="name"
                                value={userDetails?.name || ""}
                                disabled
                                className="text-xs sm:text-sm h-8 sm:h-10 bg-blue-500/5 border-blue-300/20 text-white"
                              />
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                              <Label
                                htmlFor="contact"
                                className="text-xs sm:text-sm text-gray-400"
                              >
                                Contact Number
                              </Label>
                              <Input
                                id="contact"
                                value={userDetails?.contact_number || ""}
                                disabled
                                className="text-xs sm:text-sm h-8 sm:h-10 bg-blue-500/5 border-blue-300/20 text-white"
                              />
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                              <Label
                                htmlFor="email"
                                className="text-xs sm:text-sm text-gray-400"
                              >
                                Email
                              </Label>
                              <Input
                                id="email"
                                value={userDetails?.email || ""}
                                disabled
                                className="text-xs sm:text-sm h-8 sm:h-10 bg-blue-500/5 border-blue-300/20 text-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Academic Information */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-base sm:text-lg font-semibold text-blue-300 border-b border-blue-300/20 pb-2 mb-3 sm:mb-4">
                            Academic Information
                          </h3>
                          <div className="space-y-3 sm:space-y-4">
                            <div className="space-y-1 sm:space-y-2">
                              <Label
                                htmlFor="college"
                                className="text-xs sm:text-sm text-gray-400"
                              >
                                College
                              </Label>
                              <Input
                                id="college"
                                value={userDetails?.college || ""}
                                disabled
                                className="text-xs sm:text-sm h-8 sm:h-10 bg-blue-500/5 border-blue-300/20 text-white"
                              />
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                              <Label
                                htmlFor="department"
                                className="text-xs sm:text-sm text-gray-400"
                              >
                                Department
                              </Label>
                              <Input
                                id="department"
                                value={userDetails?.department || ""}
                                disabled
                                className="text-xs sm:text-sm h-8 sm:h-10 bg-blue-500/5 border-blue-300/20 text-white"
                              />
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                              <Label
                                htmlFor="year"
                                className="text-xs sm:text-sm text-gray-400"
                              >
                                Year
                              </Label>
                              <Input
                                id="year"
                                value={userDetails?.year || ""}
                                disabled
                                type="number"
                                className="text-xs sm:text-sm h-8 sm:h-10 bg-blue-500/5 border-blue-300/20 text-white"
                              />
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                              <Label
                                htmlFor="register_number"
                                className="text-xs sm:text-sm text-gray-400"
                              >
                                Register Number
                              </Label>
                              <Input
                                id="register_number"
                                value={userDetails?.register_number || ""}
                                disabled
                                className="text-xs sm:text-sm h-8 sm:h-10 bg-blue-500/5 border-blue-300/20 text-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Account Information */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-base sm:text-lg font-semibold text-blue-300 border-b border-blue-300/20 pb-2 mb-3 sm:mb-4">
                            Account Information
                          </h3>
                          <div className="space-y-3 sm:space-y-4">
                            <div className="space-y-1 sm:space-y-2">
                              <Label
                                htmlFor="texus_id"
                                className="text-xs sm:text-sm text-gray-400"
                              >
                                Texus ID
                              </Label>
                              <Input
                                id="texus_id"
                                value={userDetails?.texus_id || ""}
                                disabled
                                className="text-xs sm:text-sm h-8 sm:h-10 bg-blue-500/5 border-blue-300/20 text-white"
                              />
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                              <Label className="text-xs sm:text-sm text-gray-400">
                                Login Provider
                              </Label>
                              <Input
                                value={user?.app_metadata?.provider || "Email"}
                                disabled
                                className="text-xs sm:text-sm h-8 sm:h-10 bg-blue-500/5 border-blue-300/20 text-white"
                              />
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                              <Label className="text-xs sm:text-sm text-gray-400">
                                Account Created
                              </Label>
                              <Input
                                value={
                                  user?.created_at
                                    ? new Date(
                                        user.created_at
                                      ).toLocaleDateString()
                                    : ""
                                }
                                disabled
                                className="text-xs sm:text-sm h-8 sm:h-10 bg-blue-500/5 border-blue-300/20 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </motion.div>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
