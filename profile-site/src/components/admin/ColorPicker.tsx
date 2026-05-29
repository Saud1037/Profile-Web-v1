"use client";

import { ProfileColors } from "@/types";

interface ColorPickerProps {
  colors: ProfileColors;
  onChange: (colors: Partial<ProfileColors>) => void;
}

const PRESETS = [
  { primary: "#6366f1", background: "#0f0f1a" }, // indigo
  { primary: "#8b5cf6", background: "#100d1a" }, // violet
  { primary: "#06b6d4", background: "#0a1628" }, // cyan
  { primary: "#10b981", background: "#0a1a14" }, // emerald
  { primary: "#f59e0b", background: "#1a1408" }, // amber
  { primary: "#ef4444", background: "#1a0a0a" }, // red
  { primary: "#ec4899", background: "#1a0a14" }, // pink
  { primary: "#ffffff", background: "#111111" }, // mono
];

export function ColorPicker({ colors, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-xs font-medium opacity-60 uppercase tracking-wider">
        الألوان
      </label>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.primary}
            className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${p.primary} 50%, ${p.background} 50%)`,
              borderColor:
                colors.primary === p.primary ? "white" : "transparent",
            }}
            title={p.primary}
            onClick={() =>
              onChange({ primary: p.primary, background: p.background })
            }
          />
        ))}
      </div>

      {/* Manual color inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs opacity-50">اللون الأساسي</label>
          <div className="flex items-center gap-2 glass-card px-3 py-2">
            <input
              type="color"
              value={colors.primary}
              onChange={(e) => onChange({ primary: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-xs font-mono opacity-70">{colors.primary}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs opacity-50">لون الخلفية</label>
          <div className="flex items-center gap-2 glass-card px-3 py-2">
            <input
              type="color"
              value={colors.background}
              onChange={(e) => onChange({ background: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-xs font-mono opacity-70">{colors.background}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs opacity-50">لون النص</label>
          <div className="flex items-center gap-2 glass-card px-3 py-2">
            <input
              type="color"
              value={colors.text}
              onChange={(e) => onChange({ text: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-xs font-mono opacity-70">{colors.text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
