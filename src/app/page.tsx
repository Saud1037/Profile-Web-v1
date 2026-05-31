"use client";

import { useEffect, useRef } from "react";
import { useProfile } from "@/context/ProfileContext";
import { LinkCard } from "@/components/profile/LinkCard";
import { ProjectCard } from "@/components/profile/ProjectCard";
import { User, Settings, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { profile, isLoading } = useProfile();
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    const r = document.documentElement;
    const c = profile.colors;
    r.style.setProperty("--profile-primary",    c.primary);
    r.style.setProperty("--profile-grad-from",  c.gradientFrom  ?? c.primary);
    r.style.setProperty("--profile-grad-to",    c.gradientTo    ?? c.primary);
    r.style.setProperty("--profile-grad-angle", `${c.gradientAngle ?? 135}deg`);
    r.style.setProperty("--profile-bg",         c.background);
    r.style.setProperty("--profile-glass",      c.cardGlass ?? "rgba(255,255,255,0.04)");
    r.style.setProperty("--profile-text",       c.text);
  }, [profile.colors, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#6366f1 transparent transparent transparent" }} />
      </div>
    );
  }

  const sortedLinks    = [...(profile.links    ?? [])].sort((a, b) => a.order - b.order);
  const sortedProjects = [...(profile.projects ?? [])].sort((a, b) => a.order - b.order);

  const bioTags = profile.bio.includes("·")
    ? profile.bio.split("·").map(t => t.trim()).filter(Boolean)
    : null;

  return (
    <div style={{ background: profile.colors.background, color: profile.colors.text, minHeight: "100vh" }}>
      <div className="profile-bg-mesh" />

      {/* ══ BANNER ══ */}
      <div className="relative w-full overflow-hidden fade-up fade-up-1" style={{ height: "clamp(220px, 40vh, 380px)" }}>
        {profile.banner ? (
          <Image src={profile.banner} alt="Banner" fill className="object-cover object-center" priority />
        ) : (
          <div className="banner-gradient w-full h-full" />
        )}
        <div className="absolute inset-x-0 bottom-0"
          style={{ height: "22%", background: `linear-gradient(to bottom, transparent 0%, ${profile.colors.background} 100%)` }} />
      </div>

      {/* ══ HERO ══ */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 -mt-16">
        {/* Avatar */}
        <div className="fade-up fade-up-2 mb-6">
          <div className="avatar-ring">
            <div className="avatar-ring-inner">
              <div className="w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-full">
                {profile.avatar ? (
                  <Image src={profile.avatar} alt={profile.name} width={112} height={112}
                    className="object-cover w-full h-full" priority />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: `${profile.colors.primary}20` }}>
                    <User size={38} style={{ color: profile.colors.primary }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Name */}
        <h1 className="fade-up fade-up-3 text-4xl sm:text-6xl font-black tracking-tight leading-none mb-5">
          <span className="gradient-text">{profile.name}</span>
        </h1>

        {/* Bio / Tags */}
        <div className="fade-up fade-up-4 mb-10 min-h-[28px]">
          {bioTags ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {bioTags.map((tag, i) => <span key={i} className="tag-pill">{tag}</span>)}
            </div>
          ) : (
            <p className="text-sm sm:text-base max-w-xs leading-relaxed opacity-50">{profile.bio}</p>
          )}
        </div>

        {/* Scroll chevron */}
        {(sortedLinks.length > 0 || sortedProjects.length > 0) && (
          <div className="fade-up fade-up-5 mb-14">
            <button onClick={() => linksRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="bounce-chevron flex flex-col items-center gap-1 opacity-40 hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="scroll to content">
              <ChevronDown size={22} />
            </button>
          </div>
        )}
      </section>

      {/* ══ LINKS ══ */}
      {sortedLinks.length > 0 && (
        <section ref={linksRef} className="relative z-10 max-w-md mx-auto px-5 pb-10">
          <div className="flex flex-col gap-3">
            {sortedLinks.map((link) => <LinkCard key={link.id} link={link} />)}
          </div>
        </section>
      )}

      {/* ══ PROJECTS ══ */}
      {sortedProjects.length > 0 && (
        <section className="relative z-10 max-w-2xl mx-auto px-5 pb-24">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-sm font-semibold tracking-widest uppercase opacity-40">المشاريع</h2>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Grid: 1 col on mobile, 2 on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* ══ ADMIN SHORTCUT ══ */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/admin"
          className="glass-card flex items-center gap-2 px-3.5 py-2 text-xs transition-opacity opacity-30 hover:opacity-70"
          style={{ color: profile.colors.text }}>
          <Settings size={12} />
          تحرير
        </Link>
      </div>
    </div>
  );
}
