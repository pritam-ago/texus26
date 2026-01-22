import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";

// Load Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const Maintenance = () => {
  return (
    <main
      className={`w-full min-h-screen bg-black text-white flex items-center justify-center ${montserrat.variable} overflow-hidden`}
    >
      {/* Enhanced Background with multiple gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-purple-900/20 z-0"></div>

      {/* Static background elements with CSS animations instead of motion */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-20 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute top-1/3 -left-40 w-96 h-96 bg-[#FF4500]/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-20 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "9s", animationDelay: "1s" }}
        ></div>
      </div>

      {/* Decorative geometric shapes with CSS animations */}
      <div
        className="absolute top-20 right-20 w-16 h-16 border-2 border-purple-500/20 rounded-lg animate-bounce"
        style={{ animationDuration: "4s" }}
      ></div>
      <div
        className="absolute bottom-40 left-20 w-10 h-10 border-2 border-pink-500/20 rotate-45 animate-bounce"
        style={{ animationDuration: "5s", animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/4 w-6 h-6 bg-[#FF4500]/20 rounded-full animate-pulse"
        style={{ animationDuration: "3s" }}
      ></div>

      <div className="container mx-auto px-4 py-16 relative z-10 flex flex-col items-center">
        {/* Logo with static hover effects */}
        <div className="w-28 h-28 mb-10 relative hover:scale-105 transition-transform duration-300">
          <Image
            src="/assets/texus-color 3.png"
            alt="TEXUS Logo"
            width={1000}
            height={1000}
            className="object-contain h-24 w-24"
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-montserrat font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-[#FF4500]">
          Under Maintenance
        </h1>

        <p className="text-xl text-white/80 max-w-2xl text-center mb-12 font-montserrat">
          We&apos;re enhancing our website with exciting new features to elevate
          your experience. Thank you for your patience as we fine-tune TEXUS for
          you!
        </p>

        {/* Progress bar with CSS gradient animation */}
        <div className="w-full max-w-md h-3 bg-gray-800/50 rounded-full mb-10 overflow-hidden backdrop-blur-sm border border-gray-700/50">
          <div
            className="h-full rounded-full animate-gradient-x"
            style={{
              width: "70%",
              backgroundImage:
                "linear-gradient(to right, #a855f7, #ec4899, #FF4500)",
              backgroundSize: "200% 100%",
            }}
          ></div>
        </div>

        {/* Static message instead of countdown */}
        <div className="mb-12 flex items-center justify-center gap-4 font-montserrat">
          <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 px-5 py-3 rounded-md">
            <span className="text-[#FF4500] font-semibold">
              Coming back online soon
            </span>
          </div>
        </div>

        {/* Buttons with CSS hover effects instead of motion */}
        <div className="flex flex-col sm:flex-row gap-5">
          <Link
            href="mailto:srmtexus24@gmail.com"
            className="group relative px-8 py-3.5 bg-gradient-to-br from-[#FF4500] to-[#FF6E40] text-white font-medium rounded-lg transition-all duration-300 overflow-hidden shadow-lg shadow-[#FF4500]/20"
          >
            <span className="relative z-10 text-center font-montserrat w-full">
              Contact Us
            </span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
          <Link
            href="https://www.instagram.com/texus_2k25/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-3.5 border-2 border-purple-500 text-purple-400 font-medium rounded-lg transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 text-center font-montserrat w-full">
              Follow for Updates
            </span>
            <span className="absolute inset-0 bg-purple-500/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
        </div>

        {/* Static additional info */}
        <p className="text-white/40 text-sm mt-16 text-center max-w-md">
          Want to know when we&apos;re back? Follow our social media for instant
          updates on our relaunch.
        </p>
      </div>
    </main>
  );
};

export default Maintenance;
