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
  bg: "#F7F4EE",
  ink: "#123859",
  accent: "#419FD9",
  shadow: "#0E2A44",
  white: "#F2F2F2",
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", name: "HOME", href: "/", icon: Home },
  { id: "about", name: "ABOUT", href: "/about", icon: Info },
  { id: "events", name: "EVENTS", href: "/#events", icon: Calendar },
  { id: "summit", name: "GLOBAL SUMMIT", href: "/nilgiris", icon: Globe },
  { id: "gallery", name: "GALLERY", href: "/gallery", icon: ImageIcon },
  { id: "sponsors", name: "SPONSORS", href: "/sponsor", icon: Handshake },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [activeId, setActiveId] = React.useState<string>("home");

  const [isHidden, setIsHidden] = React.useState(false);
  const [hasScrolled, setHasScrolled] = React.useState(false);
  const lastScrollY = React.useRef(0);

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

      if (y > lastScrollY.current) setIsHidden(true);
      else setIsHidden(false);

      lastScrollY.current = y;
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
      initial={{ y: -120 }}
      animate={{ y: isHidden ? -120 : 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 w-full z-50 pt-safe"
    >
      <div className="flex justify-center w-full pt-4 px-4">
        <div
          className="flex flex-col items-center"
          onMouseEnter={() => {
            if (!isMobile) setIsExpanded(true);
          }}
          onMouseLeave={() => {
            if (!isMobile) setIsExpanded(false);
            setHovered(null);
          }}
        >
          <button
            onClick={() => {
              if (isMobile) setIsExpanded((p) => !p);
              else router.push("/");
              setActiveId("home");
            }}
            className="flex items-center justify-center"
            style={{
              background: `${PAPER.bg} url('/textures/paper.png')`,
              backdropFilter: "none",
              width: isExpanded ? "58px" : "190px",
              height: isExpanded ? "48px" : "56px",
              borderRadius: isExpanded ? "14px" : "28px",
              border: `4px solid ${PAPER.ink}`,
              boxShadow: `6px 6px 0 ${PAPER.shadow}`,
              transition: "all 700ms cubic-bezier(0.16,1,0.3,1)",
              transform: "rotate(-0.8deg)",
            }}
          >
            <Image
              src="/assets/texus-color 3.png"
              alt="TEXUS Logo"
              width={260}
              height={90}
              className="h-8 w-auto object-contain"
              priority
            />
          </button>

          <div
            className="mt-2"
            style={{
              opacity: isExpanded ? 1 : 0,
              pointerEvents: isExpanded ? "auto" : "none",
              transform: isExpanded
                ? "translateY(0) scale(1)"
                : "translateY(-14px) scale(0.96)",
              transition:
                "opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div
              className={[
                "rounded-2xl",
                "flex flex-col md:inline-flex md:flex-row md:items-center md:gap-4",
                "p-4",
                "w-[92vw] md:w-fit",
                "max-w-[92vw]",
              ].join(" ")}
              style={{
                background: `${PAPER.bg} url('/textures/paper.png')`,
                border: `4px solid ${PAPER.ink}`,
                boxShadow: `6px 6px 0 ${PAPER.shadow}`,
              }}
            >
              <div className="flex flex-wrap justify-center gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeId === item.id;
                  const isHovered = hovered === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (isMobile) setIsExpanded(false);
                        go(item.href, item.id);
                      }}
                      onMouseEnter={() => setHovered(item.id)}
                      onMouseLeave={() => setHovered(null)}
                      className="relative flex items-center gap-2 px-3 py-2 rounded-xl transition-transform"
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
                      <div style={{ color: PAPER.ink, flexShrink: 0 }}>
                        <Icon className="w-4 h-4 md:hidden" />
                      </div>

                      <span
                        className="text-xs sm:text-sm font-extrabold tracking-wider"
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
              </div>

              <div className="flex justify-center mt-2 md:mt-0">
                <div className="hidden md:flex">
                  <DesktopAuth />
                </div>
                <div className="md:hidden w-full">
                  <MobileAuth />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
