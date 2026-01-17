"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import TexusLogo from "../../public/assets/texus-color 3.png";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { signInWithGoogle, signOut } from "@/lib/auth";
import { createClient } from "@/supabase/client";
import { FaGoogle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [hasScrolled, setHasScrolled] = React.useState(false);
  const supabase = createClient();

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
      const currentScrollY = window.scrollY;

      // Set background state based on scroll position
      setHasScrolled(currentScrollY > 100);

      // Determine if scrolling up or down
      if (currentScrollY > lastScrollY) {
        // Scrolling down - hide the navbar
        setIsHidden(true);
      } else {
        // Scrolling up - show the navbar
        setIsHidden(false);
      }

      // Update the last scroll position
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScrollEffect);
    return () => window.removeEventListener("scroll", handleScrollEffect);
  }, [lastScrollY]);

  React.useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error("Error getting session:", error);
        setLoading(false);
      }
    };

    // Call getInitialSession
    getInitialSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/#events" },
    { name: "Global Summit", href: "/nilgiris" },
    { name: "Gallery", href: "/gallery" },
    { name: "Sponsors", href: "/sponsor" },
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

  const renderAuthButton = () => {
    if (loading) {
      return <Skeleton className="h-10 w-[160px]" />;
    }
    if (!user) {
      return (
        <Button
          onClick={signInWithGoogle}
          variant="outline"
          className="text-[#FFC1EC] border-[#FFC1EC] flex items-center gap-2"
        >
          <FaGoogle />
          Login with Google
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.user_metadata?.avatar_url || ""}
                alt={user.user_metadata?.full_name || ""}
              />
              <AvatarFallback>
                {user.user_metadata?.full_name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.user_metadata?.full_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem className="text-[#FFC1EC] hover:bg-[#FFC1EC]/10 focus:bg-[#FFC1EC]/10 cursor-pointer">
            <Link href="/profile" className="w-full">
              View Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={signOut}
            className="text-[#FFC1EC] hover:bg-[#FFC1EC]/10 focus:bg-[#FFC1EC]/10 cursor-pointer"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderMobileAuthButton = () => {
    if (loading) {
      return (
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-[76px] w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }
    if (!user) {
      return (
        <Button
          variant="outline"
          className="w-full justify-start text-[#FFC1EC] border-[#FFC1EC] flex items-center gap-2"
          onClick={signInWithGoogle}
        >
          <FaGoogle />
          Login with Google
        </Button>
      );
    }

    return (
      <div className="flex  flex-col gap-2 w-full">
        <div className="flex items-center gap-2 p-4 mb-2 border border-[#FFC1EC] rounded-lg bg-black/20">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.user_metadata?.avatar_url || ""}
              alt={user.user_metadata?.full_name || ""}
            />
            <AvatarFallback>
              {user.user_metadata?.full_name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col w-full">
            <span className="font-medium text-[#FFC1EC]">
              {user.user_metadata?.full_name}
            </span>
            <p className="text-xs text-[#FFC1EC]/70 truncate">{user.email}</p>
          </div>
        </div>
        <Link href="/profile" className="w-full">
          <Button
            variant="outline"
            className="w-full justify-start text-[#FFC1EC] border-[#FFC1EC]"
          >
            View Profile
          </Button>
        </Link>
        <Button
          variant="outline"
          className="w-full justify-start text-[#FFC1EC] border-[#FFC1EC]"
          onClick={signOut}
        >
          Logout
        </Button>
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{
          y: isHidden ? -100 : 0,
          background: hasScrolled ? "rgba(0, 0, 0, 0.5)" : "transparent",
          backdropFilter: hasScrolled ? "blur(8px)" : "none",
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="z-50 fixed w-full transition-all duration-200 flex justify-between items-center p-6"
      >
        <motion.div
          className="w-full flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <div className="flex items-center">
            <Image
              src={"/assets/texus-color 3.png"}
              alt="Texus Logo"
              width={800}
              height={267}
              className="h-8 md:h-12 w-auto"
              onClick={() => router.push("/")}
            />
            {/* <Image
              src={"/assets/srm-white.png"}
              alt="Texus25 Logo"
              width={800}
              height={267}
              className="scale-50 object-cover h-9 w-auto md:h-24 z-40"
              priority
            /> */}
          </div>

          <nav className="hidden md:flex justify-center items-center space-x-8">
            {navItems.map((item, i) => (
              <div key={i} className="relative group">
                <Link href={item.href}>
                  <Button
                    className="text-white bg-transparent hover:text-white/80 hover:bg-transparent"
                    onClick={() => handleScroll(item.href)}
                  >
                    <h2 className="text-[#FFC1EC] relative font-montserrat font-normal">
                      {item.name}
                      <span className="absolute left-0 bottom-[-2px] h-0.5 w-full bg-[#FFC1EC] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </h2>
                  </Button>
                </Link>
              </div>
            ))}
          </nav>

          <div className="hidden md:block">{renderAuthButton()}</div>
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetTitle></SheetTitle>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] border-[#FFC1EC] bg-black/50 backdrop-blur-md"
              >
                <nav className="flex flex-col gap-4 mt-10">
                  {navItems.map((item, i) => (
                    <Link key={i} href={item.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-montserrat"
                        onClick={() => {
                          handleScroll(item.href);
                          setOpen(false);
                        }}
                      >
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </nav>
                <div className="absolute bottom-6 left-6 right-6">
                  {renderMobileAuthButton()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Navbar;
