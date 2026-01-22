"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import EventsNavbar from "@/components/EventsNavbar";
import EventsFooter from "@/components/EventsFooter";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isEventsRoute = pathname.startsWith("/events");

  return (
    <>
      {isEventsRoute ? <EventsNavbar /> : <Navbar />}
      {children}
      {isEventsRoute ? <EventsFooter /> : <Footer />}
    </>
  );
}