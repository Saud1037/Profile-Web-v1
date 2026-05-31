"use client";

import { useRef, useState } from "react";
import * as Icons from "lucide-react";
import { Upload, Search, X } from "lucide-react";
import { AVAILABLE_ICONS } from "@/lib/constants";
import Image from "next/image";

/** قراءة اسم Lucide أو "custom:base64" وعرض الأيقونة المناسبة */
export function IconDisplay({
  icon,
  size = 18,
  color,
}: {
  icon: string;
  size?: number;
  color?: string;
}) {
  if (icon.startsWith("custom:")) {
    const src = icon.slice(7);
    return (
      <Image
        src={src}
        alt="icon"
        width={size}
        height={size}
        className="object-contain rounded"
        style={{ width: size, height: size }}
      />
    );
  }
  const LucideIcon = (Icons as unknown as Record<string, Icons.LucideIcon>)[icon];
  if (!LucideIcon) return <Icons.Link size={size} color={color} />;
  return <LucideIcon size={size} color={color} />;
}

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  onClose: () => void;
}

export function IconPicker({ value, onChange, onClose }: IconPickerProps) {
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [query, setQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? AVAILABLE_ICONS.filter((n) => n.toLowerCase().includes(query.toLowerCase()))
    : AVAILABLE_ICONS;

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        onChange("custom:" + e.target.result);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-card border border-white/15 p-4 flex flex-col gap-3 mt-1">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(["library", "upload"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1 rounded-md text-xs font-medium transition-colors"
              style={{
                background: tab === t ? "rgba(255,255,255,0.12)" : "transparent",
                color: tab === t ? "white" : "rgba(255,255,255,0.45)",
              }}
            >
              {t === "library" ? "المكتبة" : "رفع أيقونة"}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/10 transition-colors">
          <X size={14} className="opacity-50" />
        </button>
      </div>

      {tab === "library" ? (
        <>
          {/* Search */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <Search size={13} className="opacity-40 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 focus:outline-none"
              placeholder="ابحث عن أيقونة..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              dir="ltr"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1.5 max-h-48 overflow-y-auto">
            {filtered.map((name) => {
              const LucideIcon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
              if (!LucideIcon) return null;
              const selected = value === name;
              return (
                <button
                  key={name}
                  title={name}
                  onClick={() => { onChange(name); onClose(); }}
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
                  style={{
                    background: selected ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${selected ? "rgba(99,102,241,0.6)" : "transparent"}`,
                    color: selected ? "#6366f1" : "rgba(255,255,255,0.6)",
                  }}
                >
                  <LucideIcon size={16} />
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="col-span-7 text-center text-xs opacity-30 py-3">لا نتائج</p>
            )}
          </div>
        </>
      ) : (
        /* Upload tab */
        <div
          className="border-2 border-dashed border-white/15 rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-white/30 transition-colors"
          onClick={() => fileRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onDragOver={(e) => e.preventDefault()}
        >
          {value.startsWith("custom:") ? (
            <>
              <Image
                src={value.slice(7)}
                alt="custom icon"
                width={48}
                height={48}
                className="object-contain rounded-xl"
              />
              <p className="text-xs opacity-50">انقر لتغيير الأيقونة</p>
            </>
          ) : (
            <>
              <Upload size={24} className="opacity-40" />
              <p className="text-xs opacity-50 text-center">
                ارفع صورة PNG أو SVG<br />
                <span className="opacity-60">(يُنصح بـ 64×64 أو أكبر)</span>
              </p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      )}
    </div>
  );
}
