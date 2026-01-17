import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

const departmentData = [
  {
    title: "SRM IST",
    desc: "SRM Institute of Science and Technology, India's educational powerhouse with over 20,000+ students, offers diverse programs in engineering, management, medicine, and humanities. Its dynamic curriculum and global collaborations promise top-tier education. SRMIST's impressive placement record, featuring companies like Adobe, speaks to its excellence. Accredited with an 'A++' grade by NAAC, SRMIST fosters innovation and attracts students from across India.",
    image1: "/assets/deptpics/srmist1.webp",
    image2: "/assets/deptpics/srmist2.webp",
    image3: "/assets/deptpics/srmist3.webp",
  },
  {
    title: "Computer Science Engineering",
    desc: "The department of Computer Science and Engineering (CSE) at SRM Institute of Science and Technology was established in the year 2004 with the aim of imparting quality education to students and bring out the best in them. The key goal of the department is to provide best IT infrastructure, world class learning and research environment, adopt industry practices through industry collaborations and inculcate moral and ethical values. With students hailing from all States and union territories of India, the department was established to meet the demand for well-qualified computer professionals.",
    image1: "/assets/deptpics/cse1.png",
    image2: "/assets/deptpics/cse2.png",
    image3: "/assets/deptpics/cse3.png",
  },
  {
    title: "Mechanical Engineering",
    desc: "The Department of Mechanical Engineering is one of the pioneering departments of SRM IST Established in 2008. The present faculty strength is 33 in which 25 Faculties are Ph.D holders and all other faculties pursuing Ph.D. More than 300 Research papers have been published in international or national journals and conferences.",
    image1: "/assets/deptpics/mech1.png",
    image2: "/assets/deptpics/mech2.png",
    image3: "/assets/deptpics/mech3.png",
  },
  {
    title: "Biomedical Engineering",
    desc: "Established in 2020, The department offers a world-class setting for cross-disciplinary biomedical engineering research and collaborate with medical experts to create technologies that enhance and save lives by fusing a wide range of engineering disciplines with human biology and medicine. The Institute's primary research goals are to create innovative medical devices, systems, and technologies that can significantly improve healthcare, as well as to use new engineering technologies in clinical settings.",
    image1: "/assets/deptpics/biomed1.png",
    image2: "/assets/deptpics/biomed2.png",
    image3: "/assets/deptpics/biomed3.png",
  },
  {
    title: "Civil Engineering",
    desc: "The Department of Civil Engineering had its inception at the Ramapuram Campus in 2009-10. The department offers 4 Years UG Programme in B.Tech Civil Engineering and 2 Years PG Programme in M.Tech Structural Engineering & M Tech - Construction Engineering & Management. The Department is aiming at the development of student community to face the future world with, latest technical knowledge through research, good leadership qualities, industry-institution interaction and spirit of competence. The department is equipped with faculty members imparting high quality of discipline and engineering education.",
    image1: "/assets/deptpics/civil1.png",
    image2: "/assets/deptpics/civil2.png",
    image3: "/assets/deptpics/civil3.png",
  },
  {
    title: "Electronics and Communication Engineering",
    desc: "The Department of Electronics and Communication Engineering was established in the year 2004. The department offers a four year B.Tech Degree in Electronics & Communication Engineering, Electronics & Computer Engineering and Biomedical Engineering.",
    image1: "/assets/deptpics/ece1.png",
    image2: "/assets/deptpics/ece2.png",
    image3: "/assets/deptpics/ece3.png",
  },
  {
    title: "Electrical and Electronics Engineering",
    desc: "The Electrical & Electronics Engineering department at the Ramapuram campus was established in 2009. The sheer hard work and enthusiasm of the faculty and students of the department has helped in making it one of the best departments on campus. The zeal and fervour with which the department is working will surely help it to achieve further success.",
    image1: "/assets/deptpics/eee1.png",
    image2: "/assets/deptpics/eee2.png",
    image3: "/assets/deptpics/eee3.png",
  },
  {
    title: "Biotechnology",
    desc: "Amalgamation of biology and technology is Biotechnology, a fast growing and evolving field in science. Biotechnology scenario in the world is changing rapidly and dynamically. To prepare the students for this competitive field of science, the curriculum and syllabi are crafted to impart current advancement and understanding about Biotechnology along with basic knowledge about research and thus, provide a substantial foundation of Biotechnology in our students. The department constantly provides the latest developments in the fields of pharmaceutical, bio-pharmaceutical, and drug discovery sectors, healthcare, diagnostic and therapeutic, plant and animal sciences, and environmental sectors along with the core subjects.",
    image1: "/assets/deptpics/biotech1.png",
    image2: "/assets/deptpics/biotech2.png",
    image3: "/assets/deptpics/biotech3.png",
  },
  {
    title: "Information Technology",
    desc: "The Department of Information Technology at the SRMIST, Ramapuram Campus was established in the year 2005. The department offers the programmes B.Tech IT and Ph.D (FT & PT). The undergraduate program aims to prepare the students for the challenges that they will face as professionals in IT and ITES industries. As an academic discipline, B.Tech IT focuses on imparting education to the students that will help them to meet the needs of users through selection, creation, application, integration and administration of computing technologies",
    image1: "/assets/deptpics/it1.png",
    image2: "/assets/deptpics/it2.png",
    image3: "/assets/deptpics/it3.png",
  },
  {
    title: "Department of English",
    desc: "The Department of English, established in the year 2004, was later extended to include other foreign languages such as French, Japanese and German. The department comprises of 14 staff members catering to the students of Engineering & Technology. The department envisions moulding every student to reach a level of fluency in English which is adequate enough to meet out the global standards needed for coveted assignments.",
    image1: "/assets/deptpics/eng1.webp",
    image2: "/assets/deptpics/eng2.webp",
    image3: "/assets/deptpics/eng3.webp",
  },
  {
    title: "Department of Mathematics",
    desc: "The Department of Mathematics, SRMIST, Ramapuram; was established in the year 2004. It consists of 51 highly qualified faculty members which include 34 Doctorates, 22 Research Scholars and has 14 recognized Ph.D. supervisors.  The faculty members in the department are activity involved in research, teaching- learning and public outreach. The Department has a cohesive group of faculty members in the fields of Analysis, Differential Equations, Fluid Dynamics, Fuzzy set theory, Graph theory, Reliability theory, Rough set theory and are actively engaged in wide-ranging areas of research in Mathematics and allied subjects. The faculty members have published 250 papers in indexed journals in the last 5 years.  They are keeping their knowledge updated by attending and conducting relevant conferences, seminars and workshops.",
    image1: "/assets/deptpics/math1.webp",
    image2: "/assets/deptpics/math2.webp",
    image3: "/assets/deptpics/math3.webp",
  },
  {
    title: "Department of Physics",
    desc: "The Department of Physics at SRM IST, Ramapuram campus, was established in 2004. The department offers a range of courses for B.Tech students, including basic physical science courses with laboratory work for all branches in the first and second semesters. Additionally, the department provides open elective courses for higher semester B.Tech students. It also offers a Ph.D. program and an Engineering Physics course with laboratory work for B.Tech lateral entry students.",
    image1: "/assets/deptpics/phy1.webp",
    image2: "/assets/deptpics/phy2.webp",
    image3: "/assets/deptpics/phy3.webp",
  },
  {
    title: "Department of Chemistry",
    desc: "The Department of Chemistry at the Ramapuram campus focuses on applying chemistry to engineering, emphasizing quality teaching, research, and consultancy. With highly qualified faculty, the department has secured research funding, including one project from DST-SERB and four from SRM IST, totaling over 25 Lakhs. It offers a Ph.D. program, with active research by scholars. In the past five years, faculty have published 80 papers in SCI/SCOPUS journals. The department also collaborates with recognized institutions and R&D labs for research in areas like organic synthesis, nanomaterials, theoretical chemistry, effluent treatment, and more.",
    image1: "/assets/deptpics/chem1.webp",
    image2: "/assets/deptpics/chem2.webp",
    image3: "/assets/deptpics/chem3.webp",
  },
  {
    title: "Department of Architecture",
    desc: "The School of Environment Architecture & Design (SEAD) was rechristened in 2015 by Padmashri B V Doshi, who is also a significant figure on our advisory board. SEAD offers a platform to cultivate future architects who understand the importance of their role and responsibility in shaping our cities and nation. The school firmly believes that design has the potential to positively impact our lives in countless ways. At the same time, it emphasizes the importance of creating structures that are sensitive to their environment and ecology, especially in today's world of depleting resources.",
    image1: "/assets/deptpics/arch1.webp",
    image2: "/assets/deptpics/arch2.webp",
    image3: "/assets/deptpics/arch3.webp",
  },
];

const hexagonStyles = `
  .hexagon-group {
    position: relative;
    width: 300px;
    height: 300px;
    transition: all 0.3s ease;
    padding: 30px;
  }

  .hexagon-container {
    width: 200px;
    height: 200px;
    position: absolute;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 4px 10px rgba(147, 51, 234, 0.3));
  }

  @media (max-width: 1024px) {
    .hexagon-group {
      width: 250px;
      height: 250px;
      padding: 25px;
    }
    .hexagon-container {
      width: 170px;
      height: 170px;
    }
  }

  @media (max-width: 640px) {
    .hexagon-group {
      width: 200px;
      height: 200px;
      padding: 20px;
    }
    .hexagon-container {
      width: 140px;
      height: 140px;
    }
    .hexagon-container.top-left,
    .hexagon-container.top-right {
      width: 110px !important;
      height: 110px !important;
    }
  }

  .hexagon-container.main {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    animation: float 4s ease-in-out infinite;
    filter: drop-shadow(0 8px 16px rgba(236, 72, 153, 0.4));
  }

  .hexagon-container.top-left {
    top: 0;
    left: -25%;
    transform: translateY(-20%);
    animation: floatTopLeft 4s ease-in-out infinite;
  }

  .hexagon-container.top-right {
    top: 0;
    right: -25%;
    transform: translateY(-20%);
    animation: floatTopRight 4s ease-in-out infinite;
  }

  .hexagon {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .hexagon::before {
    content: '';
    position: absolute;
    inset: -2px;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2));
    filter: blur(8px);
    z-index: -1;
  }

  .hexagon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    transition: all 0.5s ease;
    animation: pulse 2s ease-in-out infinite;
    box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
  }

  @keyframes float {
    0%, 100% {
      transform: translate(-50%, -50%);
    }
    50% {
      transform: translate(-50%, -60%);
    }
  }

  @keyframes floatTopLeft {
    0%, 100% {
      transform: translate(0, -20%);
    }
    50% {
      transform: translate(0, -30%);
    }
  }

  @keyframes floatTopRight {
    0%, 100% {
      transform: translate(0, -20%);
    }
    50% {
      transform: translate(0, -30%);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const fullscreenVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.4,
    },
  }),
};

const Aboutdept = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [[fullscreenPage, fullscreenDirection], setFullscreenPage] = useState([
    0, 0,
  ]);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const paginate = useCallback(
    (newDirection: number) => {
      setPage([page + newDirection, newDirection]);
    },
    [page]
  );

  const currentIndex =
    ((page % departmentData.length) + departmentData.length) %
    departmentData.length;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isHovered || isMobile) {
      timer = setInterval(() => {
        paginate(1);
      }, 2000);
    }

    return () => clearInterval(timer);
  }, [isHovered, page, isMobile, paginate]);

  const handleImageClick = (imageSrc: string, imageIndex: number) => {
    if (!isMobile) {
      setSelectedImage(imageSrc);
      setFullscreenPage([imageIndex, 0]);
    }
  };

  const handleFullscreenNext = () => {
    setFullscreenPage([fullscreenPage + 1, 1]);
  };

  const handleFullscreenPrev = () => {
    setFullscreenPage([fullscreenPage - 1, -1]);
  };

  const currentFullscreenIndex = ((fullscreenPage % 3) + 3) % 3;
  const currentImages = [
    departmentData[currentIndex].image1,
    departmentData[currentIndex].image2,
    departmentData[currentIndex].image3,
  ];

  return (
    <>
      <style jsx>{hexagonStyles}</style>
      <div
        className="relative min-h-screen w-full overflow-hidden flex justify-center items-center"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <Image
          src="/assets/aboutdept.png"
          alt="bg"
          width={1920}
          height={1080}
          loading="eager"
          className="absolute object-cover object-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-25 -z-20"
        />

        <div className="max-w-[1200px] py-20 w-full mx-auto relative px-4 sm:px-8 lg:px-12">
          <div className="absolute z-20 left-2 sm:left-0 lg:-left-16 top-1/2 -translate-y-1/2">
            <button
              onClick={() => paginate(-1)}
              className="group relative p-2 sm:p-3 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 backdrop-blur-sm transition-all duration-300 border border-purple-500/30"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-300 group-hover:text-purple-200 transition-colors" />
            </button>
          </div>

          <div className="absolute z-20 right-2 sm:right-0 lg:-right-16 top-1/2 -translate-y-1/2">
            <button
              onClick={() => paginate(1)}
              className="group relative p-2 sm:p-3 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 backdrop-blur-sm transition-all duration-300 border border-purple-500/30"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-300 group-hover:text-purple-200 transition-colors" />
            </button>
          </div>

          <div className="min-h-screen w-full relative flex items-center py-20 sm:py-16 lg:py-0">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 flex items-center"
              >
                <Card className="w-full h-auto overflow-hidden border-0 bg-transparent">
                  <CardContent className="p-4 sm:p-6 lg:px-8 lg:py-20">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-16">
                      <div className="w-full lg:w-[45%] space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl  font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                          {departmentData[currentIndex].title}
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg leading-relaxed text-white/90 max-w-2xl mx-auto lg:text-justify lg:mx-0">
                          {departmentData[currentIndex].desc}
                        </p>
                      </div>
                      <div className="w-full lg:w-[45%] flex items-center justify-center py-4 sm:py-8 lg:py-0">
                        <div className="hexagon-group scale-[0.65] sm:scale-75 md:scale-90 lg:scale-100">
                          <div className="hexagon-container main">
                            <div
                              className="hexagon cursor-pointer"
                              onClick={() =>
                                handleImageClick(
                                  departmentData[currentIndex].image1,
                                  0
                                )
                              }
                            >
                              <Image
                                width={1920}
                                height={1080}
                                src={departmentData[currentIndex].image1}
                                alt={departmentData[currentIndex].title}
                                className="w-full h-full object-cover absolute top-0 left-0"
                              />
                            </div>
                          </div>
                          <div className="hexagon-container top-left">
                            <div
                              className="hexagon cursor-pointer"
                              onClick={() =>
                                handleImageClick(
                                  departmentData[currentIndex].image2,
                                  1
                                )
                              }
                            >
                              <Image
                                width={1920}
                                height={1080}
                                src={departmentData[currentIndex].image2}
                                alt={departmentData[currentIndex].title}
                                className="w-full h-full object-cover absolute top-0 left-0"
                              />
                            </div>
                          </div>
                          <div className="hexagon-container top-right">
                            <div
                              className="hexagon cursor-pointer"
                              onClick={() =>
                                handleImageClick(
                                  departmentData[currentIndex].image3,
                                  2
                                )
                              }
                            >
                              <Image
                                width={1920}
                                height={1080}
                                src={departmentData[currentIndex].image3}
                                alt={departmentData[currentIndex].title}
                                className="w-full h-full object-cover absolute top-0 left-0"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedImage(null);
            }}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white z-50 p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={handleFullscreenPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <AnimatePresence initial={false} custom={fullscreenDirection}>
                <motion.div
                  key={fullscreenPage}
                  custom={fullscreenDirection}
                  variants={fullscreenVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute w-full h-full flex items-center justify-center"
                >
                  <div className="relative max-w-[90vw] max-h-[90vh]">
                    <Image
                      src={currentImages[currentFullscreenIndex]}
                      alt="Fullscreen view"
                      width={1920}
                      height={1080}
                      className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={handleFullscreenNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentFullscreenIndex === index
                      ? "bg-white w-4"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Aboutdept;
