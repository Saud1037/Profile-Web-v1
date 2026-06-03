"use client";

import { Project } from "@/types";
import { useProfile } from "@/context/ProfileContext";
import { IconDisplay } from "@/components/admin/IconPicker";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export function ProjectCard({ project }: { project: Project }) {
  const { profile } = useProfile();
  const { primary, gradientFrom, gradientTo, gradientAngle, text } = profile.colors;
  const grad = `linear-gradient(${gradientAngle}deg, ${gradientFrom}, ${gradientTo})`;

  const inner = (
    <div
      className="glass-card overflow-hidden flex flex-col h-full group transition-all duration-300"
      style={{ color: text }}
    >
      {/* Project image or gradient placeholder */}
      <div className="relative w-full h-36 flex-shrink-0 overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: grad }}>
            <div className="opacity-30">
              <IconDisplay icon={project.icon} size={40} />
            </div>
          </div>
        )}
        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-12"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))" }} />

        {/* Icon badge */}
        <div
          className="absolute bottom-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: grad }}
        >
          <IconDisplay icon={project.icon} size={15} color="white" />
        </div>

        {/* External arrow */}
        {project.url && (
          <div className="absolute top-3 left-3 w-7 h-7 rounded-lg flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.4)" }}>
            <ArrowUpRight size={14} className="text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-sm leading-snug">{project.title}</h3>
        {project.description && (
          <p className="text-xs leading-relaxed opacity-50 line-clamp-2">{project.description}</p>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-md"
                style={{ background: `${primary}20`, color: primary }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (project.url) {
    return (
      <a href={project.url} target="_blank" rel="noopener noreferrer"
        className="block h-full no-underline link-card-wrap">
        {inner}
      </a>
    );
  }

  return <div className="h-full link-card-wrap">{inner}</div>;
}
