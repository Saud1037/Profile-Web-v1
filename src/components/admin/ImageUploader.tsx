"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (base64: string) => void;
  aspectRatio?: "square" | "banner";
}

export function ImageUploader({
  label,
  value,
  onChange,
  aspectRatio = "square",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        onChange(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium opacity-60 uppercase tracking-wider">
        {label}
      </label>

      <div
        className={`relative rounded-xl border border-white/10 overflow-hidden cursor-pointer group
          ${aspectRatio === "banner" ? "h-28" : "h-36 max-w-[144px]"}`}
        style={{ background: "rgba(255,255,255,0.03)" }}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {value ? (
          <>
            <Image src={value} alt={label} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Upload size={16} className="text-white" />
              <span className="text-white text-xs">تغيير</span>
            </div>
            <button
              className="absolute top-2 left-2 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
            >
              <X size={12} className="text-white" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-40 group-hover:opacity-70 transition-opacity">
            <Upload size={20} />
            <span className="text-xs">رفع صورة</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
