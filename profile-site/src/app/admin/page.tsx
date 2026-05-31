"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ColorPicker } from "@/components/admin/ColorPicker";
import { LinksManager } from "@/components/admin/LinksManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { Eye, Lock, Save, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { profile, updateProfile, isLoading } = useProfile();
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localName, setLocalName] = useState("");
  const [localBio, setLocalBio] = useState("");

  useEffect(() => {
    if (!isLoading) {
      setLocalName(profile.name);
      setLocalBio(profile.bio);
    }
  }, [isLoading, profile.name, profile.bio]);

  // Apply dynamic CSS vars
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.style.setProperty("--profile-primary", profile.colors.primary);
    root.style.setProperty("--profile-bg", profile.colors.background);
    root.style.setProperty("--profile-glass", profile.colors.cardGlass);
    root.style.setProperty("--profile-text", profile.colors.text);
  }

  const handleLogin = () => {
    if (pw === profile.adminPassword) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const handleSave = () => {
    updateProfile({ name: localName, bio: localBio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) return null;

  /* ── Auth wall ── */
  if (!authed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: profile.colors.background, color: profile.colors.text }}
      >
        <div className="glass-card p-8 w-full max-w-sm flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `${profile.colors.primary}25` }}
            >
              <Lock size={22} style={{ color: profile.colors.primary }} />
            </div>
            <h1 className="text-lg font-bold">لوحة التحكم</h1>
            <p className="text-xs opacity-40 text-center">أدخل كلمة المرور للوصول</p>
          </div>

          <input
            type="password"
            placeholder="كلمة المرور"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setPwError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={`bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none text-center ${
              pwError ? "border-red-500" : "border-white/10 focus:border-indigo-500"
            }`}
          />
          {pwError && (
            <p className="text-red-400 text-xs text-center -mt-3">كلمة مرور خاطئة</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl font-medium text-sm transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: profile.colors.primary, color: "white" }}
          >
            دخول
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity"
          >
            <ArrowRight size={12} />
            العودة للبروفايل
          </Link>
        </div>
      </div>
    );
  }

  /* ── Dashboard ── */
  return (
    <div
      className="min-h-screen"
      style={{ background: profile.colors.background, color: profile.colors.text }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-md"
        style={{ background: `${profile.colors.background}cc` }}
      >
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-bold text-sm">لوحة التحكم</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Eye size={13} />
              عرض البروفايل
            </Link>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: saved ? "#10b981" : profile.colors.primary,
                color: "white",
              }}
            >
              {saved ? <Check size={13} /> : <Save size={13} />}
              {saved ? "تم الحفظ" : "حفظ"}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Images */}
        <section className="glass-card p-5 flex flex-col gap-5">
          <h2 className="text-sm font-semibold opacity-80">الصور</h2>
          <ImageUploader
            label="صورة الغلاف (Banner)"
            value={profile.banner}
            onChange={(v) => updateProfile({ banner: v })}
            aspectRatio="banner"
          />
          <ImageUploader
            label="الصورة الشخصية (Avatar)"
            value={profile.avatar}
            onChange={(v) => updateProfile({ avatar: v })}
            aspectRatio="square"
          />
        </section>

        {/* Profile info */}
        <section className="glass-card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold opacity-80">المعلومات الشخصية</h2>
          <div className="flex flex-col gap-2">
            <label className="text-xs opacity-50">الاسم</label>
            <input
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="اسمك"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs opacity-50">النبذة</label>
            <textarea
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
              rows={3}
              value={localBio}
              onChange={(e) => setLocalBio(e.target.value)}
              placeholder="نبذة قصيرة عنك"
            />
          </div>
        </section>

        {/* Colors */}
        <section className="glass-card p-5">
          <h2 className="text-sm font-semibold opacity-80 mb-4">الألوان والمظهر</h2>
          <ColorPicker
            colors={profile.colors}
            onChange={(c) => updateProfile({ colors: { ...profile.colors, ...c } })}
          />
        </section>

        {/* Links */}
        <section className="glass-card p-5">
          <LinksManager
            links={profile.links}
            onChange={(links) => updateProfile({ links })}
          />
        </section>

        {/* Projects */}
        <section className="glass-card p-5">
          <ProjectsManager
            projects={profile.projects ?? []}
            onChange={(projects) => updateProfile({ projects })}
          />
        </section>

        {/* Password change */}
        <section className="glass-card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold opacity-80">تغيير كلمة المرور</h2>
          <PasswordChange
            onSave={(pw) => updateProfile({ adminPassword: pw })}
          />
        </section>

      </div>
    </div>
  );
}

function PasswordChange({ onSave }: { onSave: (pw: string) => void }) {
  const [val, setVal] = useState("");
  const [done, setDone] = useState(false);

  const save = () => {
    if (val.length < 4) return;
    onSave(val);
    setVal("");
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <div className="flex gap-2">
      <input
        type="password"
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
        placeholder="كلمة المرور الجديدة"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <button
        onClick={save}
        className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
        style={{ background: done ? "#10b981" : "rgba(99,102,241,0.3)", color: done ? "white" : "#6366f1" }}
      >
        {done ? "✓" : "تحديث"}
      </button>
    </div>
  );
}
