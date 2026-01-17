import React from "react";
import { Music, AlertTriangle } from "lucide-react";

const Rules = () => {
  const rules = [
    "• Entry is strictly permitted only for registered participants with valid passes(ticket) and a college ID.",
    "• Any indisciplinary activities will result in immediate removal or denial of entry at the discretion of the organizers.",
    "• No edible items, including food and beverages, are allowed inside the venue.",
    "• Once entered, re-entry is not permitted. Attendees must remain inside until the program concludes.",
    "• Students must not be intoxicated or in possession of illegal substances. Violators will face strict disciplinary action.",
    "• Bags of any size, unwanted material, sharp objects, harmful weapons, and outside food are strictly prohibited.",
    "• Vehicles must be parked only in designated bus parking areas.",
    "• Tickets are non-transferable. Only SRM RMP E&T students are allowed.",
    "• A proper dress code must be followed. Inappropriate attire will not be permitted. (Any representation of political party in dress code will not be permitted)",
    "• Organizers are not responsible for any lost, misplaced, or stolen belongings.",
    "• In the event of natural calamities or unforeseen circumstances, tickets will not be refunded.",
  ];

  return (
    <div className="w-full bg-black text-white pb-16 relative overflow-visible">
      {/* Contained decorative background elements */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] animate-pulse"></div>
      <div className="absolute top-40 right-10 w-40 h-40 bg-pink-600/20 rounded-full blur-[60px] animate-pulse"></div>

      <div className="w-full h-full p-4 md:p-8 max-w-4xl mx-auto flex flex-col gap-6 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-white relative drop-shadow-[0_0_25px_rgba(200,100,255,0.3)] flex items-center justify-center gap-3">
            <Music size={28} className="text-purple-400" />
            Rules & Regulations
          </h2>
          <div className="h-0.5 w-40 md:w-60 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-4"></div>
        </div>

        {/* Warning banner for attention */}
        <div className="bg-gradient-to-r from-amber-500/20 to-yellow-600/30 border border-amber-500/40 rounded-lg p-4 mb-6 backdrop-blur-sm shadow-inner">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-400 h-6 w-6 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-amber-200 font-montserrat font-medium text-lg">
                Important Notice
              </p>
              <p className="text-gray-300 font-montserrat text-sm">
                Please read all rules carefully before attending the Musical
                Night. Violation of any rules may result in denial of entry or
                removal from the venue.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2 bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-purple-900/50 shadow-xl rounded-xl p-6">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="text-slate-200 font-montserrat p-3 border-b border-gray-700/50 last:border-b-0 hover:bg-purple-900/20 transition-colors duration-200"
            >
              {rule}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rules;
