"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Calendar,
  Info,
  Globe,
  Image as ImageIcon,
  Handshake,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { signInWithGoogle, signOut } from "@/lib/auth";
import { createClient } from "@/supabase/client";
import type { User } from "@supabase/supabase-js";
import { FaGoogle } from "react-icons/fa";

const GRADIENT = "from-purple-500 via-pink-500 to-red-500";

type NavItem = {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", name: "HOME", href: "/", icon: Home },
  { id: "events", name: "EVENTS", href: "/events", icon: Calendar },
  { id: "sponsors", name: "SPONSORS", href: "/events/sponsors", icon: Handshake },
  { id: "about", name: "ABOUT", href: "/events/about", icon: Info },
];

export default function EventsNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string>("events");
  const [isMobile, setIsMobile] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const supabase = createClient();

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  React.useEffect(() => {
    const syncActiveFromUrl = () => {
      const exact = NAV_ITEMS.find((i) => i.href === pathname);
      if (exact) {
        setActiveId(exact.id);
        return;
      }

      if (pathname === "/") setActiveId("home");
    };

    syncActiveFromUrl();
  }, [pathname]);

  React.useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const go = (href: string, id: string) => {
    setActiveId(id);
    setMobileMenuOpen(false);
    router.push(href);
  };

  const DesktopAuth = () => {
    if (loading) return <Skeleton className="h-9 w-[110px] rounded-xl" />;

    if (!user) {
      return (
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-thuast text-sm tracking-wider transition-all duration-300 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 hover:border-pink-500/50 hover:from-purple-500/30 hover:to-pink-500/30"
        >
          <FaGoogle />
          Login
        </button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative h-9 w-9 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-purple-400">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={user.user_metadata?.avatar_url || ""}
                alt={user.user_metadata?.full_name || ""}
              />
              <AvatarFallback className="bg-black/50 text-white">
                {user.user_metadata?.full_name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 bg-black/90 border-gray-700 text-white">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.user_metadata?.full_name}
              </p>
              <p className="text-xs leading-none text-white/60">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem className="cursor-pointer hover:bg-purple-500/20">
            <Link href="/profile" className="w-full">
              View Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={signOut} className="cursor-pointer hover:bg-purple-500/20">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const MobileAuth = () => {
    if (loading) {
      return (
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      );
    }

    if (!user) {
      return (
        <div className="w-full flex justify-center">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-thuast tracking-wider transition-all duration-300 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50"
          >
            <FaGoogle />
            Login with Google
          </button>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col items-center gap-2">
        <Link href="/profile" className="w-full">
          <Button
            variant="outline"
            className="w-full justify-center rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-white hover:bg-purple-500/30 font-thuast"
          >
            View Profile
          </Button>
        </Link>
        <div className="w-full">
          <Button
            variant="outline"
            className="w-full justify-center rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-white hover:bg-purple-500/30 font-thuast"
            onClick={signOut}
          >
            Logout
          </Button>
        </div>
      </div>
    );
  };

  return (
    <motion.nav
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 border-b border-gray-800 bg-black/40 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setActiveId("home")}
            className="flex items-center gap-3"
          >
            <Image
              src="/assets/texus-color 3.png"
              alt="TEXUS Logo"
              width={150}
              height={60}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => go(item.href, item.id)}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-thuast text-sm tracking-wider transition-all duration-300"
                  style={{
                    background: isActive
                      ? "linear-gradient(to right, rgb(168 85 247 / 0.2), rgb(236 72 153 / 0.2))"
                      : "transparent",
                    border: isActive ? "1px solid rgb(168 85 247 / 0.5)" : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background =
                        "linear-gradient(to right, rgb(168 85 247 / 0.1), rgb(236 72 153 / 0.1))";
                      e.currentTarget.style.borderColor = "rgb(168 85 247 / 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  <Icon className="w-4 h-4 text-white/70" />
                  <span
                    className={`${
                      isActive
                        ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:block">
            <DesktopAuth />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-800 bg-black/60 backdrop-blur-md"
          >
            <div className="px-4 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeId === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => go(item.href, item.id)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-700 bg-black/40 transition-all duration-300 hover:border-purple-500/50"
                      style={
                        isActive
                          ? {
                              borderColor: "rgb(168 85 247 / 0.5)",
                              background: "linear-gradient(to right, rgb(168 85 247 / 0.1), rgb(236 72 153 / 0.1))",
                            }
                          : {}
                      }
                    >
                      <Icon className="w-6 h-6 text-white/70" />
                      <span
                        className={`text-xs font-thuast tracking-wider ${
                          isActive
                            ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
                            : "text-white/80"
                        }`}
                      >
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-800">
                <MobileAuth />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
