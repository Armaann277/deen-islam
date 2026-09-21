"use client";

import { useState, useEffect } from "react";
import {
  getSettings,
  saveSettings,
  playAdhan,
  stopAdhan,
  requestNotificationPermission,
  AdhanSettings,
} from "@/lib/adhanAlarm";

interface AdhanSettingsProps {
  onClose: () => void;
}

export default function AdhanSettingsPanel({ onClose }: AdhanSettingsProps) {
  const [settings, setSettings] = useState<AdhanSettings>({
    enabled: true,
    volume: 0.8,
    playBeforeMinutes: 0,
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
    requestNotificationPermission().then(setNotificationsEnabled);
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    onClose();
  };

  const handleTestAdhan = async () => {
    try {
      await playAdhan();
    } catch (error) {
      console.error("Failed to play adhan:", error);
    }
  };

  const handleStopAdhan = () => {
    stopAdhan();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 24,
          maxWidth: 340,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 20,
            color: "#562747",
            margin: "0 0 20px",
            textAlign: "center",
          }}
        >
          Adhan Settings
        </h2>

        {/* Enable/Disable */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 15, color: "#562747" }}>
              Enable Adhan Alarm
            </span>
            <div
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                background: settings.enabled ? "#933B5B" : "#AABAAE",
                position: "relative",
                transition: "background 0.3s",
                cursor: "pointer",
              }}
              onClick={() =>
                setSettings({ ...settings, enabled: !settings.enabled })
              }
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  background: "white",
                  position: "absolute",
                  top: 2,
                  left: settings.enabled ? 22 : 2,
                  transition: "left 0.3s",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </label>
        </div>

        {/* Volume */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              fontSize: 15,
              color: "#562747",
              marginBottom: 8,
            }}
          >
            Volume: {Math.round(settings.volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.volume}
            onChange={(e) =>
              setSettings({ ...settings, volume: parseFloat(e.target.value) })
            }
            style={{ width: "100%" }}
          />
        </div>

        {/* Test Button */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button
            onClick={handleTestAdhan}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              background: "#933B5B",
              color: "white",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Test Adhan
          </button>
          <button
            onClick={handleStopAdhan}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              background: "#AABAAE",
              color: "white",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Stop
          </button>
        </div>

        {/* Notifications */}
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: notificationsEnabled ? "#E8F5E9" : "#FFF3E0",
            marginBottom: 20,
          }}
        >
          <p style={{ fontSize: 13, margin: 0, color: "#562747" }}>
            {notificationsEnabled
              ? "✓ Notifications enabled"
              : "⚠ Notifications not enabled. Enable in browser settings."}
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #933B5B, #AD4161)",
            color: "white",
            border: "none",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
