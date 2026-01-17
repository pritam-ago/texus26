import React from "react";
import MusicalNightClient from "./MusicalNightClient";
import Proshowartists from "./Proshowartists";
import Rules from "./Rules";
import RegistrationMarquee from "./RegistrationMarquee";

const MusicalNightPage = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Rising particles effect */}
      <div className="fixed inset-0 z-0 opacity-30 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 rounded-full bg-purple-500/30 blur-sm animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        <MusicalNightClient />
        <RegistrationMarquee />
        <Proshowartists />
        <Rules />
      </div>
    </div>
  );
};

export default MusicalNightPage;
