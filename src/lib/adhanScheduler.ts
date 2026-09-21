// Adhan Scheduler - Triggers notifications + audio at prayer times

import { getPrayerTimesByCoords, formatPrayerTime } from "./prayerTimesApi";
import type { UserLocation } from "./locationService";

export interface AdhanSettings {
  enabled: boolean;
  soundEnabled: boolean;
}

const ADHAN_KEY = "deen-islam-adhan-settings";
const SCHEDULED_KEY = "deen-islam-scheduled-date";

let scheduledTimers: NodeJS.Timeout[] = [];

export function getAdhanSettings(): AdhanSettings {
  if (typeof window === "undefined") return { enabled: true, soundEnabled: true };
  try {
    const saved = localStorage.getItem(ADHAN_KEY);
    return saved ? JSON.parse(saved) : { enabled: true, soundEnabled: true };
  } catch {
    return { enabled: true, soundEnabled: true };
  }
}

export function saveAdhanSettings(settings: AdhanSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADHAN_KEY, JSON.stringify(settings));
}

function getPrayerDateKey(): string {
  return new Date().toISOString().split("T")[0];
}

function clearScheduledTimers(): void {
  scheduledTimers.forEach(clearTimeout);
  scheduledTimers = [];
}

async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

function showNotification(prayerName: string, time: string): void {
  if (Notification.permission !== "granted") return;

  const notification = new Notification(`Time for ${prayerName}`, {
    body: `${formatPrayerTime(time)} - It's time to pray`,
    icon: "/images/salah-mosque.jpg",
    badge: "/images/salah-mosque.jpg",
    tag: `adhan-${prayerName}`,
    requireInteraction: true,
  } as NotificationOptions);

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

function playAdhanSound(): void {
  try {
    const audio = new Audio("/audio/adhan.mp3");
    audio.volume = 0.7;
    audio.play().catch(() => {
      // Audio blocked by browser - will play on next interaction
    });
  } catch {
    // Silent fail - audio file may not exist yet
  }
}

function schedulePrayerAlarm(
  prayerName: string,
  time: string,
  soundEnabled: boolean
): void {
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const prayerTime = new Date();
  prayerTime.setHours(hours, minutes, 0, 0);

  const delay = prayerTime.getTime() - now.getTime();

  if (delay <= 0) return; // Already passed

  const timer = setTimeout(() => {
    showNotification(prayerName, time);
    if (soundEnabled) {
      playAdhanSound();
    }
  }, delay);

  scheduledTimers.push(timer);
}

export async function scheduleAdhanAlarms(
  location: UserLocation
): Promise<void> {
  const settings = getAdhanSettings();
  if (!settings.enabled) return;

  // Check if already scheduled today
  const todayKey = getPrayerDateKey();
  const lastScheduled = localStorage.getItem(SCHEDULED_KEY);
  if (lastScheduled === todayKey) return;

  clearScheduledTimers();

  try {
    const response = await getPrayerTimesByCoords(
      location.latitude,
      location.longitude
    );
    const timings = response.data.timings;

    const prayers = [
      { name: "Fajr", time: timings.Fajr },
      { name: "Dhuhr", time: timings.Dhuhr },
      { name: "Asr", time: timings.Asr },
      { name: "Maghrib", time: timings.Maghrib },
      { name: "Isha", time: timings.Isha },
    ];

    for (const prayer of prayers) {
      schedulePrayerAlarm(prayer.name, prayer.time, settings.soundEnabled);
    }

    localStorage.setItem(SCHEDULED_KEY, todayKey);
    await requestNotificationPermission();
  } catch (error) {
    console.error("Failed to schedule adhan alarms:", error);
  }
}

export function cancelAllAlarms(): void {
  clearScheduledTimers();
  localStorage.removeItem(SCHEDULED_KEY);
}

export function rescheduleAlarms(location: UserLocation): void {
  clearScheduledTimers();
  localStorage.removeItem(SCHEDULED_KEY);
  scheduleAdhanAlarms(location);
}
