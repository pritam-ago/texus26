import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import TexusLogo from "../../../public/assets/texus-color 3.png";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check initially
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    const handleScrollEffect = () => {
      // Remove isMobile check to allow scroll effect on mobile
      if (!isMobile && window.scrollY > 100) {
        setIsScrolled(true);
        setIsExpanded(false);
      } else if (!isMobile && window.scrollY === 0) {
        setIsScrolled(false);
        setIsExpanded(true);
      }

      // if (isMobile && window.scrollY > 100) {
      //   setIsScrolled(true);
      // } else if (isMobile && window.scrollY === 0) {
      //   setIsScrolled(false);
      // }
    };

    window.addEventListener("scroll", handleScrollEffect);
    return () => window.removeEventListener("scroll", handleScrollEffect);
  }, [isMobile]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#aboutus" },
    { name: "Events", href: "/#events" },
    { name: "Gallery", href: "/gallery" },
    { name: "Sponsors", href: "/#sponsors" },
  ];

  const handleScroll = (href: string): void => {
    // Remove leading slashes and hash symbol
    const targetId = href.replace(/^\//, "").replace(/^#/, ""); // Remove any leading slash and #
    const element = document.getElementById(targetId);

    if (!element) {
      return;
    }

    // If the mobile menu is open, wait for it to close before scrolling
    if (open) {
      setOpen(false);
      setTimeout(() => {
        console.log(`Scrolling to ${targetId} after closing the menu.`);
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300); // Wait for animation to complete
    } else {
      console.log(`Scrolling to ${targetId} immediately.`);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    // Check if the click target is the menu button or its parent
    const isMenuButton = (e.target as HTMLElement).closest('[role="button"]');
    if (isMenuButton) {
      return; // Don't trigger expand animation if clicking menu button
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <motion.div
        initial={{ y: -100, scale: 0.8, borderRadius: "50px" }}
        animate={{
          y: 0,
          scale: isMobile ? 1 : isScrolled ? (isExpanded ? 1 : 0.6) : 1,
          borderRadius: isMobile
            ? "0px"
            : isScrolled
            ? isExpanded
              ? "0px"
              : "50px"
            : "0px",
          width: isMobile
            ? "100%"
            : isScrolled
            ? isExpanded
              ? "100%"
              : "80px"
            : "100%",
          height: isMobile
            ? "auto"
            : isScrolled
            ? isExpanded
              ? "auto"
              : "80px"
            : "auto",
          left: isMobile
            ? "0%"
            : isScrolled
            ? isExpanded
              ? "0%"
              : "20px"
            : "0%",
          top: isMobile
            ? "0px"
            : isScrolled
            ? isExpanded
              ? "0px"
              : "20px"
            : "0px",
          translateX: 0,
          transformOrigin: "top center",
        }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        onClick={!isMobile && isScrolled ? handleExpandClick : undefined}
        className={`z-50 fixed transition-all duration-200 ${
          !isMobile ? "cursor-pointer " : ""
        }
          ${
            isMobile && isScrolled
              ? "bg-black/50 backdrop-blur-md flex justify-between items-center p-6"
              : isScrolled
              ? isExpanded
                ? "bg-black/50 backdrop-blur-md flex justify-between items-center p-6"
                : "bg-black/50 rounded-full p-0 flex items-center justify-center"
              : "bg-transparent flex justify-between items-center p-6"
          }
          ${isScrolled && !isExpanded && !isMobile ? "hover:scale-110" : ""}
        `}
      >
        {!isScrolled || isExpanded || isMobile ? (
          <motion.div
            className="w-full flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <div className="flex items-center">
              <Image
                src={TexusLogo}
                alt="Texus Logo"
                className="h-8 md:h-12 w-auto"
              />
            </div>

            <nav className="hidden md:flex justify-center items-center space-x-8">
              {navItems.map((item, i) => (
                <div key={i} className="relative group">
                  <Link href={item.href}>
                    <Button
                      className="text-white bg-transparent hover:text-white/80 hover:bg-transparent"
                      onClick={() => handleScroll(item.href)}
                    >
                      <h2 className="text-[#FFC1EC] relative">
                        {item.name}
                        <span className="absolute left-0 bottom-[-2px] h-0.5 w-full bg-[#FFC1EC] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                      </h2>
                    </Button>
                  </Link>
                </div>
              ))}
            </nav>

            <div className="hidden md:block">
              <Link href="/#aboutus">
                <Button
                  onClick={() => handleScroll("/#aboutus")}
                  variant="outline"
                  className="text-[#FFC1EC] border-[#FFC1EC]"
                >
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetTitle></SheetTitle>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-10">
                    {navItems.map((item, i) => (
                      <Button
                        key={i}
                        variant="ghost"
                        className="w-full justify-start font-montserrat"
                        onClick={() => handleScroll(item.href)}
                      >
                        {item.name}
                      </Button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Menu className="h-6 w-6 text-white" />
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Navbar;
