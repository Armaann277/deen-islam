"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  House,
  BookOpen,
  Clock,
  Moon,
  ArrowLeft,
  ArrowsClockwise,
  BookmarkSimple,
  SpeakerHigh,
  Heart,
  CheckCircle,
  Star,
} from "@phosphor-icons/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FadeIn } from "./animations/MotionComponents";
import { useAdhan } from "./AdhanContext";

type Screen =
  | "home"
  | "quran"
  | "salah"
  | "dua";

const COLORS = {
  primary: "#933B5B",
  thulian: "#B5728A",
  brook: "#AABAAE",
  chalk: "#E3D6BF",
  pomelo: "#9F9679",
  veranda: "#6BB1AD",
  sky: "#A7BCBD",
  lychee: "#EDECDB",
  melon: "#E5A9A9",
  cupid: "#E6748E",
  peach: "#FCC59E",
  coral: "#FF9F9A",
  rose: "#E66277",
  deepRose: "#AD4161",
  wineRose: "#8F3858",
  deepPlum: "#562747",
};

const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

const fadeUp = (mounted: boolean, delay = 0) => ({
  opacity: mounted ? 1 : 0,
  transform: mounted ? "translateY(0)" : "translateY(20px)",
  transition: `all 0.6s ease ${delay}s`,
});

const fadeIn = (mounted: boolean, delay = 0) => ({
  opacity: mounted ? 1 : 0,
  transition: `opacity 0.5s ease ${delay}s`,
});

const scaleIn = (mounted: boolean, delay = 0) => ({
  opacity: mounted ? 1 : 0,
  transform: mounted ? "scale(1)" : "scale(0.9)",
  transition: `all 0.5s ease ${delay}s`,
});

const glass = {
  background: "rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "16px",
};

const cardBtn = {
  transition: "all 0.2s ease",
  cursor: "pointer" as const,
};

function BgImage({ src, overlay = 0.55 }: { src: string; overlay?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(231, 214, 191, ${overlay})`,
        }}
      />
    </div>
  );
}

function HomeScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const mounted = useMounted();
  const [time, setTime] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);
  const prayerRef = useRef<HTMLDivElement>(null);
  const ayahRef = useRef<HTMLDivElement>(null);
  const [currentPrayer, setCurrentPrayer] = useState({ name: "Asr", endsIn: "01 : 24 : 32", next: "Maghrib" });
  const [hijriDate, setHijriDate] = useState("");
  const [ayahData, setAyahData] = useState<{ arabic: string; english: string; surah: string; ayah: number } | null>(null);

  async function fetchAyah() {
    try {
      const [arabicRes, englishRes] = await Promise.all([
        fetch("https://api.alquran.cloud/v1/ayah/random"),
        fetch("https://api.alquran.cloud/v1/ayah/random/en.asad"),
      ]);
      const arabicData = await arabicRes.json();
      const englishData = await englishRes.json();
      setAyahData({
        arabic: arabicData.data.text,
        english: englishData.data.text,
        surah: arabicData.data.surah.englishName,
        ayah: arabicData.data.numberInSurah,
      });
    } catch {
      setAyahData({
        arabic: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
        english: "And We have certainly made the Quran easy to remember. So is there anyone who will remember?",
        surah: "Al-Qamar",
        ayah: 17,
      });
    }
  }

  useEffect(() => {
    fetchAyah();
  }, []);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    async function fetchAndStart() {
      try {
        const res = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Delhi&country=India&method=2"
        );
        const data = await res.json();
        const t = data.data.timings;
        const h = data.data.date.hijri;

        setHijriDate(`${h.day} ${h.month.en} ${h.year}`);

        const prayers = [
          { name: "Fajr", time: t.Fajr },
          { name: "Sunrise", time: t.Sunrise },
          { name: "Dhuhr", time: t.Dhuhr },
          { name: "Asr", time: t.Asr },
          { name: "Maghrib", time: t.Maghrib },
          { name: "Isha", time: t.Isha },
          { name: "Tahajjud", time: "02:00" },
        ];

        function updateCountdown() {
          const now = new Date();
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          const currentSeconds = now.getSeconds();

          for (let i = 0; i < prayers.length; i++) {
            const [h, m] = prayers[i].time.split(":").map(Number);
            const prayerMinutes = h * 60 + m;

            if (prayerMinutes > currentMinutes) {
              const prevIndex = i === 0 ? prayers.length - 1 : i - 1;
              const prevPrayer = prayers[prevIndex];
              const [ph, pm] = prevPrayer.time.split(":").map(Number);
              let prevMinutes = ph * 60 + pm;
              if (prevMinutes > currentMinutes) prevMinutes -= 1440;

              if (currentMinutes >= prevMinutes && currentMinutes < prayerMinutes) {
                const diffMinutes = prayerMinutes - currentMinutes;
                const hours = Math.floor(diffMinutes / 60);
                const mins = diffMinutes % 60;
                const secs = 59 - currentSeconds;

                setCurrentPrayer({
                  name: prevPrayer.name,
                  endsIn: `${hours.toString().padStart(2, "0")} : ${mins.toString().padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`,
                  next: prayers[i].name,
                });
                return;
              }
            }
          }
          setCurrentPrayer({ name: "Isha", endsIn: "Tomorrow", next: "Fajr" });
        }

        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
      } catch {
        // Keep default
      }
    }

    fetchAndStart();
    return () => clearInterval(countdownInterval);
  }, []);

  // GSAP animations
  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.fromTo(greetingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(prayerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
    gsap.fromTo(ayahRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: "power3.out" });
  }, { scope: containerRef });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours();
      if (h < 12) setTime("morning");
      else if (h < 17) setTime("afternoon");
      else setTime("evening");
    };
    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, []);

  const greeting =
    time === "morning"
      ? "Good Morning"
      : time === "afternoon"
        ? "Good Afternoon"
        : "Good Evening";

  return (
    <div ref={containerRef} style={{ position: "relative", minHeight: "100vh" }}>
      <BgImage src="/images/home-coastal.jpg" overlay={0.5} />

      <div style={{ position: "relative", zIndex: 1, padding: "20px", maxWidth: 480, margin: "0 auto" }}>
      <div ref={greetingRef} style={{ opacity: 0 }}>
        <FadeIn delay={0.1}>
          <p style={{ fontSize: 14, color: COLORS.thulian, marginBottom: 4 }}>
            Assalamu Alaikum
          </p>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 28,
              color: COLORS.primary,
              margin: 0,
            }}
          >
            {greeting}
          </h1>
        </FadeIn>
      </div>

      <div ref={prayerRef} style={{ opacity: 0 }}>
        <p
          style={{
            fontSize: 13,
            color: COLORS.pomelo,
            margin: "0 0 8px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Current Prayer
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${COLORS.lychee}f0, ${COLORS.chalk}f0)`,
            border: `1px solid ${COLORS.brook}30`,
            boxShadow: `0 4px 16px ${COLORS.primary}15`,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 24,
                color: COLORS.wineRose,
                margin: 0,
              }}
            >
              {currentPrayer.name}
            </h2>
            <p style={{ fontSize: 14, color: COLORS.thulian, margin: "4px 0 0" }}>
              Ends in {currentPrayer.endsIn}
            </p>
            <p style={{ fontSize: 12, color: COLORS.brook, margin: "2px 0 0" }}>
              Next: {currentPrayer.next}
            </p>
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.veranda}, ${COLORS.sky})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 12px ${COLORS.veranda}40`,
            }}
          >
            <Clock size={24} color="white" weight="fill" />
          </div>
        </div>
      </div>

      <div
        style={{
          ...glass,
          padding: 20,
          marginTop: 16,
          ...fadeUp(mounted, 0.2),
          background: `linear-gradient(135deg, ${COLORS.deepPlum}, ${COLORS.wineRose})`,
          color: "white",
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: COLORS.peach,
            margin: "0 0 12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Today&apos;s Ayah
        </p>
        {ayahData ? (
          <>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 26,
                lineHeight: 1.8,
                margin: "0 0 12px",
                textAlign: "center",
                direction: "rtl",
              }}
            >
              {ayahData.arabic}
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                margin: "0 0 8px",
                textAlign: "center",
                opacity: 0.85,
              }}
            >
              &ldquo;{ayahData.english}&rdquo;
            </p>
            <p style={{ fontSize: 12, color: COLORS.peach, margin: 0, textAlign: "right" }}>
              — {ayahData.surah} {ayahData.ayah}
            </p>
          </>
        ) : (
          <p style={{ textAlign: "center", opacity: 0.6 }}>Loading...</p>
        )}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 16,
            justifyContent: "center",
          }}
        >
          <button
            style={{
              ...cardBtn,
              background: "rgba(255,255,255,0.25)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 12,
              padding: "10px 16px",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          >
            <BookmarkSimple size={16} /> Save
          </button>
          <button
            style={{
              ...cardBtn,
              background: "rgba(255,255,255,0.25)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 12,
              padding: "10px 16px",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          >
            <SpeakerHigh size={16} /> Listen
          </button>
          <button
            onClick={fetchAyah}
            style={{
              ...cardBtn,
              background: "rgba(255,255,255,0.25)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 12,
              padding: "10px 16px",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          >
            <ArrowsClockwise size={16} /> New Ayah
          </button>
        </div>
      </div>

      <div
        style={{
          ...glass,
          padding: 20,
          marginTop: 16,
          ...fadeUp(mounted, 0.3),
          background: `linear-gradient(135deg, ${COLORS.lychee}f0, ${COLORS.chalk}f0)`,
          borderLeft: `4px solid ${COLORS.cupid}`,
          borderRadius: 12,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: COLORS.deepRose,
            margin: "0 0 8px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Daily Reminder
        </p>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 16,
            color: COLORS.wineRose,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          You are doing better than you think. Allah sees your efforts, even the
          ones no one else does. Keep going.
        </p>
      </div>

      {hijriDate && (
        <div
          style={{
            ...glass,
            padding: "12px 16px",
            marginTop: 16,
            ...fadeUp(mounted, 0.35),
            background: `linear-gradient(135deg, ${COLORS.lychee}ee, ${COLORS.chalk}ee)`,
            border: `1px solid ${COLORS.brook}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18 }}>🌙</span>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 15, color: COLORS.wineRose, fontWeight: 600 }}>
            {hijriDate}
          </span>
          <span style={{ fontSize: 12, color: COLORS.thulian, marginLeft: 4 }}>
            ({new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })})
          </span>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 16,
          ...fadeUp(mounted, 0.4),
        }}
      >
        <button
          onClick={() => navigate("quran")}
          style={{
            ...cardBtn,
            padding: 18,
            textAlign: "center",
            background: COLORS.lychee,
            border: `1px solid ${COLORS.veranda}40`,
            borderRadius: 14,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${COLORS.veranda}25`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px",
            color: COLORS.veranda,
          }}>
            <BookOpen size={24} />
          </div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 14,
              color: COLORS.wineRose,
              margin: 0,
              fontWeight: 600,
            }}
          >
            Daily Quran
          </p>
          <p style={{ fontSize: 11, color: COLORS.thulian, margin: "4px 0 0" }}>
            Read & reflect
          </p>
        </button>
        <button
          onClick={() => navigate("dua")}
          style={{
            ...cardBtn,
            padding: 18,
            textAlign: "center",
            background: COLORS.lychee,
            border: `1px solid ${COLORS.deepPlum}40`,
            borderRadius: 14,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${COLORS.deepPlum}25`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px",
            color: COLORS.deepPlum,
          }}>
            <Moon size={24} />
          </div>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 14,
              color: COLORS.wineRose,
              margin: 0,
              fontWeight: 600,
            }}
          >
            Dua
          </p>
          <p style={{ fontSize: 11, color: COLORS.thulian, margin: "4px 0 0" }}>
            Bedtime & night
          </p>
        </button>
      </div>
      </div>
    </div>
  );
}

function SalahScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const mounted = useMounted();
  const { settings, toggleAdhan, toggleSound, location, loading: adhanLoading, prayerTimes: adhanPrayerTimes } = useAdhan();
  const [rawTimings, setRawTimings] = useState<Record<string, string>>({});
  const [currentPrayer, setCurrentPrayer] = useState("");
  const [nextPrayerName, setNextPrayerName] = useState("");
  const [countdown, setCountdown] = useState("-- : -- : --");
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [hijriDate, setHijriDate] = useState("");

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    async function fetchPrayers() {
      try {
        // Use location from AdhanContext if available
        let url = "https://api.aladhan.com/v1/timingsByCity?city=Delhi&country=India&method=2";
        if (location) {
          url = `https://api.aladhan.com/v1/timings?latitude=${location.latitude}&longitude=${location.longitude}&method=2`;
        }
        const res = await fetch(url);
        const data = await res.json();
        const t = data.data.timings;
        const h = data.data.date.hijri;

        setHijriDate(`${h.day} ${h.month.en} ${h.year}`);

        setRawTimings({
          Fajr: t.Fajr,
          Sunrise: t.Sunrise,
          Dhuhr: t.Dhuhr,
          Asr: t.Asr,
          Maghrib: t.Maghrib,
          Isha: t.Isha,
          Tahajjud: "02:00",
        });
      } catch {
        setRawTimings({
          Fajr: "05:04",
          Sunrise: "06:09",
          Dhuhr: "12:14",
          Asr: "15:43",
          Maghrib: "18:19",
          Isha: "19:24",
          Tahajjud: "02:00",
        });
      }
      setLoading(false);
    }

    fetchPrayers();

    countdownInterval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const currentSeconds = now.getSeconds();

      const prayerOrder = ["Tahajjud", "Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

      let found = false;
      for (let i = 0; i < prayerOrder.length; i++) {
        const name = prayerOrder[i];
        const raw = rawTimings[name];
        if (!raw) continue;
        const [h, m] = raw.split(":").map(Number);
        const prayerMinutes = h * 60 + m;

        if (prayerMinutes > currentMinutes) {
          const prevIndex = i === 0 ? prayerOrder.length - 1 : i - 1;
          const prevName = prayerOrder[prevIndex];
          const prevRaw = rawTimings[prevName];

          if (prevRaw) {
            const [ph, pm] = prevRaw.split(":").map(Number);
            let prevMinutes = ph * 60 + pm;
            if (prevMinutes > currentMinutes) prevMinutes -= 1440;

            if (currentMinutes >= prevMinutes && currentMinutes < prayerMinutes) {
              setCurrentPrayer(prevName);
              setNextPrayerName(name);
              const diffMinutes = prayerMinutes - currentMinutes;
              const hours = Math.floor(diffMinutes / 60);
              const mins = diffMinutes % 60;
              const secs = 59 - currentSeconds;
              setCountdown(
                `${hours.toString().padStart(2, "0")} : ${mins.toString().padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`
              );
              found = true;
              break;
            }
          }
        }
      }

      if (!found) {
        setCurrentPrayer("Isha");
        setNextPrayerName("Fajr");
        setCountdown("Tomorrow");
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [rawTimings, location]);

  function formatTime(raw: string) {
    const [h, m] = raw.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
  }

  function getStatus(name: string, raw: string): "current" | "next" | "done" | "upcoming" {
    if (name === currentPrayer) return "current";
    if (name === nextPrayerName) return "next";

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [h, m] = raw.split(":").map(Number);
    const prayerMinutes = h * 60 + m;

    if (prayerMinutes <= currentMinutes) return "done";
    return "upcoming";
  }

  const prayerOrder = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "Tahajjud"];
  const mainPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha", "Tahajjud"];

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <BgImage src="/images/salah-mosque.jpg" overlay={0.55} />
      <div style={{ position: "relative", zIndex: 1, padding: "20px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => navigate("home")}
          style={{
            ...cardBtn,
            background: "none",
            border: "none",
            padding: 4,
          }}
        >
          <ArrowLeft size={24} color={COLORS.primary} />
        </button>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 24,
            color: COLORS.primary,
            margin: 0,
          }}
          {...fadeUp(mounted)}
        >
          Salah Times
        </h1>
      </div>

      {hijriDate && (
        <div
          style={{
            ...fadeUp(mounted, 0.02),
            marginBottom: 16,
            padding: "10px 16px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>🌙</span>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 14, color: COLORS.wineRose }}>
            {hijriDate}
          </span>
        </div>
      )}

      {/* Adhan Alarm Toggle */}
      <div
        style={{
          ...fadeUp(mounted, 0.04),
          marginBottom: 16,
          padding: "14px 16px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: COLORS.wineRose, margin: 0, fontWeight: 600 }}>
              Adhan Alarm
            </p>
            <p style={{ fontSize: 12, color: COLORS.thulian, margin: "2px 0 0" }}>
              {settings.enabled ? "Notification at prayer time" : "Disabled"}
            </p>
          </div>
          <button
            onClick={toggleAdhan}
            style={{
              width: 52,
              height: 28,
              borderRadius: 14,
              border: "none",
              background: settings.enabled ? COLORS.veranda : COLORS.brook,
              position: "relative",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "white",
                position: "absolute",
                top: 3,
                left: settings.enabled ? 27 : 3,
                transition: "left 0.3s ease",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              }}
            />
          </button>
        </div>
        {settings.enabled && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 12, color: COLORS.thulian, margin: 0 }}>Adhan Sound</p>
            <button
              onClick={toggleSound}
              style={{
                width: 42,
                height: 24,
                borderRadius: 12,
                border: "none",
                background: settings.soundEnabled ? COLORS.pomelo : COLORS.brook,
                position: "relative",
                cursor: "pointer",
                transition: "background 0.3s ease",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  top: 3,
                  left: settings.soundEnabled ? 21 : 3,
                  transition: "left 0.3s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                }}
              />
            </button>
          </div>
        )}
        {location && (
          <p style={{ fontSize: 11, color: COLORS.brook, margin: "6px 0 0", textAlign: "center" }}>
            📍 Auto-detected location
          </p>
        )}
      </div>

      {!loading && currentPrayer && (
        <div
          style={{
            ...glass,
            padding: 24,
            marginBottom: 20,
            textAlign: "center",
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.deepRose})`,
            borderRadius: 16,
            ...scaleIn(mounted, 0.05),
          }}
        >
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 2 }}>
            Current Prayer
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "white", margin: "0 0 8px" }}>
            {currentPrayer}
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 6px" }}>
            Ends in {countdown}
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0 }}>
            Next: {nextPrayerName}
          </p>
        </div>
      )}

      <div style={{ ...fadeUp(mounted, 0.1) }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.thulian }}>
            Loading prayer times...
          </div>
        ) : mainPrayers.map((name, i) => {
          const raw = rawTimings[name];
          if (!raw) return null;
          const status = getStatus(name, raw);

          return (
            <div
              key={name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                marginBottom: 8,
                borderRadius: 12,
                background:
                  status === "current"
                    ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.deepRose})`
                    : status === "next"
                      ? `linear-gradient(135deg, ${COLORS.wineRose}88, ${COLORS.deepPlum}88)`
                      : status === "done"
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(255,255,255,0.5)",
                backdropFilter: "blur(10px)",
                border:
                  status === "current" || status === "next"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.3)",
                color:
                  status === "current"
                    ? "white"
                    : status === "next"
                      ? "rgba(255,255,255,0.9)"
                      : status === "done"
                        ? COLORS.brook
                        : COLORS.wineRose,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.3s ease",
                transitionDelay: `${i * 0.05}s`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {status === "done" ? (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: COLORS.brook,
                      opacity: 0.5,
                    }}
                  />
                ) : status === "current" ? (
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "white",
                      boxShadow: "0 0 8px rgba(255,255,255,0.6)",
                    }}
                  />
                ) : status === "next" ? (
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.7)",
                      boxShadow: "0 0 6px rgba(255,255,255,0.4)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: COLORS.brook,
                    }}
                  />
                )}
                <span
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 18,
                    fontWeight: 600,
                    textDecoration: status === "done" ? "line-through" : "none",
                  }}
                >
                  {name}
                </span>
              </div>
              <span style={{ fontSize: 16, opacity: status === "done" ? 0.5 : 0.9 }}>
                {formatTime(raw)}
              </span>
            </div>
          );
        })}
      </div>

      {!loading && (
        <div
          style={{
            ...fadeUp(mounted, 0.25),
            marginTop: 12,
          }}
        >
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.4)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: COLORS.wineRose,
              fontFamily: "Georgia, serif",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>All Prayer Times</span>
            <span style={{ transform: showAll ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
              ▼
            </span>
          </button>

          {showAll && (
            <div
              style={{
                marginTop: 8,
                padding: 16,
                borderRadius: 12,
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                animation: "fadeSlideDown 0.3s ease",
              }}
            >
              {prayerOrder.map((name) => {
                const raw = rawTimings[name];
                if (!raw) return null;
                return (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: name !== "Tahajjud" ? "1px solid rgba(159,150,121,0.15)" : "none",
                    }}
                  >
                    <span style={{ fontFamily: "Georgia, serif", fontSize: 15, color: COLORS.wineRose }}>
                      {name}
                    </span>
                    <span style={{ fontSize: 14, color: COLORS.thulian }}>
                      {formatTime(raw)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          ...glass,
          padding: 20,
          marginTop: 24,
          ...fadeUp(mounted, 0.4),
          background: `linear-gradient(135deg, ${COLORS.lychee}, ${COLORS.chalk})`,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: COLORS.pomelo,
            margin: "0 0 8px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          After Salah Dua
        </p>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 16,
            color: COLORS.wineRose,
            margin: 0,
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          Astaghfirullah (x3)
        </p>
        <p
          style={{
            fontSize: 14,
            color: COLORS.thulian,
            margin: "8px 0 0",
            textAlign: "center",
          }}
        >
          Allahumma Antas-Salamu wa minkas-salamu, tabarakta ya dhal-jalali wal-ikram
        </p>
      </div>

      <button
        onClick={() => navigate("home")}
        style={{
          ...cardBtn,
          width: "100%",
          padding: "14px 0",
          marginTop: 20,
          borderRadius: 12,
          border: "none",
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.deepRose})`,
          color: "white",
          fontFamily: "Georgia, serif",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          ...fadeUp(mounted, 0.5),
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      >
        <ArrowsClockwise size={18} /> Mark as Prayed
      </button>
      </div>
    </div>
  );
}

function QuranScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const mounted = useMounted();
  const [ayahData, setAyahData] = useState<{ arabic: string; english: string; surah: string; ayah: number; surahNumber: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchAyah() {
      try {
        const [arabicRes, englishRes] = await Promise.all([
          fetch("https://api.alquran.cloud/v1/ayah/random"),
          fetch("https://api.alquran.cloud/v1/ayah/random/en.asad"),
        ]);
        const arabicData = await arabicRes.json();
        const englishData = await englishRes.json();
        setAyahData({
          arabic: arabicData.data.text,
          english: englishData.data.text,
          surah: arabicData.data.surah.englishName,
          ayah: arabicData.data.numberInSurah,
          surahNumber: arabicData.data.surah.number,
        });
      } catch {
        setAyahData({
          arabic: "لا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
          english: "Allah does not burden a soul beyond that it can bear.",
          surah: "Al-Baqarah",
          ayah: 286,
          surahNumber: 2,
        });
      }
      setLoading(false);
    }
    fetchAyah();
  }, []);

  const playAyah = useCallback(() => {
    if (!ayahData) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }

    setAudioLoading(true);
    const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahData.surahNumber}:${ayahData.ayah}.mp3`;
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => {
      setAudioLoading(false);
      setIsPlaying(true);
      audio.play().catch(() => {
        setIsPlaying(false);
        setAudioLoading(false);
      });
    }, { once: true });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      audioRef.current = null;
    }, { once: true });

    audio.addEventListener("error", () => {
      setAudioLoading(false);
      setIsPlaying(false);
      audioRef.current = null;
    }, { once: true });

    audio.load();
  }, [ayahData, isPlaying]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <BgImage src="/images/quran-flowers.jpg" overlay={0.5} />
      <div style={{ position: "relative", zIndex: 1, padding: "20px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => navigate("home")}
          style={{ ...cardBtn, background: "none", border: "none", padding: 4 }}
        >
          <ArrowLeft size={24} color={COLORS.primary} />
        </button>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 24,
            color: COLORS.primary,
            margin: 0,
          }}
          {...fadeUp(mounted)}
        >
          Daily Quran
        </h1>
      </div>

      <div
        style={{
          ...glass,
          padding: 28,
          textAlign: "center",
          ...scaleIn(mounted, 0.1),
          background: `linear-gradient(180deg, ${COLORS.lychee}, white)`,
        }}
      >
        {loading ? (
          <div style={{ padding: 40, color: COLORS.thulian }}>
            Loading verse...
          </div>
        ) : ayahData && (
          <>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 13,
                color: COLORS.pomelo,
                margin: "0 0 4px",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {ayahData.surah}
            </p>
            <p
              style={{
                fontSize: 13,
                color: COLORS.brook,
                margin: "0 0 20px",
              }}
            >
              Verse {ayahData.ayah}
            </p>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 28,
                color: COLORS.deepPlum,
                lineHeight: 1.8,
                margin: "0 0 20px",
                direction: "rtl",
              }}
            >
              {ayahData.arabic}
            </p>
        <div
          style={{
            width: 60,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.cupid}, transparent)`,
            margin: "0 auto 20px",
          }}
        />
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 17,
            color: COLORS.wineRose,
            margin: "0 0 8px",
            lineHeight: 1.6,
          }}
        >
          &ldquo;{ayahData.english}&rdquo;
        </p>
        <p
          style={{
            fontSize: 14,
            color: COLORS.thulian,
            margin: 0,
          }}
        >
          — {ayahData.surah} {ayahData.ayah}
        </p>
          </>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 20,
          ...fadeUp(mounted, 0.3),
        }}
      >
        <button
          style={{
            ...cardBtn,
            flex: 1,
            padding: "14px 0",
            borderRadius: 12,
            border: `1px solid ${COLORS.thulian}30`,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            color: COLORS.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        >
          <BookmarkSimple size={20} /> Save
        </button>
        <button
          onClick={playAyah}
          style={{
            ...cardBtn,
            flex: 1,
            padding: "14px 0",
            borderRadius: 12,
            border: `1px solid ${COLORS.thulian}30`,
            background: isPlaying ? `${COLORS.veranda}20` : "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            color: isPlaying ? COLORS.veranda : COLORS.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        >
          <SpeakerHigh size={20} /> {audioLoading ? "Loading..." : isPlaying ? "Playing..." : "Listen"}
        </button>
        <button
          style={{
            ...cardBtn,
            flex: 1,
            padding: "14px 0",
            borderRadius: 12,
            border: `1px solid ${COLORS.thulian}30`,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            color: COLORS.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        >
          <Heart size={20} /> Share
        </button>
      </div>
      </div>
    </div>
  );
}

function DuaScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const mounted = useMounted();
  const [checklist, setChecklist] = useState([false, false, false, false, false]);

  const toggle = (i: number) => {
    setChecklist((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const items = [
    "Put your phone away",
    "Read Surah Al-Mulk",
    "Say SubhanAllah 33x",
    "Make dua for someone you love",
    "Sleep with Wudu",
  ];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <BgImage src="/images/night-flowers.jpg" overlay={0.65} />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: `linear-gradient(180deg, rgba(86, 39, 71, 0.3), rgba(86, 39, 71, 0.5))`,
          padding: "20px",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => navigate("home")}
          style={{ ...cardBtn, background: "none", border: "none", padding: 4 }}
        >
          <ArrowLeft size={24} color={COLORS.peach} />
        </button>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 24,
            color: COLORS.peach,
            margin: 0,
          }}
          {...fadeUp(mounted)}
        >
          Dua
        </h1>
      </div>

      <div style={{ textAlign: "center", marginBottom: 32, ...fadeUp(mounted, 0.1) }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.peach}40, ${COLORS.peach}10)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: `0 0 40px ${COLORS.peach}30`,
          }}
        >
          <Moon size={40} color={COLORS.peach} weight="fill" />
        </div>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 18,
            color: COLORS.lychee,
            margin: 0,
            opacity: 0.9,
          }}
        >
          Prepare your heart for sleep
        </p>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          border: "1px solid rgba(255,255,255,0.1)",
          ...fadeUp(mounted, 0.2),
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: COLORS.peach,
            margin: "0 0 16px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Bedtime Checklist
        </p>
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              cursor: "pointer",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateX(0)" : "translateX(-15px)",
              transition: `all 0.3s ease ${0.3 + i * 0.05}s`,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                border: `2px solid ${checklist[i] ? COLORS.veranda : "rgba(255,255,255,0.3)"}`,
                background: checklist[i] ? COLORS.veranda : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            >
              {checklist[i] && <CheckCircle size={16} color="white" weight="fill" />}
            </div>
            <span
              style={{
                fontSize: 15,
                color: checklist[i] ? COLORS.brook : COLORS.lychee,
                textDecoration: checklist[i] ? "line-through" : "none",
                transition: "all 0.3s ease",
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          borderRadius: 16,
          padding: 20,
          border: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center",
          ...fadeUp(mounted, 0.4),
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: COLORS.peach,
            margin: "0 0 12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Night Dua
        </p>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 18,
            color: COLORS.lychee,
            margin: 0,
            lineHeight: 1.6,
            direction: "rtl",
          }}
        >
          بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا
        </p>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 15,
            color: COLORS.brook,
            margin: "12px 0 0",
            lineHeight: 1.6,
          }}
        >
          &ldquo;In Your name, O Allah, I die and I live.&rdquo;
        </p>
      </div>
      </div>
    </div>
  );
}

export default function AppShell() {
  const [screen, setScreen] = useState<Screen>("home");

  const navItems: { screen: Screen; icon: React.ReactNode; label: string }[] = [
    { screen: "home", icon: <House size={22} />, label: "Home" },
    { screen: "quran", icon: <BookOpen size={22} />, label: "Quran" },
    { screen: "salah", icon: <Clock size={22} />, label: "Salah" },
    { screen: "dua", icon: <Moon size={22} />, label: "Dua" },
  ];

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <HomeScreen navigate={setScreen} />;
      case "quran":
        return <QuranScreen navigate={setScreen} />;
      case "salah":
        return <SalahScreen navigate={setScreen} />;
      case "dua":
        return <DuaScreen navigate={setScreen} />;
      default:
        return <HomeScreen navigate={setScreen} />;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${COLORS.lychee}, white)`,
        fontFamily: "system-ui, -apple-system, sans-serif",
        paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <main style={{ 
        height: "calc(100vh - 80px - env(safe-area-inset-bottom, 0px))",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}>{renderScreen()}</main>

      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: `1px solid ${COLORS.lychee}`,
          display: "flex",
          justifyContent: "center",
          gap: 0,
          padding: "8px 0",
          paddingBottom: "max(8px, env(safe-area-inset-bottom))",
          zIndex: 100,
        }}
      >
        {navItems.map((item) => {
          const isActive = screen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => setScreen(item.screen)}
              style={{
                ...cardBtn,
                background: "none",
                border: "none",
                padding: "10px 24px",
                minHeight: 48,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                color: isActive ? COLORS.primary : COLORS.brook,
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  transform: isActive ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.2s ease",
                }}
              >
                {item.icon}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: isActive ? 0.3 : 0,
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: COLORS.primary,
                    marginTop: -2,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
