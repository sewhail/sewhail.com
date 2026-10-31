"use client";

import { useEffect, useId, useState } from "react";
import { AMSTERDAM_WEATHER_URL, parseWeather, weatherCondition, type Weather } from "@/lib/amsterdam-weather";

export function CozyRoom() {
  const [open, setOpen] = useState(false);
  const [lit, setLit] = useState(false);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const id = useId();
  const clipId = `${id}-glass`;
  const captionId = `${id}-weather`;

  useEffect(() => {
    if (!open) return;
    let controller: AbortController | undefined;
    let active = true;
    async function refresh() {
      controller?.abort();
      const request = new AbortController();
      controller = request;
      const timeout = window.setTimeout(() => request.abort(), 12000);
      try {
        const response = await fetch(AMSTERDAM_WEATHER_URL, { signal: request.signal });
        if (!response.ok) throw new Error("Weather unavailable");
        const next = parseWeather(await response.json());
        if (active) { setWeather(next); setFailed(false); }
      } catch {
        if (active) { setWeather(null); setFailed(true); }
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void refresh();
    const interval = window.setInterval(refresh, 600000);
    return () => { active = false; controller?.abort(); window.clearInterval(interval); };
  }, [open, attempt]);

  const condition = weather ? weatherCondition(weather.code) : null;
  const wet = condition?.kind === "rain" || condition?.kind === "storm";
  const snowy = condition?.kind === "snow";
  const cloudy = condition && ["cloudy", "rain", "snow", "storm", "fog"].includes(condition.kind);
  const wind = weather ? weather.wind >= 20 ? "windy" : weather.wind >= 8 ? "breezy" : "calm" : undefined;

  return (
    <div className="cozy-room" data-open={open} data-lit={lit} data-weather={condition?.kind} data-wind={wind} data-night={weather ? !weather.isDay : undefined}>
      <div className="room-stage">
        <svg className="room-architecture room-architecture-wide" viewBox="0 0 1024 680" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
            <path d="M0 574H944l80 44M0 584H941l83 46" />
            <path d="M944 0v574" opacity="0.6" />
            <path d="m262 584-185 96m398-96-115 96m331-96-39 96m211-96 28 96M0 630h1024" opacity="0.55" />
          </g>
        </svg>
        <svg className="room-architecture room-architecture-narrow" viewBox="0 0 400 48" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
            <path d="M0 35h400M0 40h400" />
            <path d="m89 40-8 8m155-8 1 8m105-8 6 8" opacity="0.55" />
          </g>
        </svg>
        <div className="room-window">
          <div className="room-drawing">
            <svg viewBox="35 7 185 160" fill="none" aria-hidden="true">
              <defs><clipPath id={clipId}><rect x="61" y="29" width="133" height="113" rx="2" /></clipPath></defs>
              <g stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
                <path className="room-window-reveal" d="M51 20h153v129H51Z" />
                <path d="M51 20h153v129H51Zm0 0 6 6m147-6-6 6M51 149l6-6m147 6-6-6" strokeOpacity="0.4" />
                <path className="room-window-surround" d="M57 26q70-1 141 0v117q-70 1-141 0Z" />
                <path d="M60 29h135v112H60Z" strokeOpacity="0.45" />
                <g clipPath={`url(#${clipId})`}>
                  <path className="room-sky" d="M61 29h133v113H61z" stroke="none" />
                  {weather && condition?.kind !== "unknown" && <g className="room-weather-art">
                    {weather.isDay && weather.code <= 2 && <g className="room-sun"><path d="M173 50c0 12-18 12-18 0s18-12 18 0Z" /><path className="room-sun-rays" d="m164 35 1-3m12 8 3-2m-2 13 3 1m-8 10 2 3m-12 0v3m-13-7-3 2m2-14-3-1m7-9-2-3" fill="none" /></g>}
                    {!weather.isDay && <g><path className="room-moon" d="M167 40c-10-1-16 12-7 18 5 4 12 1 14-3-9 3-15-8-7-15Z" /><g className="room-stars" fill="currentColor" stroke="none"><circle cx="89" cy="39" r="0.8" /><circle cx="127" cy="51" r="0.6" /><circle cx="145" cy="33" r="0.7" /></g></g>}
                    {cloudy && <g className="room-clouds"><g className="room-cloud room-cloud-near"><path d="M76 61c-10-1-9-14 1-15 2-11 18-12 22-2 10-6 20 3 17 11 8-1 10 8 2 9-13 1-27-2-42-3Z" /><path d="M76 61c-10-1-9-14 1-15 2-11 18-12 22-2 10-6 20 3 17 11 8-1 10 8 2 9-13 1-27-2-42-3Z" transform="translate(-133 0)" /></g><g className="room-cloud room-cloud-far"><path d="M143 75c-9 0-11-10-4-14 5-3 8-1 10 0 1-11 18-11 20-1 10-4 19 9 10 14-12 3-24-1-36 1Z" /><path d="M143 75c-9 0-11-10-4-14 5-3 8-1 10 0 1-11 18-11 20-1 10-4 19 9 10 14-12 3-24-1-36 1Z" transform="translate(-133 0)" /></g></g>}
                    <g className="room-distant-houses" strokeOpacity="0.25" fill="currentColor" fillOpacity="0.025">
                      <path d="M59 121V98l10-7 10 7v23m0 0V91l12-10 12 10v30m0 0V99h19v22m0 0V94l12-8 11 8v27m0 0V88h15v33m0 0V97l12-9 12 9v24m0 0v-19h17v19" />
                    </g>
                    <g className="room-houses">
                      <path d="M57 134v-23h7v-11l10-11 10 11v11h7v23Zm39 0v-23l14-10 14 10v23Zm32 0v-28h7v-7h6v-7h8v7h6v7h7v28Zm39 0v-24h5V99h17v11h9v24Z" />
                      <path d="M68 114h5v6h-5Zm10 0h5v6h-5Zm-10 12h5v7h-5Zm10 0h5v7h-5Zm24-10h5v6h-5Zm10 0h5v6h-5Zm-10 12h5v6h-5Zm10 0h5v6h-5Zm24-18h5v6h-5Zm11 0h5v6h-5Zm-11 12h5v6h-5Zm11 0h5v6h-5Zm28-8h5v6h-5Zm10 0h5v6h-5Z" strokeOpacity="0.6" />
                      <path d="M69 103h10m23 8h16m17-5h20m18-6h17M58 134h140" strokeOpacity="0.65" />
                    </g>
                    <g strokeOpacity="0.55">
                      <path d="M91 133v-12m0 5c-8 0-8-9-3-10-2-6 7-8 8-2 6 0 7 10 1 12Z" fill="currentColor" fillOpacity="0.06" />
                      <path d="M61 137q61-2 133 0m-122 4h18m13-1h27m13 1h12m13-1h20" strokeOpacity="0.45" />
                    </g>
                    {(wet || snowy) && <g className={snowy ? "room-snow" : "room-rain"}>
                      {[0, 1, 2].map((layer) => <g className="room-precipitation-layer" key={layer}>
                        {[0, 1, 2, 3, 4].map((n) => snowy ? <circle key={n} cx={68 + n * 28 + layer * 5} cy={38 + (n * 17 + layer * 31) % 86} r={layer === 1 ? "1.3" : "0.8"} /> : <path key={n} d={`m${70 + n * 29 + layer * 6} ${30 + (n * 19 + layer * 27) % 90}-2 7`} />)}
                      </g>)}
                    </g>}
                    {condition?.kind === "fog" && <g className="room-fog"><path d="M54 91h137M65 102h133M55 115h131M70 127h132" /></g>}
                    {wind === "windy" && <g className="room-wind"><path d="M78 82h35q8 0 6-6m21 13h34q9 0 7-6M91 96h23" /></g>}
                  </g>}
                </g>
                <g className="room-casement room-casement-left"><path d="m63 30 63 1 1 110-65-1Z" /><path d="m64 83 61 1m-7 7v10m-3-9h3" /></g>
                <g className="room-casement room-casement-right"><path d="m129 31 63-1 1 110-65 1Z" /><path d="m130 84 61-1m-54 8v10m0-9h3" /></g>
                <path className="room-sill" d="m51 147 153 1 6 5q-81 2-164 0Z" />
                <path d="m46 153 1 3q81 2 162 0l1-3" strokeOpacity="0.55" />
                <path d="M44 18q84-3 167 0" />
                <circle cx="41" cy="18" r="2" fill="currentColor" stroke="none" />
                <circle cx="214" cy="18" r="2" fill="currentColor" stroke="none" />
                <g className="room-curtain room-curtain-left"><g className="room-curtain-fabric">
                  <path d="M49 22q9-4 18 0 10-4 19 0 10-4 19 0 11-4 19 0-4 30-3 62 0 29 2 55-6 8-13 2-7-5-14 0-6 6-13 0-7-5-14 0-10 5-20-1 5-31 4-59 0-31-4-59Z" />
                  <path d="M62 28q5 47 0 90l-1 15m20-104q3 28 1 54m-1 11-1 39m20-105q-3 47 0 105m13-103q-4 36-2 71" fill="none" />
                  <path d="M56 23v-7m21 6v-6m21 6v-6m18 6v-6" fill="none" />
                </g></g>
                <g className="room-curtain room-curtain-right"><g className="room-curtain-fabric">
                  <path d="M130 22q10-4 19 0 9-4 19 0 9-4 19 0 10-4 19 0-5 31-4 61 0 30 4 57-10 6-19 1-7-5-14 0-7 6-14 0-7-5-13 0-8 6-14-2 3-30 2-59 0-30-4-58Z" />
                  <path d="M143 29q4 36 2 73m0 11-1 20m18-104q-2 49 0 105m19-105q-5 39-1 80l1 24m13-104q-3 19-2 38" fill="none" />
                  <path d="M138 22v-6m20 6v-6m20 6v-6m20 7v-7" fill="none" />
                </g></g>
              </g>
            </svg>
            <button type="button" className="room-window-button" aria-label={open ? "Close the Amsterdam window" : "Open the window for live Amsterdam weather"} aria-expanded={open} aria-controls={captionId} onClick={() => setOpen(!open)} />
          </div>
          <div id={captionId} className="room-caption" hidden={!open}>
            <div className="room-weather-caption">
              <span className="room-weather-summary" role="status" aria-live="polite">
                {failed ? "Weather unavailable." : weather ? <><span className="room-temperature">{Math.round(weather.temperature)}°</span>{` · ${condition?.label}${wind === "windy" ? " · Windy" : ""}`}</> : "Checking the sky…"}
              </span>
              {weather && <div className="room-weather-detail">
                <span>{Math.round(weather.wind)} km/h · <time dateTime={weather.time}>{weather.time.slice(11, 16)}</time></span>
                <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" aria-label="Weather data from Open-Meteo">Open-Meteo ↗</a>
              </div>}
              {failed && <button className="room-retry" type="button" onClick={() => { setFailed(false); setAttempt(attempt + 1); }}>Try again</button>}
            </div>
          </div>
        </div>
        <div className="room-desk">
          <svg viewBox="75 87 175 115" fill="none" aria-hidden="true">
            <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="159" cy="197" rx="77" ry="3" fill="currentColor" fillOpacity="0.045" stroke="none" />
              <path className="room-table" d="m98 163 117-1q4 0 7 2l16 7q3 3-2 4-75 2-150 0-4-1 0-4Z" />
              <path d="m88 176 1 4q71 2 145-1l1-3M94 181l-2 16m9-16-2 16m126-17 2 17m5-17 2 17" />
              <path d="m168 170 15-1m5 0h7" opacity="0.35" />
              <path className="room-book" d="m103 158 26-2q2 0 3 2l7 5-29 3Z" />
              <path className="room-cup" d="m105 160 5 6 28-3v4l-28 3-5-6Z" />
              <path d="m110 166 28-3m-27 5 23-2m-27-7 5 4m17-6 5 4" opacity="0.6" />
              <path className="room-book" d="m118 166 1 5 2-1 2 1-1-6Z" />
              <path className="room-cup" d="M155 153c9-3 11 7 0 7m-13-8 1 10q5 4 11 0l2-10" />
              <ellipse className="room-cup" cx="149" cy="152" rx="7" ry="2.5" />
              <g className="room-steam"><path className="room-steam-wisp" d="M146 145q-3-3 0-6" /><path className="room-steam-wisp" d="M152 146q3-3 0-6" /></g>
              <g className="room-lamplight" stroke="none"><path d="m175 119 21-7 22 51q-32 7-67 2Z" /><ellipse cx="183" cy="164" rx="34" ry="3" /></g>
              <path d="M210 165q9 2 9 7 0 7 10 6" opacity="0.65" />
              <path className="room-lamp-base" d="M185 166q1-5 8-6h13q8 0 9 5-14 4-30 1Z" />
              <path d="m199 160 1-22 18-22-25-20m9 64 1-21 18-23-26-22" />
              <circle cx="219" cy="116" r="3.5" className="room-lamp-base" />
              <circle cx="219" cy="116" r="0.8" fill="currentColor" stroke="none" />
              <path className="room-lamp-shade" d="m182 98 10-5q2-1 3 2l6 18q-12 7-29 10l8-22q0-2 2-3Z" />
              <path d="M173 121q14-2 27-8m-14-13-5 13" opacity="0.65" />
              <g className="room-lamp-cord"><g className="room-cord-swing"><path d="M197 120q-1 7 0 12" /><path d="M197 132q3 2 0 5-3-2 0-5Z" /></g></g>
              <ellipse cx="153" cy="195" rx="31" ry="3.2" fill="currentColor" fillOpacity="0.04" strokeOpacity="0.2" />
              <g className="room-cat-body"><path className="room-cup" d="M133 193c-2-8 8-13 19-10 9 1 17 6 14 11-9 4-26 4-33-1Z" /><path d="M136 187c-8 5-4 10 5 9 7 0 9-5 4-6-4-2-6 1-4 3m9-8 2 2m-7-3 2 2" /></g>
              <path className="room-cup" d="m159 187 1-6 5 4 6-3 1 6q5 7-3 8-11 1-10-9Z" />
              <path d="m162 189 3 1m3-1 3-1m-6 5h3" />
            </g>
          </svg>
          <div className="room-plant" aria-hidden="true">
            <svg viewBox="10 106 45 62" fill="none">
              <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <g className="room-leaves"><path d="M33 147q2-17-2-25m3 18-9-10m9 2 8-10" /><path d="M31 127c-10-1-11-10-7-15 7 2 11 7 7 15Zm4 7c0-9 6-15 14-14 0 8-5 15-14 14Zm-5 6c-10 1-16-5-15-12 8-2 15 3 15 12Z" fill="currentColor" fillOpacity="0.1" /><path d="m25 116 6 9m14-1-8 8m-18 0 9 6" opacity="0.45" /></g>
                <path className="room-cup" d="m23 147 22-1-4 17q-8 3-14 0Z" />
                <path className="room-book" d="m22 145 24-1v5l-24 1Z" />
                <path d="m29 154 1 6m8-7-1 6" opacity="0.35" />
              </g>
            </svg>
          </div>
          <button type="button" className="room-lamp-button" aria-label="Reading lamp" aria-pressed={lit} onClick={() => setLit(!lit)} title={lit ? "Turn off the lamp" : "Turn on the lamp"} />
        </div>
      </div>
    </div>
  );
}
