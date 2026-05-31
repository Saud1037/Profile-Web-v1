"use client";

import { useState, useEffect, useRef } from "react";
import { useProfile } from "@/context/ProfileContext";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ColorPicker } from "@/components/admin/ColorPicker";
import { LinksManager } from "@/components/admin/LinksManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { Eye, Lock, Save, ArrowRight, Check, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminPage() {
  const { profile, updateProfile, isLoading } = useProfile();
  const [authed, setAuthed]     = useState(false);
  const [pw, setPw]             = useState("");
  const [pwError, setPwError]   = useState(false);
  const [saved, setSaved]       = useState(false);
  const [localName, setLocalName]       = useState("");
  const [localBio, setLocalBio]         = useState("");
  const [localSiteName, setLocalSiteName] = useState("");
  const faviconRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      setLocalName(profile.name);
      setLocalBio(profile.bio ?? "");
      setLocalSiteName(profile.siteName ?? "");
    }
  }, [isLoading, profile.name, profile.bio, profile.siteName]);

  // CSS vars
  useEffect(() => {
    if (isLoading) return;
    const r = document.documentElement;
    const c = profile.colors;
    r.style.setProperty("--profile-primary",    c.primary);
    r.style.setProperty("--profile-grad-from",  c.gradientFrom ?? c.primary);
    r.style.setProperty("--profile-grad-to",    c.gradientTo   ?? c.primary);
    r.style.setProperty("--profile-grad-angle", `${c.gradientAngle ?? 135}deg`);
    r.style.setProperty("--profile-bg",         c.background);
    r.style.setProperty("--profile-glass",      c.cardGlass ?? "rgba(255,255,255,0.04)");
    r.style.setProperty("--profile-text",       c.text);
  }, [profile.colors, isLoading]);

  const handleLogin = () => {
    if (pw === profile.adminPassword) { setAuthed(true); setPwError(false); }
    else setPwError(true);
  };

  const handleSave = () => {
    updateProfile({ name: localName, bio: localBio, siteName: localSiteName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFavicon = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string")
        updateProfile({ favicon: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) return null;

  /* ── Auth wall ── */
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: profile.colors.background, color: profile.colors.text }}>
        <div className="glass-card p-8 w-full max-w-sm flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `${profile.colors.primary}25` }}>
              <Lock size={22} style={{ color: profile.colors.primary }} />
            </div>
            <h1 className="text-lg font-bold">لوحة التحكم</h1>
            <p className="text-xs opacity-40 text-center">أدخل كلمة المرور للوصول</p>
          </div>
          <input
            type="password"
            placeholder="كلمة المرور"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setPwError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={`bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none text-center ${
              pwError ? "border-red-500" : "border-white/10 focus:border-indigo-500"}`}
          />
          {pwError && <p className="text-red-400 text-xs text-center -mt-3">كلمة مرور خاطئة</p>}
          <button onClick={handleLogin}
            className="w-full py-3 rounded-xl font-medium text-sm transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: profile.colors.primary, color: "white" }}>
            دخول
          </button>
          <Link href="/"
            className="flex items-center justify-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity">
            <ArrowRight size={12} /> العودة للبروفايل
          </Link>
        </div>
      </div>
    );
  }

  /* ── Dashboard ── */
  return (
    <div className="min-h-screen" style={{ background: profile.colors.background, color: profile.colors.text }}>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-md"
        style={{ background: `${profile.colors.background}cc` }}>
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-bold text-sm">لوحة التحكم</h1>
          <div className="flex items-center gap-2">
            <Link href="/"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <Eye size={13} /> عرض البروفايل
            </Link>
            <button onClick={handleSave}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ background: saved ? "#10b981" : profile.colors.primary, color: "white" }}>
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
          <ImageUploader label="صورة الغلاف (Banner)" value={profile.banner}
            onChange={(v) => updateProfile({ banner: v })} aspectRatio="banner" />
          <ImageUploader label="الصورة الشخصية (Avatar)" value={profile.avatar}
            onChange={(v) => updateProfile({ avatar: v })} aspectRatio="square" />
        </section>

        {/* Profile info */}
        <section className="glass-card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold opacity-80">المعلومات الشخصية</h2>
          <div className="flex flex-col gap-2">
            <label className="text-xs opacity-50">الاسم</label>
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={localName} onChange={(e) => setLocalName(e.target.value)} placeholder="اسمك" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs opacity-50">النبذة</label>
            <textarea className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
              rows={3} value={localBio} onChange={(e) => setLocalBio(e.target.value)}
              placeholder="نبذة قصيرة (افصل بين التاغات بـ ·)" />
          </div>
        </section>

        {/* Site identity */}
        <section className="glass-card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold opacity-80">هوية الموقع</h2>

          {/* Site name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs opacity-50">اسم التبويب (Tab Title)</label>
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={localSiteName} onChange={(e) => setLocalSiteName(e.target.value)}
              placeholder="مثال: R2yane | بروفايل" />
          </div>

          {/* Favicon */}
          <div className="flex flex-col gap-2">
            <label className="text-xs opacity-50">أيقونة الموقع (Favicon)</label>
            <div className="flex items-center gap-3">
              {/* Preview */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                {profile.favicon ? (
                  <Image src={profile.favicon} alt="favicon" width={32} height={32} className="object-contain rounded" />
                ) : (
                  <span className="text-xs opacity-30">؟</span>
                )}
              </div>
              {/* Buttons */}
              <div className="flex gap-2 flex-1">
                <button
                  onClick={() => faviconRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-colors flex-1 justify-center"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px dashed rgba(255,255,255,0.15)" }}>
                  <Upload size={12} /> رفع أيقونة
                </button>
                {profile.favicon && (
                  <button onClick={() => updateProfile({ favicon: "" })}
                    className="p-2 rounded-xl hover:bg-red-500/20 text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
              <input ref={faviconRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFavicon(f); }} />
            </div>
            <p className="text-xs opacity-30">يُنصح بصورة مربعة PNG أو ICO بحجم 32×32 أو 64×64</p>
          </div>
        </section>

        {/* Colors */}
        <section className="glass-card p-5">
          <h2 className="text-sm font-semibold opacity-80 mb-4">الألوان والمظهر</h2>
          <ColorPicker colors={profile.colors}
            onChange={(c) => updateProfile({ colors: { ...profile.colors, ...c } })} />
        </section>

        {/* Links */}
        <section className="glass-card p-5">
          <LinksManager links={profile.links} onChange={(links) => updateProfile({ links })} />
        </section>

        {/* Projects */}
        <section className="glass-card p-5">
          <ProjectsManager projects={profile.projects ?? []}
            onChange={(projects) => updateProfile({ projects })} />
        </section>

        {/* Password */}
        <section className="glass-card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold opacity-80">تغيير كلمة المرور</h2>
          <PasswordChange onSave={(pw) => updateProfile({ adminPassword: pw })} />
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
    onSave(val); setVal(""); setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <div className="flex gap-2">
      <input type="password"
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
        placeholder="كلمة المرور الجديدة" value={val} onChange={(e) => setVal(e.target.value)} />
      <button onClick={save} className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
        style={{ background: done ? "#10b981" : "rgba(99,102,241,0.3)", color: done ? "white" : "#6366f1" }}>
        {done ? "✓" : "تحديث"}
      </button>
    </div>
  );
}
