"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";
import {
  PAPER,
  headingFont,
  bodyFont,
  Tape,
} from "@/components/PaperComponents";

// Updated PaperPanel to match Hero section style (simple border)
const PaperPanel = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn("relative rounded-2xl", className)}
    style={{
      background: `${PAPER.bg} url('/textures/paper.png')`,
      backgroundRepeat: "repeat",
      border: `3px solid ${PAPER.ink}`,
      boxShadow: `8px 8px 0 ${PAPER.shadow}`,
    }}
  >
    <Tape className="-top-4 left-10" rotate={-2} />
    <Tape className="-top-4 right-10" rotate={2} />
    {children}
  </div>
);

const LinkItem = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <motion.div
    whileHover={{ x: 6, rotate: -0.2 }}
    transition={{ type: "spring", stiffness: 420, damping: 22 }}
  >
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-semibold"
      style={{ fontFamily: bodyFont, color: "rgba(18,56,89,0.86)" }}
    >
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{
          background: PAPER.accent,
          border: `2px solid ${PAPER.ink}`,
          boxShadow: `2px 2px 0 ${PAPER.shadow}`,
        }}
      />
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
  tint,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  tint: string;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    whileHover={{ y: -4, rotate: -1, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 450, damping: 18 }}
    className="inline-flex items-center justify-center rounded-xl h-11 w-11"
    style={{
      background: tint,
      border: `3px solid ${PAPER.ink}`,
      boxShadow: `6px 6px 0 ${PAPER.shadow}`,
      color: PAPER.ink,
    }}
  >
    {children}
  </motion.a>
);

function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Paper base */}
      <div
        className="absolute inset-0"
        style={{
          background: `${PAPER.bg} url('/textures/paper.png')`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* doodle grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(18,56,89,0.10) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(18,56,89,0.10) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(242,242,242,0) 0%, rgba(242,242,242,0.55) 62%, rgba(242,242,242,0.98) 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
        <PaperPanel className="p-6 md:p-10">
          {/* Top row: logos + note */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Logos (NO cards) */}
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
                  <div
                    className="text-xl sm:text-2xl font-extrabold tracking-wide"
                    style={{ fontFamily: headingFont, color: PAPER.ink }}
                  >
                    TEXUS ’26
                  </div>
                  <div
                    className="text-sm sm:text-base"
                    style={{
                      fontFamily: bodyFont,
                      color: "rgba(18,56,89,0.78)",
                    }}
                  >
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

            {/* Sticky note */}
            <motion.div
              whileHover={{ y: -5, rotate: 0.3 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              className="relative rounded-2xl p-5 w-full lg:max-w-md"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: `3px solid rgba(18,56,89,0.25)`,
                boxShadow: `10px 10px 0 rgba(14,42,68,0.12)`,
              }}
            >
              <Tape
                className="-top-4 left-10"
                rotate={-5}
              />
              <div
                className="text-sm sm:text-base font-semibold"
                style={{ fontFamily: bodyFont, color: "rgba(18,56,89,0.86)" }}
              >
                “Two days. Too many memories.”
              </div>
              <div
                className="mt-2 text-xs sm:text-sm"
                style={{ fontFamily: bodyFont, color: "rgba(18,56,89,0.72)" }}
              >
                Follow our socials for announcements, registrations, and updates.
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div
            className="my-8 h-[2px] w-full rounded-full"
            style={{
              background: "rgba(18,56,89,0.14)",
              border: `1px solid rgba(18,56,89,0.12)`,
            }}
          />

          {/* Middle grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quick links */}
            <div>
              <h3
                className="text-lg font-extrabold"
                style={{
                  fontFamily: headingFont,
                  color: PAPER.ink,
                  letterSpacing: "0.04em",
                }}
              >
                Quick Links
              </h3>
              <div className="mt-3 space-y-2">
                <LinkItem href="/about">About Us</LinkItem>
                <LinkItem href="/#events">Events</LinkItem>
                <LinkItem href="/gallery">Gallery</LinkItem>
                <LinkItem href="/sponsor">Sponsors</LinkItem>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3
                className="text-lg font-extrabold"
                style={{
                  fontFamily: headingFont,
                  color: PAPER.ink,
                  letterSpacing: "0.04em",
                }}
              >
                Contact
              </h3>

              <div className="mt-3 space-y-3">
                <motion.a
                  whileHover={{ x: 6, rotate: -0.2 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  href="mailto:support@texus.io"
                  className="flex items-center gap-3 rounded-2xl p-3"
                  style={{
                    background: "rgba(255,255,255,0.45)",
                    border: `3px solid rgba(18,56,89,0.20)`,
                    boxShadow: `6px 6px 0 rgba(14,42,68,0.10)`,
                    color: PAPER.ink,
                  }}
                >
                  <FaEnvelope />
                  <span
                    style={{
                      fontFamily: bodyFont,
                      color: "rgba(18,56,89,0.86)",
                    }}
                  >
                    support@texus.io
                  </span>
                </motion.a>

                <div
                  className="flex items-start gap-3 rounded-2xl p-3"
                  style={{
                    background: "rgba(255,255,255,0.45)",
                    border: `3px solid rgba(18,56,89,0.20)`,
                    boxShadow: `6px 6px 0 rgba(14,42,68,0.10)`,
                  }}
                >
                  <FaMapMarkerAlt style={{ color: PAPER.ink, marginTop: 2 }} />
                  <div
                    style={{ fontFamily: bodyFont, color: "rgba(18,56,89,0.86)" }}
                  >
                    SRM Institute of Science and Technology,
                    <br />
                    Ramapuram Campus,
                    <br />
                    Chennai - 600089
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <h3
                className="text-lg font-extrabold"
                style={{
                  fontFamily: headingFont,
                  color: PAPER.ink,
                  letterSpacing: "0.04em",
                }}
              >
                Connect
              </h3>

              <div className="mt-3 flex items-center gap-3">
                <IconBtn
                  href="https://www.instagram.com/texus_2k25/"
                  label="Instagram"
                  tint="rgba(121,166,119,0.3)"
                >
                  <FaInstagram size={22} />
                </IconBtn>

                <IconBtn
                  href="https://whatsapp.com/channel/0029VaMS5354Spk9aQF91m3q"
                  label="WhatsApp"
                  tint="rgba(171,191,168,0.3)"
                >
                  <FaWhatsapp size={22} />
                </IconBtn>
              </div>

              <div
                className="mt-4 text-xs sm:text-sm"
                style={{ fontFamily: bodyFont, color: "rgba(18,56,89,0.72)" }}
              >
                Reels, posters, announcements — all there.
              </div>
            </div>

            {/* Policies */}
            <div>
              <h3
                className="text-lg font-extrabold"
                style={{
                  fontFamily: headingFont,
                  color: PAPER.ink,
                  letterSpacing: "0.04em",
                }}
              >
                Policies
              </h3>

              <div className="mt-3 space-y-2">
                <LinkItem href="/privacy">Privacy Policy</LinkItem>
                <LinkItem href="/termsandcondition">Terms & Conditions</LinkItem>
                <LinkItem href="/refundpolicy">Refund Policy</LinkItem>
              </div>
            </div>
          </div>

          {/* Bottom line */}
          <div
            className="mt-10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
            style={{
              background: "rgba(255,255,255,0.45)",
              border: `3px solid rgba(18,56,89,0.20)`,
              boxShadow: `8px 8px 0 rgba(14,42,68,0.10)`,
            }}
          >
            <div
              className="text-xs sm:text-sm"
              style={{ fontFamily: bodyFont, color: "rgba(18,56,89,0.82)" }}
            >
              © 2026 Texus™. All Rights Reserved.
            </div>

            <div
              className="text-xs sm:text-sm font-semibold"
              style={{ fontFamily: bodyFont, color: "rgba(18,56,89,0.82)" }}
            >
              Designed & Developed by the TEXUS Team
            </div>
          </div>
        </PaperPanel>
      </div>
    </footer>
  );
}

export default Footer;
