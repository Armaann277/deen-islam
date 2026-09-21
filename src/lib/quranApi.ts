const BASE_URL = 'https://api.alquran.cloud/v1';

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface SurahResponse {
  code: number;
  status: string;
  data: Surah;
}

interface AyahWithTranslation extends Ayah {
  translation?: string;
}

interface RandomAyahResponse {
  code: number;
  status: string;
  data: {
    ayahs: Ayah[];
    surah: Surah;
    number: number;
    numberOfAyahs: number;
    juz: number;
    manzil: number;
    ruku: number;
    hizbQuarter: number;
  };
}

export async function getAllSurahs(): Promise<Surah[]> {
  const response = await fetch(`${BASE_URL}/surah`);
  if (!response.ok) {
    throw new Error(`Failed to fetch surahs: ${response.status}`);
  }
  const result = await response.json();
  return result.data;
}

export async function getSurah(number: number): Promise<{ surah: Surah; ayahs: Ayah[] }> {
  const response = await fetch(`${BASE_URL}/surah/${number}/ar.alafasy`);
  if (!response.ok) {
    throw new Error(`Failed to fetch surah ${number}: ${response.status}`);
  }
  const result = await response.json();
  return {
    surah: {
      number: result.data.number,
      name: result.data.name,
      englishName: result.data.englishName,
      englishNameTranslation: result.data.englishNameTranslation,
      numberOfAyahs: result.data.numberOfAyahs,
      revelationType: result.data.revelationType,
    },
    ayahs: result.data.ayahs,
  };
}

export async function getSurahWithTranslation(number: number): Promise<{
  surah: Surah;
  ayahs: (Ayah & { translation: string })[];
}> {
  const [arabicResponse, translationResponse] = await Promise.all([
    fetch(`${BASE_URL}/surah/${number}/ar.alafasy`),
    fetch(`${BASE_URL}/surah/${number}/en.asad`),
  ]);

  if (!arabicResponse.ok) {
    throw new Error(`Failed to fetch Arabic surah ${number}: ${arabicResponse.status}`);
  }
  if (!translationResponse.ok) {
    throw new Error(`Failed to fetch translation for surah ${number}: ${translationResponse.status}`);
  }

  const arabicResult = await arabicResponse.json();
  const translationResult = await translationResponse.json();

  const ayahs = arabicResult.data.ayahs.map((ayah: Ayah, index: number) => ({
    ...ayah,
    translation: translationResult.data.ayahs[index].text,
  }));

  return {
    surah: {
      number: arabicResult.data.number,
      name: arabicResult.data.name,
      englishName: arabicResult.data.englishName,
      englishNameTranslation: arabicResult.data.englishNameTranslation,
      numberOfAyahs: arabicResult.data.numberOfAyahs,
      revelationType: arabicResult.data.revelationType,
    },
    ayahs,
  };
}

export async function getRandomAyah(): Promise<{
  ayah: Ayah;
  surah: Surah;
}> {
  const response = await fetch(`${BASE_URL}/ayah/random`);
  if (!response.ok) {
    throw new Error(`Failed to fetch random ayah: ${response.status}`);
  }
  const result = await response.json();
  return {
    ayah: result.data,
    surah: result.data.surah,
  };
}

export async function getRandomAyahWithTranslation(): Promise<{
  ayah: Ayah & { translation: string };
  surah: Surah;
}> {
  const arabicResponse = await fetch(`${BASE_URL}/ayah/random`);
  if (!arabicResponse.ok) {
    throw new Error(`Failed to fetch random ayah: ${arabicResponse.status}`);
  }
  const arabicResult = await arabicResponse.json();
  const ayahData = arabicResult.data;

  const translationResponse = await fetch(
    `${BASE_URL}/ayah/${ayahData.numberInSurah}/en.asad`
  );
  if (!translationResponse.ok) {
    throw new Error(`Failed to fetch translation: ${translationResponse.status}`);
  }
  const translationResult = await translationResponse.json();

  return {
    ayah: {
      ...ayahData,
      translation: translationResult.data.text,
    },
    surah: ayahData.surah,
  };
}

export async function getAyah(
  surah: number,
  ayah: number
): Promise<{ ayah: Ayah; surah: Surah }> {
  const response = await fetch(`${BASE_URL}/ayah/${surah}:${ayah}/ar.alafasy`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ayah ${surah}:${ayah}: ${response.status}`);
  }
  const result = await response.json();
  return {
    ayah: result.data,
    surah: result.data.surah,
  };
}

export async function getAyahWithTranslation(
  surah: number,
  ayah: number
): Promise<{ ayah: Ayah & { translation: string }; surah: Surah }> {
  const [arabicResponse, translationResponse] = await Promise.all([
    fetch(`${BASE_URL}/ayah/${surah}:${ayah}/ar.alafasy`),
    fetch(`${BASE_URL}/ayah/${surah}:${ayah}/en.asad`),
  ]);

  if (!arabicResponse.ok) {
    throw new Error(`Failed to fetch Arabic ayah ${surah}:${ayah}: ${arabicResponse.status}`);
  }
  if (!translationResponse.ok) {
    throw new Error(`Failed to fetch translation for ayah ${surah}:${ayah}: ${translationResponse.status}`);
  }

  const arabicResult = await arabicResponse.json();
  const translationResult = await translationResponse.json();

  return {
    ayah: {
      ...arabicResult.data,
      translation: translationResult.data.text,
    },
    surah: arabicResult.data.surah,
  };
}

export function getAudioUrl(surah: number, ayah: number): string {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surah}:${ayah}.mp3`;
}

export const POPULAR_SURAHS: { number: number; name: string; englishName: string; englishNameTranslation: string; description: string }[] = [
  {
    number: 1,
    name: 'الفاتحة',
    englishName: 'Al-Fatihah',
    englishNameTranslation: 'The Opening',
    description: 'The opening chapter of the Quran, recited in every unit of prayer.',
  },
  {
    number: 36,
    name: 'يس',
    englishName: 'Ya-Sin',
    englishNameTranslation: 'Ya Sin',
    description: 'Often called the "heart of the Quran," it discusses the resurrection and signs of God.',
  },
  {
    number: 55,
    name: 'الرحمن',
    englishName: 'Ar-Rahman',
    englishNameTranslation: 'The Most Merciful',
    description: 'Emphasizes God\'s abundant blessings and the consequences of human ingratitude.',
  },
  {
    number: 67,
    name: 'الملك',
    englishName: 'Al-Mulk',
    englishNameTranslation: 'The Sovereignty',
    description: 'Highlights God\'s supreme authority and the signs in creation.',
  },
  {
    number: 2,
    name: 'آية الكرسي',
    englishName: 'Ayatul Kursi',
    englishNameTranslation: 'The Verse of the Throne',
    description: 'Verse 255 of Surah Al-Baqarah. One of the most powerful verses in the Quran.',
  },
  {
    number: 112,
    name: 'الإخلاص',
    englishName: 'Al-Ikhlas',
    englishNameTranslation: 'The Sincerity',
    description: 'A declaration of the absolute oneness of God.',
  },
  {
    number: 113,
    name: 'الفلق',
    englishName: 'Al-Falaq',
    englishNameTranslation: 'The Daybreak',
    description: 'A seek of protection from the evils of creation.',
  },
  {
    number: 114,
    name: 'الناس',
    englishName: 'An-Nas',
    englishNameTranslation: 'Mankind',
    description: 'A seek of protection from the whisperings of Satan.',
  },
];
