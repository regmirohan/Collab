import React, { useState } from "react";
import Sidebar from "./Sidebar";

const Settings = () => {
  const [settings, setSettings] = useState({
    username: "admin",
    email: "admin@collab.com",
    notifications: true,
    darkMode: false,
    language: "English",
  });

  // Update settings state
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
    console.log("Updated Settings:", settings);
  };

  const handleCancel = () => {
    alert("Changes canceled.");
    // Reset to initial state (for example purposes, hardcoded values are used)
    setSettings({
      username: "admin",
      email: "admin@collab.com",
      notifications: true,
      darkMode: false,
      language: "English",
    });
  };

  return (
    <div className="bg-white flex w-full ">
        <Sidebar />
        <div className="p-6 w-[80%]">
        <h1 className="bg-[#044c69] w-full text-white text-2xl font-bold py-4 px-6 mb-6">Settings</h1>

      {/* General Settings */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={settings.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Account Preferences */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Account Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Enable Dark Mode</label>
          </div>
          <div>
            <label className="block font-medium mb-1">Language</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Enable Email Notifications</label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
    </div>
  );
};

export default Settings;
