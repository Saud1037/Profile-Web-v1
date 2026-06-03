"use client";

import React, {
  createContext, useContext, useState,
  useEffect, useCallback, ReactNode,
} from "react";
import { ProfileData } from "@/types";
import { DEFAULT_PROFILE } from "@/lib/constants";

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  saveProfile: () => Promise<{ ok: boolean; error?: string }>;
  isLoading: boolean;
  isSaving: boolean;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // جيب البيانات من الـ API عند التحميل
  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data: ProfileData) => {
        setProfile({ ...DEFAULT_PROFILE, ...data, colors: { ...DEFAULT_PROFILE.colors, ...data.colors } });
      })
      .catch(() => {/* استخدم الـ defaults */})
      .finally(() => setIsLoading(false));
  }, []);

  // تحديث الـ state محلياً فوراً (بدون حفظ على GitHub)
  const updateProfile = useCallback((updates: Partial<ProfileData>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
      colors: { ...prev.colors, ...(updates.colors ?? {}) },
    }));
  }, []);

  // حفظ فعلي على GitHub عبر الـ API
  const saveProfile = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error ?? "فشل الحفظ" };
      return { ok: true };
    } catch (e) {
      return { ok: false, error: String(e) };
    } finally {
      setIsSaving(false);
    }
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, saveProfile, isLoading, isSaving }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
