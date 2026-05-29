"use client";

import { useEffect, useRef } from "react";
import { useProfile } from "@/context/ProfileContext";
import { LinkCard } from "@/components/profile/LinkCard";
import { User, Settings, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { profile, isLoading } = useProfile();
  const linksRef = useRef<HTMLDivElement>(null);

  // Apply dynamic CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--profile-primary", profile.colors.primary);
    // derive a secondary color by shifting hue ~40deg — simple approach via a second stored color
    // fallback: use primary with opacity shift as secondary for gradient
    root.style.setProperty("--profile-secondary", profile.colors.cardGlass !== "rgba(255,255,255,0.05)"
      ? profile.colors.cardGlass
      : shiftHue(profile.colors.primary, 40));
    root.style.setProperty("--profile-bg", profile.colors.background);
    root.style.setProperty("--profile-glass", "rgba(255,255,255,0.04)");
    root.style.setProperty("--profile-text", profile.colors.text);
  }, [profile.colors]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#6366f1 transparent transparent transparent" }} />
      </div>
    );
  }

  const sortedLinks = [...profile.links].sort((a, b) => a.order - b.order);

  // Parse tags from bio if they contain · separator, otherwise show bio as-is
  const bioTags = profile.bio.includes("·")
    ? profile.bio.split("·").map((t) => t.trim()).filter(Boolean)
    : null;

  return (
    <div style={{ background: profile.colors.background, color: profile.colors.text, minHeight: "100vh" }}>
      {/* Ambient background mesh */}
      <div className="profile-bg-mesh" />

      {/* ══ HERO SECTION ══ */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

        {/* Avatar */}
        <div className="fade-up fade-up-1 mb-8">
          <div className="avatar-ring inline-block">
            <div className="avatar-ring-inner">
              <div className="w-28 h-28 sm:w-32 sm:h-32 overflow-hidden rounded-full">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: `${profile.colors.primary}20` }}>
                    <User size={44} style={{ color: profile.colors.primary }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Name */}
        <h1 className="fade-up fade-up-2 text-5xl sm:text-7xl font-black tracking-tight leading-none mb-5">
          <span className="gradient-text">{profile.name}</span>
        </h1>

        {/* Bio / Tags */}
        <div className="fade-up fade-up-3 mb-10">
          {bioTags ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {bioTags.map((tag, i) => (
                <span key={i} className="tag-pill">{tag}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm sm:text-base max-w-xs leading-relaxed" style={{ opacity: 0.5 }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Scroll chevron */}
        {sortedLinks.length > 0 && (
          <div className="fade-up fade-up-4 absolute bottom-10 left-1/2 -translate-x-1/2">
            <button
              onClick={() => linksRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="bounce-chevron flex flex-col items-center gap-1 opacity-40 hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="scroll to links"
            >
              <ChevronDown size={22} />
            </button>
          </div>
        )}
      </section>

      {/* ══ LINKS SECTION ══ */}
      {sortedLinks.length > 0 && (
        <section ref={linksRef} className="relative z-10 max-w-md mx-auto px-5 pb-24 pt-4">
          <div className="flex flex-col gap-3">
            {sortedLinks.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        </section>
      )}

      {/* ══ ADMIN SHORTCUT ══ */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href="/admin"
          className="glass-card flex items-center gap-2 px-3.5 py-2 text-xs transition-opacity opacity-30 hover:opacity-70"
          style={{ color: profile.colors.text }}
        >
          <Settings size={12} />
          تحرير
        </Link>
      </div>
    </div>
  );
}

/** Shift a hex color's hue by `deg` degrees */
function shiftHue(hex: string, deg: number): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  h = (h * 360 + deg) % 360 / 360;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p2 = 2 * l - q2;
  const nr = Math.round(hue2rgb(p2, q2, h + 1/3) * 255);
  const ng = Math.round(hue2rgb(p2, q2, h) * 255);
  const nb = Math.round(hue2rgb(p2, q2, h - 1/3) * 255);
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}
