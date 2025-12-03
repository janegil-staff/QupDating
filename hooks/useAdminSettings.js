"use client";
import { useEffect, useState } from "react";

const defaultSettings = {
  security: { twoFA: false, emailVerification: false, sessionTimeout: 30 },
  users: { defaultRole: "user" },
  moderation: { autoBan: false },
  appearance: { theme: "dark", accentColor: "pink" },
  notifications: { emailEnabled: true, pushEnabled: false },
  integrations: { apiKey: "" },
  privacy: { gdprEnabled: true },
};

export function useAdminSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.settings) {
          setSettings({ ...defaultSettings, ...data.settings });
        } else {
          setError(data.error || "Failed to load settings");
        }
      } catch (err) {
        setError("❌ Error fetching settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Save settings
  const saveSettings = async (newSettings) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings({ ...defaultSettings, ...data.settings });
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: "❌ Error saving settings" };
    }
  };

  return { settings, setSettings, saveSettings, loading, error };
}
