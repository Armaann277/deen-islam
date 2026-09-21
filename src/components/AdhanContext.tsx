"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  getAdhanSettings,
  saveAdhanSettings,
  scheduleAdhanAlarms,
  cancelAllAlarms,
  rescheduleAlarms,
  type AdhanSettings,
} from "@/lib/adhanScheduler";
import {
  getLocation,
  type UserLocation,
} from "@/lib/locationService";
import {
  getPrayerTimesByCoords,
  formatPrayerTime,
} from "@/lib/prayerTimesApi";

interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface AdhanContextType {
  settings: AdhanSettings;
  toggleAdhan: () => void;
  toggleSound: () => void;
  location: UserLocation | null;
  loading: boolean;
  prayerTimes: PrayerTimesData | null;
  nextPrayer: string;
  nextPrayerTime: string;
  refreshPrayerTimes: () => Promise<void>;
}

const AdhanContext = createContext<AdhanContextType | null>(null);

export function useAdhan() {
  const ctx = useContext(AdhanContext);
  if (!ctx) throw new Error("useAdhan must be used within AdhanProvider");
  return ctx;
}

function getNextPrayerInfo(timings: PrayerTimesData): {
  name: string;
  time: string;
} {
  const now = new Date();
  const prayers = [
    { name: "Fajr", time: timings.Fajr },
    { name: "Sunrise", time: timings.Sunrise },
    { name: "Dhuhr", time: timings.Dhuhr },
    { name: "Asr", time: timings.Asr },
    { name: "Maghrib", time: timings.Maghrib },
    { name: "Isha", time: timings.Isha },
  ];

  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(":").map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);
    if (prayerTime > now) {
      return { name: prayer.name, time: prayer.time };
    }
  }

  return { name: "Fajr", time: prayers[0].time };
}

export function AdhanProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AdhanSettings>({
    enabled: true,
    soundEnabled: true,
  });
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [nextPrayer, setNextPrayer] = useState("");
  const [nextPrayerTime, setNextPrayerTime] = useState("");

  const fetchPrayerTimes = useCallback(async (loc: UserLocation) => {
    try {
      const response = await getPrayerTimesByCoords(
        loc.latitude,
        loc.longitude
      );
      const timings = response.data.timings;
      setPrayerTimes(timings);

      const next = getNextPrayerInfo(timings);
      setNextPrayer(next.name);
      setNextPrayerTime(formatPrayerTime(next.time));
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
    }
  }, []);

  const refreshPrayerTimes = useCallback(async () => {
    if (location) {
      await fetchPrayerTimes(location);
    }
  }, [location, fetchPrayerTimes]);

  const toggleAdhan = useCallback(() => {
    setSettings((prev) => {
      const newSettings = { ...prev, enabled: !prev.enabled };
      saveAdhanSettings(newSettings);
      if (newSettings.enabled && location) {
        scheduleAdhanAlarms(location);
      } else {
        cancelAllAlarms();
      }
      return newSettings;
    });
  }, [location]);

  const toggleSound = useCallback(() => {
    setSettings((prev) => {
      const newSettings = { ...prev, soundEnabled: !prev.soundEnabled };
      saveAdhanSettings(newSettings);
      return newSettings;
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const savedSettings = getAdhanSettings();
        if (mounted) setSettings(savedSettings);

        const loc = await getLocation();
        if (!mounted) return;
        setLocation(loc);

        await fetchPrayerTimes(loc);

        if (savedSettings.enabled) {
          scheduleAdhanAlarms(loc);
        }
      } catch (error) {
        console.error("Adhan init failed:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    // Refresh prayer times every hour
    const interval = setInterval(() => {
      if (location) fetchPrayerTimes(location);
    }, 3600000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AdhanContext.Provider
      value={{
        settings,
        toggleAdhan,
        toggleSound,
        location,
        loading,
        prayerTimes,
        nextPrayer,
        nextPrayerTime,
        refreshPrayerTimes,
      }}
    >
      {children}
    </AdhanContext.Provider>
  );
}
