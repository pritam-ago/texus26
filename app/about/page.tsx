"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import "./about.css";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import Navbar from "@/components/Home/Navbar";
import DemoPage from "../../components/Home/AboutComponent";
import Aboutdept from "@/components/Home/Aboutdept";
import Footer from "@/components/Home/Footer";
import { Montserrat } from "next/font/google";

// Load Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export default function Page() {
  // AOS.init();
  React.useEffect(() => {
    // Remove this effect entirely since we want scrolling
    return () => {};
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Department Heads data
  const departmentHeads = [
    { name: "Dr. J. Sutha", department: "CSE" },
    { name: "Dr. Sankar Ram", department: "AIML & AI" },
    { name: "Dr. J. Shiny Duela", department: "CS & GT" },
    { name: "Dr. A. Umamageswari", department: "BDA & CC" },
    { name: "Dr. Usha Ruby", department: "IoT & CSBS" },
    { name: "Dr. Rajeswari Mukesh", department: "IT" },
    { name: "Dr. N. V. S. Sree Rathna Lakshmi", department: "ECE" },
    { name: "Dr. Srinivasan", department: "EEE" },
    { name: "Dr. Mathivanan", department: "MECH" },
    { name: "Dr. Senthil Velan", department: "Civil" },
    { name: "Dr. Archana Hari", department: "Biotechnology" },
    { name: "Dr. Ushus", department: "Bio Medical" },
    { name: "Dr. Rema", department: "EFL" },
    { name: "Dr. Balamurugan", department: "Physics" },
    { name: "Dr. Shakila Sathish", department: "Maths" },
    { name: "Dr. Helen P Kavitha", department: "Chemistry" },
  ];

  // Split the department heads into two columns
  const leftColumnHeads = departmentHeads.slice(0, 8);
  const rightColumnHeads = departmentHeads.slice(8);

  return (
    <div className={`w-full bg-black ${montserrat.variable}`}>
      <div className="min-h-screen">
        <DemoPage />
      </div>
      <div className="min-h-screen">
        <Aboutdept />
      </div>

      <div className="min-h-screen py-10 md:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-purple-900/10 z-0"></div>

        <motion.div
          className="container mx-auto  px-4 relative top-0 md:top-32 lg:top-0 z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h1
            className="text-3xl md:text-5xl font-montserrat font-bold text-center mb-8 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            variants={itemVariants}
          >
            TEXUS ORGANIZERS
          </motion.h1>

          <div className="flex flex-col items-center max-w-6xl mx-auto">
            <motion.div
              className="mb-10 md:mb-20 relative w-full max-w-[280px] md:max-w-[300px]"
              variants={itemVariants}
            >
              <motion.div
                className="relative overflow-hidden rounded-xl"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/assets/aboutImg/DeanET.webp"
                  alt="Dr. M. Sakthi Ganesh"
                  width={300}
                  height={300}
                  className="rounded-xl shadow-lg object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>

              <motion.div
                className="mt-6 text-center max-w-md mx-auto bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20"
                variants={cardVariants}
              >
                <h2 className="text-xl uppercase text-white mb-1 font-montserrat">
                  Convener
                </h2>
                <h3 className="text-xl text-white mb-2 font-montserrat">
                  Dr. M. Sakthi Ganesh
                </h3>
                <p className="text-gray-300 text-sm font-montserrat">
                  Dean - Engineering and Technology
                  <br />
                  SRMIST, Ramapuram, Chennai
                </p>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 w-full">
              <motion.div
                className="flex flex-col items-center"
                variants={itemVariants}
                custom={1}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="relative overflow-hidden rounded-xl"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/assets/aboutImg/raja1.png"
                    alt="Dr. Raja Kothandaraman"
                    width={280}
                    height={280}
                    className="rounded-xl shadow-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>

                <motion.div
                  className="mt-6 text-center max-w-md bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-blue-500/20"
                  variants={cardVariants}
                >
                  <h2 className="text-xl uppercase text-white mb-1 font-montserrat">
                    Co-Convener
                  </h2>
                  <h3 className="text-xl text-white mb-2 font-montserrat">
                    Dr. Raja Kothandaraman
                  </h3>
                  <p className="text-gray-300 text-sm font-montserrat">
                    Chairperson - School of Computer Science and Engineering
                    <br />
                    SRMIST, Ramapuram, Chennai
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex flex-col items-center"
                variants={itemVariants}
                custom={2}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="relative overflow-hidden rounded-xl"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/assets/aboutImg/vp.webp"
                    alt="Dr. Balika J. Chelliah"
                    width={280}
                    height={280}
                    className="rounded-xl shadow-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>

                <motion.div
                  className="mt-6 text-center max-w-md bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-cyan-500/20"
                  variants={cardVariants}
                >
                  <h2 className="text-xl uppercase text-white mb-1 font-montserrat">
                    Co-Convener
                  </h2>
                  <h3 className="text-xl text-white mb-2 font-montserrat">
                    Dr. Balika J. Chelliah
                  </h3>
                  <p className="text-gray-300 text-sm font-montserrat">
                    Vice Principal - Admin
                    <br />
                    SRMIST, Ramapuram, Chennai
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="min-h-screen py-10 md:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-blue-900/10 z-0"></div>

        <motion.div
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 className="text-3xl md:text-5xl font-montserrat font-bold text-center mb-8 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
            HEADS OF DEPARTMENTS
          </motion.h1>

          <div className="flex flex-col px-4 md:px-12 md:flex-row justify-center gap-8 md:gap-16 lg:gap-24">
            <motion.div
              className="flex-1 max-w-md"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ul className="space-y-6">
                {leftColumnHeads.map((head, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border-b border-blue-500/30 pb-4 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-start">
                      <div className="h-6 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-4 group-hover:h-full transition-all duration-300"></div>
                      <div>
                        <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors font-montserrat">
                          {head.name}
                        </h3>
                        <p className="text-indigo-300 text-sm font-montserrat">
                          {head.department}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="flex-1 max-w-md"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ul className="space-y-6">
                {rightColumnHeads.map((head, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border-b border-blue-500/30 pb-4 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-start">
                      <div className="h-6 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-4 group-hover:h-full transition-all duration-300"></div>
                      <div>
                        <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors font-montserrat">
                          {head.name}
                        </h3>
                        <p className="text-indigo-300 text-sm font-montserrat">
                          {head.department}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
