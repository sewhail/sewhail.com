export type Weather = {
  temperature: number;
  wind: number;
  code: number;
  isDay: boolean;
  time: string;
};

export function weatherCondition(code: number) {
  if (code === 0) return { kind: "clear", label: "Clear & dry" };
  if (code === 1) return { kind: "clear", label: "Mostly clear & dry" };
  if (code === 2) return { kind: "cloudy", label: "Partly cloudy" };
  if (code === 3) return { kind: "cloudy", label: "Cloudy" };
  if ([45, 48].includes(code)) return { kind: "fog", label: "Foggy" };
  if ([51, 53, 55, 56, 57].includes(code)) return { kind: "rain", label: "Drizzly" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { kind: "rain", label: "Rainy" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { kind: "snow", label: "Snowy" };
  if ([95, 96, 99].includes(code)) return { kind: "storm", label: "Thunderstorms" };
  return { kind: "unknown", label: "Conditions unavailable" };
}

export function parseWeather(data: unknown): Weather {
  const current = (data as { current?: Record<string, unknown> } | null)?.current;
  if (!current || typeof current.temperature_2m !== "number" ||
    typeof current.wind_speed_10m !== "number" || typeof current.weather_code !== "number" ||
    (current.is_day !== 0 && current.is_day !== 1) || typeof current.time !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(current.time) ||
    !Number.isFinite(current.temperature_2m) || !Number.isFinite(current.wind_speed_10m) ||
    !Number.isFinite(current.weather_code) || current.wind_speed_10m < 0) {
    throw new Error("Invalid weather response");
  }
  return {
    temperature: current.temperature_2m,
    wind: current.wind_speed_10m,
    code: current.weather_code,
    isDay: current.is_day === 1,
    time: current.time,
  };
}

export const AMSTERDAM_WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=52.3676&longitude=4.9041&current=temperature_2m,is_day,weather_code,wind_speed_10m&timezone=Europe%2FAmsterdam";
