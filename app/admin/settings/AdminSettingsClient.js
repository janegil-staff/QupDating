"use client";
import { useAdminSettings } from "@/hooks/useAdminSettings";

export default function AdminSettingsClient() {
  const { settings, setSettings, saveSettings, loading, error } =
    useAdminSettings();

  if (loading) return <p className="text-gray-400">Loading settings…</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!settings) return <p className="text-gray-400">No settings found.</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">
        Admin Settings
      </h1>

      {/* Security Panel */}
      <Card title="Security">
        <Checkbox
          label="Enable 2FA"
          checked={settings.security?.twoFA}
          onChange={(val) =>
            setSettings((prev) => ({
              ...prev,
              security: { ...prev.security, twoFA: val },
            }))
          }
        />
        <Checkbox
          label="Require email verification"
          checked={settings.security?.emailVerification}
          onChange={(val) =>
            setSettings((prev) => ({
              ...prev,
              security: { ...prev.security, emailVerification: val },
            }))
          }
        />
        <label className="flex items-center gap-2">
          Session timeout (minutes)
          <input
            type="number"
            value={settings.security?.sessionTimeout}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                security: {
                  ...prev.security,
                  sessionTimeout: Number(e.target.value),
                },
              }))
            }
            className="px-2 py-1 rounded bg-gray-800 border border-gray-700 w-20"
          />
        </label>
      </Card>

      {/* User Management Panel */}
      <Card title="User Management">
        <label className="block mb-2">Default role for new signups:</label>
        <select
          value={settings.users?.defaultRole}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              users: { ...prev.users, defaultRole: e.target.value },
            }))
          }
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
        >
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </Card>

      {/* Moderation Panel */}
      <Card title="Content Moderation">
        <Checkbox
          label="Enable auto-ban for repeated violations"
          checked={settings.moderation?.autoBan}
          onChange={(val) =>
            setSettings((prev) => ({
              ...prev,
              moderation: { ...prev.moderation, autoBan: val },
            }))
          }
        />
      </Card>

      {/* Appearance Panel */}
      <Card title="Appearance">
        <label className="block mb-2">Theme:</label>
        <select
          value={settings.appearance?.theme}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              appearance: { ...prev.appearance, theme: e.target.value },
            }))
          }
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>

        <label className="block mb-2">Accent Color:</label>
        <input
          type="text"
          value={settings.appearance?.accentColor}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              appearance: { ...prev.appearance, accentColor: e.target.value },
            }))
          }
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </Card>

      {/* Notifications Panel */}
      <Card title="Notifications">
        <Checkbox
          label="Enable email notifications"
          checked={settings.notifications?.emailEnabled}
          onChange={(val) =>
            setSettings((prev) => ({
              ...prev,
              notifications: {
                ...prev.notifications,
                emailEnabled: val,
              },
            }))
          }
        />
        <Checkbox
          label="Enable push notifications"
          checked={settings.notifications?.pushEnabled}
          onChange={(val) =>
            setSettings((prev) => ({
              ...prev,
              notifications: {
                ...prev.notifications,
                pushEnabled: val,
              },
            }))
          }
        />
      </Card>

      {/* Integrations Panel */}
      <Card title="Integrations">
        <label className="block mb-2">API Key:</label>
        <input
          type="text"
          value={settings.integrations?.apiKey}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              integrations: { ...prev.integrations, apiKey: e.target.value },
            }))
          }
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 w-full"
        />
      </Card>

      {/* Privacy Panel */}
      <Card title="Data & Privacy">
        <Checkbox
          label="Enable GDPR compliance"
          checked={settings.privacy?.gdprEnabled}
          onChange={(val) =>
            setSettings((prev) => ({
              ...prev,
              privacy: { ...prev.privacy, gdprEnabled: val },
            }))
          }
        />
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={async () => {
            const result = await saveSettings(settings);
            if (result.success) alert("✅ Settings saved!");
            else alert("❌ " + result.error);
          }}
          className="px-6 py-2 bg-yellow-500 text-black rounded-lg shadow hover:bg-yellow-400 transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

/* Small helper components for cleaner code */
function Card({ title, children }) {
  return (
    <div className="bg-neutral-900 rounded-xl shadow-lg p-6 space-y-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-yellow-400"
      />
      {label}
    </label>
  );
}
