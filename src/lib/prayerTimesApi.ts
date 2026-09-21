// Prayer Times API - AlAdhan (Free, no API key needed)
// Documentation: https://api.aladhan.com/v1/documentation

const BASE_URL = "https://api.aladhan.com/v1";

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: PrayerTimes;
    date: {
      readable: string;
      timestamp: string;
      hijri: {
        date: string;
        format: string;
        day: string;
        weekday: { en: string; ar: string };
        month: { number: number; en: string; ar: string; days: number };
        year: string;
      };
      gregorian: {
        date: string;
        format: string;
        day: string;
        weekday: { en: string };
        month: { number: number; en: string };
        year: string;
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
      };
    };
  };
}

// Get prayer times by city
export async function getPrayerTimesByCity(
  city: string,
  country: string,
  method: number = 2 // ISNA
): Promise<PrayerTimesResponse> {
  const response = await fetch(
    `${BASE_URL}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`
  );
  if (!response.ok) throw new Error("Failed to fetch prayer times");
  return response.json();
}

// Get prayer times by coordinates
export async function getPrayerTimesByCoords(
  latitude: number,
  longitude: number,
  method: number = 2
): Promise<PrayerTimesResponse> {
  const response = await fetch(
    `${BASE_URL}/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`
  );
  if (!response.ok) throw new Error("Failed to fetch prayer times");
  return response.json();
}

// Get next prayer time
export async function getNextPrayer(
  city: string,
  country: string,
  method: number = 2
): Promise<{ nextPrayer: string; time: string; countdown: string }> {
  const data = await getPrayerTimesByCity(city, country, method);
  const timings = data.data.timings;
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
    const prayerTime = new Date(now);
    prayerTime.setHours(hours, minutes, 0, 0);

    if (prayerTime > now) {
      const diff = prayerTime.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      return {
        nextPrayer: prayer.name,
        time: prayer.time,
        countdown: `${h.toString().padStart(2, "0")} : ${m.toString().padStart(2, "0")} : ${s.toString().padStart(2, "0")}`,
      };
    }
  }

  // All prayers have passed, next is tomorrow's Fajr
  return {
    nextPrayer: "Fajr",
    time: prayers[0].time,
    countdown: "Tomorrow",
  };
}

// Format time to 12-hour format
export function formatPrayerTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Get calculation methods
export function getCalculationMethods() {
  return [
    { id: 1, name: "University of Islamic Sciences, Karachi" },
    { id: 2, name: "Islamic Society of North America (ISNA)" },
    { id: 3, name: "Muslim World League" },
    { id: 4, name: "Umm Al-Qura University, Makkah" },
    { id: 5, name: "Egyptian General Authority of Survey" },
    { id: 7, name: "Institute of Geophysics, University of Tehran" },
    { id: 8, name: "Gulf Region" },
    { id: 9, name: "Kuwait" },
    { id: 10, name: "Qatar" },
    { id: 11, name: "Majlis Ugama Islam Singapura" },
    { id: 12, name: "Union Organization Islamic de France" },
    { id: 13, name: "Diyanet İşleri Başkanlığı, Turkey" },
  ];
}
