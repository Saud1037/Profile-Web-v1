"use client";

import { useProfile } from "@/context/ProfileContext";
import { SocialLink } from "@/types";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";

function DynamicIcon({ name, size = 18 }: { name: string; size?: number }) {
  const LucideIcon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  if (!LucideIcon) return <Icons.Link size={size} />;
  return <LucideIcon size={size} />;
}

export function LinkCard({ link }: { link: SocialLink }) {
  const { profile } = useProfile();

  return (
    <div className="link-card-wrap">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="glass-card flex items-center gap-4 px-5 py-4 w-full group no-underline"
        style={{ color: profile.colors.text }}
      >
        {/* Icon */}
        <span
          className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${profile.colors.primary}30, ${profile.colors.primary}10)`,
            color: profile.colors.primary,
          }}
        >
          <DynamicIcon name={link.icon} size={18} />
        </span>

        {/* Title */}
        <span className="flex-1 font-semibold text-sm tracking-wide">
          {link.title}
        </span>

        {/* Arrow */}
        <ArrowUpRight
          size={16}
          className="opacity-0 group-hover:opacity-60 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
          style={{ color: profile.colors.primary }}
        />
      </a>
    </div>
  );
}
