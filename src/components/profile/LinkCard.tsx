"use client";

import { useProfile } from "@/context/ProfileContext";
import { SocialLink } from "@/types";
import * as Icons from "lucide-react";
import { ExternalLink } from "lucide-react";

function DynamicIcon({ name, size = 20 }: { name: string; size?: number }) {
  const LucideIcon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  if (!LucideIcon) return <Icons.Link size={size} />;
  return <LucideIcon size={size} />;
}

export function LinkCard({ link }: { link: SocialLink }) {
  const { profile } = useProfile();

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card flex items-center gap-4 px-5 py-4 w-full group cursor-pointer no-underline"
      style={{ color: profile.colors.text }}
    >
      {/* Icon bubble */}
      <span
        className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 transition-colors"
        style={{
          background: `${profile.colors.primary}25`,
          color: profile.colors.primary,
        }}
      >
        <DynamicIcon name={link.icon} size={20} />
      </span>

      {/* Title */}
      <span className="flex-1 font-medium text-sm sm:text-base">
        {link.title}
      </span>

      {/* External link arrow */}
      <ExternalLink
        size={15}
        className="opacity-30 group-hover:opacity-60 transition-opacity flex-shrink-0"
      />
    </a>
  );
}
