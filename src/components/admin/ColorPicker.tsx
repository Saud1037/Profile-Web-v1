"use client";

import { ProfileColors } from "@/types";

interface ColorPickerProps {
  colors: ProfileColors;
  onChange: (colors: Partial<ProfileColors>) => void;
}

// كل preset فيه: from, to, angle, background
const PRESETS: Array<{
  label: string;
  from: string;
  to: string;
  angle: number;
  bg: string;
}> = [
  { label: "Indigo → Purple", from: "#6366f1", to: "#a855f7", angle: 135, bg: "#0a0a0f" },
  { label: "Blue → Cyan",     from: "#3b82f6", to: "#06b6d4", angle: 135, bg: "#060d1a" },
  { label: "Pink → Orange",   from: "#ec4899", to: "#f97316", angle: 135, bg: "#140a0a" },
  { label: "Green → Teal",    from: "#10b981", to: "#06b6d4", angle: 135, bg: "#050f0d" },
  { label: "Red → Pink",      from: "#ef4444", to: "#ec4899", angle: 135, bg: "#130508" },
  { label: "Gold → Amber",    from: "#f59e0b", to: "#ef4444", angle: 135, bg: "#120d00" },
  { label: "White → Gray",    from: "#ffffff", to: "#94a3b8", angle: 135, bg: "#0f0f0f" },
  { label: "Diagonal ↘",      from: "#8b5cf6", to: "#06b6d4", angle: 160, bg: "#080a14" },
];

export function ColorPicker({ colors, onChange }: ColorPickerProps) {
  const from  = colors.gradientFrom  ?? colors.primary;
  const to    = colors.gradientTo    ?? colors.primary;
  const angle = colors.gradientAngle ?? 135;

  const previewGradient = `linear-gradient(${angle}deg, ${from}, ${to})`;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Live preview ── */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium opacity-60 uppercase tracking-wider">معاينة الـ Gradient</label>
        <div
          className="w-full h-16 rounded-xl"
          style={{ background: previewGradient }}
        />
      </div>

      {/* ── Presets ── */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium opacity-60 uppercase tracking-wider">ألوان جاهزة</label>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              className="h-10 rounded-xl transition-all hover:scale-105 active:scale-95 border-2"
              style={{
                background: `linear-gradient(${p.angle}deg, ${p.from}, ${p.to})`,
                borderColor:
                  from === p.from && to === p.to ? "white" : "transparent",
              }}
              title={p.label}
              onClick={() =>
                onChange({
                  gradientFrom:  p.from,
                  gradientTo:    p.to,
                  gradientAngle: p.angle,
                  background:    p.bg,
                  primary:       p.from,
                })
              }
            />
          ))}
        </div>
      </div>

      {/* ── Manual gradient controls ── */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium opacity-60 uppercase tracking-wider">تخصيص يدوي</label>

        <div className="grid grid-cols-2 gap-3">
          {/* From */}
          <div className="flex flex-col gap-1">
            <label className="text-xs opacity-50">لون البداية</label>
            <div className="flex items-center gap-2 glass-card px-3 py-2">
              <input
                type="color"
                value={from}
                onChange={(e) => onChange({ gradientFrom: e.target.value, primary: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-xs font-mono opacity-70">{from}</span>
            </div>
          </div>

          {/* To */}
          <div className="flex flex-col gap-1">
            <label className="text-xs opacity-50">لون النهاية</label>
            <div className="flex items-center gap-2 glass-card px-3 py-2">
              <input
                type="color"
                value={to}
                onChange={(e) => onChange({ gradientTo: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-xs font-mono opacity-70">{to}</span>
            </div>
          </div>
        </div>

        {/* Angle slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs opacity-50">زاوية الـ Gradient</label>
            <span className="text-xs font-mono opacity-70">{angle}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={angle}
            onChange={(e) => onChange({ gradientAngle: Number(e.target.value) })}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${from}, ${to})`,
              accentColor: from,
            }}
          />
          {/* Quick angle buttons */}
          <div className="flex gap-2 flex-wrap">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <button
                key={a}
                onClick={() => onChange({ gradientAngle: a })}
                className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                style={{
                  background: angle === a ? from + "40" : "rgba(255,255,255,0.06)",
                  color: angle === a ? from : "rgba(255,255,255,0.5)",
                  border: `1px solid ${angle === a ? from + "60" : "transparent"}`,
                }}
              >
                {a}°
              </button>
            ))}
          </div>
        </div>

        {/* Background color */}
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

        {/* Text color */}
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
