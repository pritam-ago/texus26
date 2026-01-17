import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const Proshowartists = () => {
  const artists = [
    {
      name: "DJ RUBZ",
      bg: "/assets/proshow/djrubzbg.png",
      image: "/assets/proshow/DJ Rubz.png",
      showLogo: true,
      className: "",
    },
    {
      name: "DJ HARRY D CRUZ",
      bg: "/assets/proshow/harrybg.png",
      image: "/assets/proshow/harryimg.png",
      showLogo: true,
      className: "",
    },
    {
      name: "DJ CANDICE",
      bg: "/assets/proshow/olarasbg.png",
      image: "/assets/proshow/Candice.png",
      showLogo: true,
      className: "",
    },
    {
      name: "DJ SPARROW",
      bg: "/assets/proshow/djsbg.png",
      image: "/assets/DJ-Sparrow123.png",
      showLogo: false,
      className: "",
    },
  ];

  return (
    <div
      id="proshow"
      className="bg-gradient-to-tr from-black via-purple-950/30 to-black min-h-screen pb-16 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-10 left-10 w-64 h-64 rounded-full bg-pink-600/30 blur-3xl animate-float"></div>
        <div
          className="absolute top-1/3 right-20 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl"
          style={{ animation: "float 8s ease-in-out infinite 1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl"
          style={{ animation: "float 7s ease-in-out infinite 2s" }}
        ></div>
      </div>

      {/* Day 1 Section */}
      <div className="w-full justify-center items-center relative z-10 pt-8 sm:pt-12 px-4">
        <div className="flex w-full flex-col justify-center items-center">
          <div className="overflow-hidden relative my-4 sm:my-8">
            <h1 className="font-montserrat font-bold text-3xl sm:text-4xl md:text-5xl p-2 sm:p-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-center relative z-10 mb-2 sm:mb-4 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">
              DAY 1 - 28TH MARCH 2025
            </h1>
            <div
              className="h-0.5 w-full sm:w-3/4 mx-auto bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse"
              style={{ animationDuration: "3s" }}
            ></div>
          </div>

          <div className="w-full relative group transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/30 rounded-lg mx-auto max-w-6xl overflow-hidden transform perspective-1000 hover:rotate-y-3">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 z-10"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-80 transition-opacity duration-700 bg-gradient-to-r from-pink-500/20 to-purple-500/20 z-5"></div>
            <Image
              src={"/assets/proshow/Masala Coffee.png"}
              alt={"Masala Coffee"}
              width={1920}
              height={1080}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-20 bg-gradient-to-t from-black/90 to-transparent transform translate-y-0 group-hover:translate-y-0 transition-transform duration-500">
              <h2 className="text-2xl sm:text-3xl md:text-5xl text-white font-bold mb-1 sm:mb-3 font-montserrat tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 transition-all duration-500">
                Masala Coffee
              </h2>
              <p className="text-xs font-montserrat sm:text-base text-gray-300 max-w-2xl transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                Experience the fusion of Indian folk with contemporary music
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Day 2 Section */}
      <div className="w-full justify-center items-center mt-12 sm:mt-16 md:mt-20 relative z-10 px-4">
        <div className="flex w-full flex-col justify-center items-center">
          <div className="overflow-hidden relative my-4 sm:my-8">
            <h1 className="font-montserrat font-bold text-3xl sm:text-4xl md:text-5xl p-2 sm:p-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-center relative z-10 mb-2 sm:mb-4">
              DAY 2 - 29TH MARCH 2025
            </h1>
            <div className="h-0.5 w-full sm:w-3/4 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </div>

          <div className="flex justify-center items-center w-full mb-6 sm:mb-8 md:mb-10 relative group">
            <Image
              src={"/assets/proshow/sun burn logo.png"}
              alt="sunburnlogo"
              width={200}
              height={200}
              className="w-32 sm:w-40 md:w-auto transition-all duration-500 hover:scale-110"
            />
            <div className="absolute -bottom-6 w-48 sm:w-64 h-8 sm:h-12 bg-purple-500/20 blur-xl rounded-full"></div>
          </div>

          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {artists.map((artist, index) => (
                <div
                  key={index}
                  className="relative w-full h-[300px] xs:h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[650px] overflow-hidden group cursor-pointer rounded-lg border border-purple-500/10 hover:border-purple-500/70 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/40 "
                >
                  {/* Background with blur effect on hover */}
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={artist.bg}
                      alt={`${artist.name} background`}
                      width={1920}
                      height={1080}
                      className="w-full h-full object-cover transition-all duration-700 ease-out filter group-hover:blur-sm group-hover:brightness-75 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 group-hover:opacity-70 transition-opacity duration-500"></div>
                  </div>

                  {/* Artist Name with responsive sizing */}
                  <div className="absolute top-4 right-2 xs:right-4 md:right-6 lg:right-8 w-0 h-0 z-20">
                    <div className="relative py-2 md:py-4">
                      <h2
                        className="font-montserrat font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white absolute transform origin-top-left rotate-90 whitespace-nowrap ml-2 xs:ml-4
                         transition-all duration-500 ease-in-out group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-blue-500 group-hover:translate-x-2 drop-shadow-[0_5px_15px_rgba(0,0,0,0.7)]"
                      >
                        {artist.name}
                      </h2>
                    </div>
                  </div>

                  {/* Artist Image with enhanced zoom effect */}
                  <div className="absolute -bottom-28 md:-bottom-10">
                    <div className="w-full overflow-hidden">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        width={1920}
                        height={1080}
                        className={cn(
                          artist.className,
                          "w-72 h-full md:w-full md:h-full object-cover transition-transform duration-700 ease-out scale-75 md:scale-95 group-hover:scale-100 drop-shadow-2xl"
                        )}
                      />
                    </div>
                  </div>

                  {/* Glowing Sunburn logo with responsive sizing */}
                  {artist.showLogo && (
                    <div className="absolute bottom-2 xs:bottom-2 sm:bottom-3 md:bottom-4 left-2 xs:left-2 sm:left-3 md:left-4 z-10 transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-125">
                      <Image
                        src={"/assets/proshow/sun burn logo.png"}
                        alt="sunburnlogo"
                        width={1920}
                        height={1080}
                        className="w-8 h-8 xs:w-10 xs:h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain opacity-90 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proshowartists;
