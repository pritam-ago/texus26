"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  Info,
  Globe,
  Image as ImageIcon,
  Handshake,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { signInWithGoogle, signOut } from "@/lib/auth";
import { createClient } from "@/supabase/client";
import type { User } from "@supabase/supabase-js";
import { FaGoogle } from "react-icons/fa";

type NavItem = {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const PAPER = {
  bg: "#F2F2F2",
  ink: "#12590F",
  accent: "#79A677",
  shadow: "#12590F",
  white: "#FFFFFF",
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", name: "HOME", href: "/", icon: Home },
  
  { id: "events", name: "EVENTS", href: "/events", icon: Calendar },
  { id: "gallery", name: "GALLERY", href: "/gallery", icon: ImageIcon },
  { id: "summit", name: "GLOBAL SUMMIT", href: "/nilgiris", icon: Globe },
  { id: "sponsors", name: "SPONSORS", href: "/sponsor", icon: Handshake },
  { id: "about", name: "ABOUT", href: "/about", icon: Info },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [activeId, setActiveId] = React.useState<string>("home");

  const [hasScrolled, setHasScrolled] = React.useState(false);

  const [isMobile, setIsMobile] = React.useState(false);

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
    const onScroll = () => {
      const y = window.scrollY;
      setHasScrolled(y > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const syncActiveFromUrl = () => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";

      if (pathname === "/" && hash === "#events") {
        setActiveId("events");
        return;
      }

      const exact = NAV_ITEMS.find((i) => i.href === pathname);
      if (exact) {
        setActiveId(exact.id);
        return;
      }

      if (pathname === "/") setActiveId("home");
    };

    syncActiveFromUrl();
    window.addEventListener("hashchange", syncActiveFromUrl);
    return () => window.removeEventListener("hashchange", syncActiveFromUrl);
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

    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      const el = document.getElementById(targetId);

      if (pathname === "/" && el) {
        window.history.replaceState(null, "", `/#${targetId}`);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      router.push("/");
      setTimeout(() => {
        const el2 = document.getElementById(targetId);
        window.history.replaceState(null, "", `/#${targetId}`);
        el2?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
      return;
    }

    router.push(href);
  };

  const DesktopAuth = () => {
    if (loading) return <Skeleton className="h-9 w-[110px] rounded-xl" />;

    if (!user) {
      return (
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold transition active:translate-y-[1px]"
          style={{
            background: "#FFFFFF",
            color: PAPER.ink,
            border: `3px solid ${PAPER.ink}`,
            boxShadow: `3px 3px 0 ${PAPER.shadow}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = PAPER.accent;
            e.currentTarget.style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#FFFFFF";
            e.currentTarget.style.color = PAPER.ink;
          }}
        >
          <FaGoogle />
          Login
        </button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="relative h-9 w-9 rounded-full overflow-hidden active:translate-y-[1px]"
            style={{
              border: `3px solid ${PAPER.ink}`,
              background: `#FFFFFF url('/textures/paper.png')`,
              boxShadow: `3px 3px 0 ${PAPER.shadow}`,
            }}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={user.user_metadata?.avatar_url || ""}
                alt={user.user_metadata?.full_name || ""}
              />
              <AvatarFallback>
                {user.user_metadata?.full_name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
          </button>
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

          <DropdownMenuItem className="cursor-pointer">
            <Link href="/profile" className="w-full">
              View Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={signOut} className="cursor-pointer">
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-extrabold transition active:translate-y-[1px]"
            style={{
              background: "#FFFFFF",
              color: PAPER.ink,
              border: `3px solid ${PAPER.ink}`,
              boxShadow: `3px 3px 0 ${PAPER.shadow}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = PAPER.accent;
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FFFFFF";
              e.currentTarget.style.color = PAPER.ink;
            }}
          >
            <FaGoogle />
            Login with Google
          </button>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col items-center gap-2">
        <Link href="/profile" className="w-full" style={{ maxWidth: 520 }}>
          <Button
            variant="outline"
            className="w-full justify-center rounded-xl active:translate-y-[1px]"
            style={{
              background: "#FFFFFF",
              color: PAPER.ink,
              border: `3px solid ${PAPER.ink}`,
              boxShadow: `3px 3px 0 ${PAPER.shadow}`,
            }}
          >
            View Profile
          </Button>
        </Link>
        <div className="w-full" style={{ maxWidth: 520 }}>
          <Button
            variant="outline"
            className="w-full justify-center rounded-xl active:translate-y-[1px]"
            style={{
              background: "#FFFFFF",
              color: PAPER.ink,
              border: `3px solid ${PAPER.ink}`,
              boxShadow: `3px 3px 0 ${PAPER.shadow}`,
            }}
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
      initial={{ y: -100 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 w-full z-50"
      style={{
        background: hasScrolled 
          ? `${PAPER.bg} url('/textures/paper.png')` 
          : `${PAPER.bg} url('/textures/paper.png')`,
        backdropFilter: hasScrolled ? "blur(10px)" : "none",
        borderBottom: `4px solid ${PAPER.ink}`,
        boxShadow: hasScrolled ? `0 4px 0 ${PAPER.shadow}` : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => {
              router.push("/");
              setActiveId("home");
            }}
            className="flex items-center"
          >
            <Image
              src="/assets/texus-color 3.png"
              alt="TEXUS Logo"
              width={180}
              height={60}
              className="h-10 w-auto object-contain"
              priority
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              const isHovered = hovered === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => go(item.href, item.id)}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-xl transition-transform active:translate-y-[1px]"
                  title={item.name}
                  style={{
                    background: isActive ? PAPER.accent : "#FFFFFF",
                    border: `3px solid ${PAPER.ink}`,
                    boxShadow:
                      isActive || isHovered
                        ? `3px 3px 0 ${PAPER.shadow}`
                        : `2px 2px 0 ${PAPER.shadow}`,
                    transform: isHovered ? "translate(-1px,-1px)" : "none",
                  }}
                >
                  <span
                    className="text-xs font-extrabold tracking-wider"
                    style={{
                      color: PAPER.ink,
                      opacity: isActive || isHovered ? 1 : 0.92,
                    }}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
            <DesktopAuth />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl active:translate-y-[1px]"
            style={{
              background: "#FFFFFF",
              border: `3px solid ${PAPER.ink}`,
              boxShadow: `3px 3px 0 ${PAPER.shadow}`,
            }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={PAPER.ink}
                strokeWidth="3"
                strokeLinecap="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsExpanded(false);
                    go(item.href, item.id);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl active:translate-y-[1px]"
                  style={{
                    background: isActive ? PAPER.accent : "#FFFFFF",
                    border: `3px solid ${PAPER.ink}`,
                    boxShadow: `3px 3px 0 ${PAPER.shadow}`,
                  }}
                >
                  <div style={{ color: PAPER.ink }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className="text-sm font-extrabold tracking-wider"
                    style={{ color: PAPER.ink }}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
            <div className="pt-2">
              <MobileAuth />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
