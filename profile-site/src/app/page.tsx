"use client";

import { useProfile } from "@/context/ProfileContext";
import { LinkCard } from "@/components/profile/LinkCard";
import { User, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { profile, isLoading } = useProfile();

  // Apply dynamic CSS variables
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.style.setProperty("--profile-primary", profile.colors.primary);
    root.style.setProperty("--profile-bg", profile.colors.background);
    root.style.setProperty("--profile-glass", profile.colors.cardGlass);
    root.style.setProperty("--profile-text", profile.colors.text);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: `${profile.colors.primary} transparent transparent transparent` }}
        />
      </div>
    );
  }

  const sortedLinks = [...profile.links].sort((a, b) => a.order - b.order);

  return (
    <main
      className="min-h-screen w-full"
      style={{ background: profile.colors.background, color: profile.colors.text }}
    >
      {/* ── Banner ── */}
      <div className="relative w-full h-44 sm:h-56 overflow-hidden">
        {profile.banner ? (
          <Image
            src={profile.banner}
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${profile.colors.primary}66 0%, ${profile.colors.background} 100%)`,
            }}
          />
        )}
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--profile-bg)]" />
      </div>

      {/* ── Avatar + Info ── */}
      <div className="relative flex flex-col items-center -mt-16 pb-4 px-4">
        <div
          className="w-28 h-28 rounded-full overflow-hidden border-4 flex-shrink-0 shadow-xl"
          style={{ borderColor: profile.colors.background }}
        >
          {profile.avatar ? (
            <Image src={profile.avatar} alt="Avatar" width={112} height={112} className="object-cover w-full h-full" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `${profile.colors.primary}30` }}
            >
              <User size={44} style={{ color: profile.colors.primary }} />
            </div>
          )}
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-center">
          {profile.name}
        </h1>
        <p className="mt-2 text-sm opacity-60 text-center max-w-xs leading-relaxed">
          {profile.bio}
        </p>
      </div>

      {/* ── Links ── */}
      <section className="max-w-md mx-auto px-4 pt-4 pb-16 flex flex-col gap-3">
        {sortedLinks.length === 0 && (
          <p className="text-center opacity-40 text-sm py-8">
            لا توجد روابط بعد
          </p>
        )}
        {sortedLinks.map((link) => (
          <LinkCard key={link.id} link={link} />
        ))}
      </section>

      {/* ── Admin shortcut ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <Link
          href="/admin"
          className="glass-card flex items-center gap-2 px-4 py-2 text-xs opacity-40 hover:opacity-80 transition-opacity"
          style={{ color: profile.colors.text }}
        >
          <Settings size={12} />
          تحرير
        </Link>
      </div>
    </main>
  );
}
