// Location Service - Browser Geolocation + localStorage persistence

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

const LOCATION_KEY = "deen-islam-location";

export function getSavedLocation(): UserLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(LOCATION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveLocation(location: UserLocation): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
}

export function requestLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        saveLocation(location);
        resolve(location);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes cache
      }
    );
  });
}

export async function getLocation(): Promise<UserLocation> {
  // Try saved location first
  const saved = getSavedLocation();
  if (saved) return saved;

  // Try browser geolocation
  try {
    return await requestLocation();
  } catch {
    // Default to Delhi, India if all fails
    const fallback: UserLocation = {
      latitude: 28.6139,
      longitude: 77.209,
      city: "Delhi",
      country: "India",
    };
    saveLocation(fallback);
    return fallback;
  }
}
