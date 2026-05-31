"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { ProfileData } from "@/types";
import { DEFAULT_PROFILE, STORAGE_KEY } from "@/lib/constants";

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ProfileData;
        setProfile({
          ...DEFAULT_PROFILE,
          ...parsed,
          colors: { ...DEFAULT_PROFILE.colors, ...parsed.colors },
          projects: parsed.projects ?? [],
          siteName: parsed.siteName ?? DEFAULT_PROFILE.siteName,
          favicon:  parsed.favicon  ?? "",
        });
      }
    } catch {
      console.warn("Failed to load profile from localStorage");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<ProfileData>) => {
    setProfile((prev) => {
      const next: ProfileData = {
        ...prev,
        ...updates,
        colors: { ...prev.colors, ...(updates.colors ?? {}) },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        console.warn("Failed to persist profile");
      }
      return next;
    });
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
