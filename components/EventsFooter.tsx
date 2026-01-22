"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const THEME = {
  bg: "bg-black/90",
  border: "border-gray-800",
  text: "text-white",
  accent: "text-purple-500",
  accentBg: "bg-purple-500/20",
};

const LinkItem = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <motion.div
    whileHover={{ x: 6 }}
    transition={{ type: "spring", stiffness: 420, damping: 22 }}
  >
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-semibold text-gray-300 hover:text-purple-400 transition-colors font-montserrat"
    >
      <span className="inline-block h-2.5 w-2.5 rounded-full bg-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
      <span className="hover:underline decoration-2 underline-offset-4">
        {children}
      </span>
    </Link>
  </motion.div>
);

const IconBtn = ({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    whileHover={{ y: -4, scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 450, damping: 18 }}
    className="inline-flex items-center justify-center rounded-xl h-11 w-11 border border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
  >
    {children}
  </motion.a>
);

function EventsFooter() {
  return (
    <footer className="relative overflow-hidden bg-black/90 border-t border-gray-800">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-black" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(168,85,247,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(168,85,247,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-6 md:p-10 border border-gray-800 bg-black/60 backdrop-blur-xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src="/assets/texus-color 3.png"
                  alt="TEXUS"
                  width={140}
                  height={140}
                  className="w-28 sm:w-32 md:w-36 h-auto"
                  priority
                />
                <div className="leading-tight">
                  <div className="text-xl sm:text-2xl font-extrabold tracking-wide text-white font-thuast">
                    TEXUS '26
                  </div>
                  <div className="text-sm sm:text-base text-gray-400 font-montserrat">
                    SRM IST • Ramapuram Campus
                  </div>
                </div>
              </Link>

              <a
                href="https://srmrmp.edu.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center"
              >
                <Image
                  src="/assets/deptpics/srm_white_logowebp.webp"
                  alt="SRM Logo"
                  width={160}
                  height={160}
                  className="w-28 sm:w-32 md:w-36 h-auto"
                />
              </a>
            </div>

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              className="relative rounded-2xl p-5 w-full lg:max-w-md border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl"
            >
              <div className="text-sm sm:text-base font-semibold text-white font-montserrat">
                "Two days. Too many memories."
              </div>
              <div className="mt-2 text-xs sm:text-sm text-gray-400 font-montserrat">
                Follow our socials for announcements, registrations, and updates.
              </div>
            </motion.div>
          </div>

          <div className="my-8 h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-extrabold text-white mb-3 font-thuast tracking-wider">
                Quick Links
              </h3>
              <div className="space-y-2">
                <LinkItem href="/about">About Us</LinkItem>
                <LinkItem href="/#events">Events</LinkItem>
                <LinkItem href="/gallery">Gallery</LinkItem>
                <LinkItem href="/sponsor">Sponsors</LinkItem>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white mb-3 font-thuast tracking-wider">
                Contact
              </h3>

              <div className="space-y-3">
                <motion.a
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  href="mailto:support@texus.io"
                  className="flex items-center gap-3 rounded-2xl p-3 border border-gray-800 bg-black/40 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                >
                  <FaEnvelope className="text-purple-400" />
                  <span className="text-gray-300 font-montserrat">
                    support@texus.io
                  </span>
                </motion.a>

                <div className="flex items-start gap-3 rounded-2xl p-3 border border-gray-800 bg-black/40">
                  <FaMapMarkerAlt className="text-purple-400 mt-1" />
                  <div className="text-gray-300 font-montserrat">
                    SRM Institute of Science and Technology,
                    <br />
                    Ramapuram Campus,
                    <br />
                    Chennai - 600089
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white mb-3 font-thuast tracking-wider">
                Connect
              </h3>

              <div className="flex items-center gap-3">
                <IconBtn
                  href="https://www.instagram.com/texus_2k25/"
                  label="Instagram"
                >
                  <FaInstagram size={22} className="text-purple-400" />
                </IconBtn>

                <IconBtn
                  href="https://whatsapp.com/channel/0029VaMS5354Spk9aQF91m3q"
                  label="WhatsApp"
                >
                  <FaWhatsapp size={22} className="text-purple-400" />
                </IconBtn>
              </div>

              <div className="mt-4 text-xs sm:text-sm text-gray-400 font-montserrat">
                Reels, posters, announcements — all there.
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white mb-3 font-thuast tracking-wider">
                Policies
              </h3>

              <div className="space-y-2">
                <LinkItem href="/privacy">Privacy Policy</LinkItem>
                <LinkItem href="/termsandcondition">Terms & Conditions</LinkItem>
                <LinkItem href="/refundpolicy">Refund Policy</LinkItem>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border border-gray-800 bg-black/40">
            <div className="text-xs sm:text-sm text-gray-400 font-montserrat">
              © 2026 Texus™. All Rights Reserved.
            </div>

            <div className="text-xs sm:text-sm text-gray-400 font-montserrat font-semibold">
              Designed & Developed by the TEXUS Team
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default EventsFooter;
