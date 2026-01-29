"use client";

import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import FloatingParticles from "@/components/FloatingParticles";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  return (
    <>
      <FloatingParticles />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}