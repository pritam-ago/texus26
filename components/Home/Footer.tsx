import Image from "next/image";
import Link from "next/link";
import React from "react";

import { FaWhatsapp, FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black  dark border-t border-slate-800">
      <div className="w-full flex max-w-screen-xl  flex-col items-center md:items-start p-4 md:py-8 md:px-16 mx-auto">
        <div className="sm:flex flex-col items-center md:items-start lg:items-center lg:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4 md:justify-center items-center md:mb-6 lg:mb-0 ">
            <Link href="/">
              <Image
                alt="TEXUS"
                fetchPriority="high"
                width="100"
                height="100"
                decoding="async"
                data-nimg="1"
                className="w-28 md:w-32 lg:w-36"
                src={"/assets/texus-color 3.png"}
                style={{ color: "transparent" }}
              />
            </Link>
            <Link target="_blank" href="https://srmrmp.edu.in">
              <Image
                alt="Srm Logo"
                fetchPriority="high"
                width="100"
                height="100"
                decoding="async"
                data-nimg="1"
                className="w-28 md:w-32 lg:w-36"
                src="/assets/deptpics/srm_white_logowebp.webp"
                style={{ color: "transparent" }}
              />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 text-slate-200">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-slate-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#events" className="hover:text-slate-400">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-slate-400">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/sponsor" className="hover:text-slate-400">
                  Sponsors
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              {/* <li className="flex items-center gap-2">
                <FaPhone size={16} />
                +91 94875 93321
              </li> */}
              <li className="flex items-center gap-2">
                <FaEnvelope size={16} />
                support@texus.io
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link
                href="https://www.instagram.com/texus_2k25/"
                target="_blank"
                className="hover:text-slate-400"
              >
                <FaInstagram size={24} />
              </Link>
              <Link
                href="https://whatsapp.com/channel/0029VaMS5354Spk9aQF91m3q"
                target="_blank"
                className="hover:text-slate-400"
              >
                <FaWhatsapp size={24} />
              </Link>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Location</h3>
            <p>
              SRM Institute of Science and Technology,
              <br />
              Ramapuram Campus,
              <br />
              Chennai - 600089
            </p>
          </div>
        </div>

        <hr className="my-6 border-slate-800 sm:mx-auto lg:my-8" />

        <div className="flex flex-col md:flex-row gap-4 items-center text-slate-200 text-xs justify-between pt-2">
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 md:text-center lg:text-start">
            <span>© 2026 Texus™. All Rights Reserved.</span>
            <div className="flex items-center md:justify-between gap-2">
              <Link href={'/privacy'} className="hover:underline">
              <p>Privacy Policy</p>
              </Link>
              <Link href={'/termsandcondition'} className="hover:underline">
              <p className="hover:underline">Terms and Conditions</p>
              </Link>
              <Link href={'/refundpolicy'} className="hover:underline">
              <p className="hover:underline">Refund Policy</p>
              </Link>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-2 md:text-center lg:text-start">
            <p>
              Powered by{" "}
              <a className="hover:underline" href="https://nextjs.org">
                Next.js
              </a>
              .
            </p>
            <p>
              Styled with{" "}
              <a className="hover:underline" href="https://tailwindcss.com">
                Tailwind CSS
              </a>
              ,{" "}
              <a className="hover:underline" href="https://ui.shadcn.com">
                Shadcn UI
              </a>{" "}
              &amp;{" "}
              <a className="hover:underline" href="https://ui.aceternity.com">
                Aceternity UI
              </a>
            </p>
          </div>
          <span className="md:text-center lg:text-start">
            Designed and Developed by the Texus Team
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
