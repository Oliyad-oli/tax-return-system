import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

function Settings() {
  const [settings, setSettings] = useState({
    theme: "light",
    language: "en",
    emailNotifications: true,
    smsNotifications: false,
    twoFactorEnabled: false,
    sessionTimeoutMinutes: 30,
    autoLogout: true
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/settings/${user.email}`);
      setSettings(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/settings/${user.email}`, settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Apply theme immediately
      if (settings.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update settings");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading settings...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">⚙️ Settings</h1>

          {saved && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              ✅ Settings saved successfully!
            </div>
          )}

          <form onSubmit={updateSettings}>
            {/* Appearance */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Appearance</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="am">Amharic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Notifications</h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="mr-2"
                  />
                  Email Notifications
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                    className="mr-2"
                  />
                  SMS Notifications
                </label>
              </div>
            </div>

            {/* Security */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Security</h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorEnabled}
                    onChange={(e) => setSettings({ ...settings, twoFactorEnabled: e.target.checked })}
                    className="mr-2"
                  />
                  Two-Factor Authentication
                </label>
                <div>
                  <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeoutMinutes}
                    onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                    min="5"
                    max="120"
                  />
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.autoLogout}
                    onChange={(e) => setSettings({ ...settings, autoLogout: e.target.checked })}
                    className="mr-2"
                  />
                  Auto Logout After Inactivity
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Save Settings
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;