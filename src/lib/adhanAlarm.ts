// Adhan Alarm Utility
// Plays Adhan sound at prayer times

export interface AdhanSettings {
  enabled: boolean;
  volume: number; // 0-1
  playBeforeMinutes: number; // minutes before prayer to start adhan
}

const DEFAULT_SETTINGS: AdhanSettings = {
  enabled: true,
  volume: 0.8,
  playBeforeMinutes: 0,
};

let adhanAudio: HTMLAudioElement | null = null;
let checkInterval: NodeJS.Timeout | null = null;
let lastPlayedPrayer: string | null = null;

// Initialize Adhan audio
export function initAdhan(): void {
  if (typeof window === "undefined") return;
  
  adhanAudio = new Audio("/audio/adhan.mp3");
  adhanAudio.volume = getSettings().volume;
  adhanAudio.preload = "auto";
}

// Get settings from localStorage
export function getSettings(): AdhanSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  
  const saved = localStorage.getItem("adhanSettings");
  if (saved) {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  }
  return DEFAULT_SETTINGS;
}

// Save settings to localStorage
export function saveSettings(settings: AdhanSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("adhanSettings", JSON.stringify(settings));
  
  if (adhanAudio) {
    adhanAudio.volume = settings.volume;
  }
}

// Play Adhan
export function playAdhan(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!adhanAudio) {
      initAdhan();
    }
    
    if (!adhanAudio) {
      reject(new Error("Adhan audio not initialized"));
      return;
    }
    
    adhanAudio.currentTime = 0;
    adhanAudio.onended = () => resolve();
    adhanAudio.onerror = (e) => reject(e);
    
    adhanAudio.play().catch(reject);
  });
}

// Stop Adhan
export function stopAdhan(): void {
  if (adhanAudio) {
    adhanAudio.pause();
    adhanAudio.currentTime = 0;
  }
}

// Check if it's time for Adhan
export function checkPrayerTime(
  timings: Record<string, string>,
  currentPrayer: string
): boolean {
  const settings = getSettings();
  if (!settings.enabled) return false;
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Get current prayer time
  const prayerTime = timings[currentPrayer];
  if (!prayerTime) return false;
  
  const [h, m] = prayerTime.split(":").map(Number);
  const prayerMinutes = h * 60 + m;
  
  // Check if we're within the play window
  const diffMinutes = prayerMinutes - currentMinutes;
  
  if (diffMinutes <= settings.playBeforeMinutes && diffMinutes > -5) {
    // Check if we already played for this prayer
    if (lastPlayedPrayer !== currentPrayer) {
      lastPlayedPrayer = currentPrayer;
      return true;
    }
  }
  
  return false;
}

// Start monitoring prayer times
export function startAdhanMonitor(
  getTimings: () => Record<string, string>,
  getCurrentPrayer: () => string
): void {
  if (typeof window === "undefined") return;
  
  // Initialize audio
  initAdhan();
  
  // Check every minute
  checkInterval = setInterval(() => {
    const timings = getTimings();
    const currentPrayer = getCurrentPrayer();
    
    if (checkPrayerTime(timings, currentPrayer)) {
      playAdhan().catch(console.error);
    }
  }, 60000); // Check every minute
}

// Stop monitoring
export function stopAdhanMonitor(): void {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  stopAdhan();
  lastPlayedPrayer = null;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  
  if (Notification.permission === "granted") {
    return true;
  }
  
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return false;
}

// Show notification
export function showPrayerNotification(prayerName: string): void {
  if (typeof window === "undefined" || Notification.permission !== "granted") {
    return;
  }
  
  new Notification(`Prayer Time: ${prayerName}`, {
    body: `It's time for ${prayerName} prayer`,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    tag: `prayer-${prayerName}`,
    requireInteraction: true,
  });
}
