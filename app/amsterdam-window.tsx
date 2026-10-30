"use client";

import { useState } from "react";

export function AmsterdamWindow() {
  const [night, setNight] = useState(false);

  return (
    <figure className="amsterdam-window">
      <button
        type="button"
        className="window-control"
        aria-label="Amsterdam window"
        aria-pressed={night}
        title={night ? "Show the day scene" : "Show the night scene"}
        onClick={() => setNight((previous) => !previous)}
      >
        <svg viewBox="0 0 96 112" fill="none" aria-hidden="true">
          <rect x="8" y="8" width="80" height="88" rx="2" fill="var(--control-background)" />
          <rect className="window-night-sky" x="9" y="9" width="78" height="86" rx="1" fill="#242c39" />
          <g className="window-scene" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <circle className="window-sun" cx="67" cy="29" r="6" />
            <path className="window-moon" d="M69 21a7 7 0 1 0 5 11 7 7 0 0 1-5-11Z" />
            <path d="M15 77V54l10-11 10 11v23M35 77V48l9-4v-5h6v5l9 4v29M59 77V59l10-9 11 9v18M12 81h72M17 87h16m8 0h14m8 0h15" />
            <path d="M22 58h5m-5 7h5m16-10h8m-8 8h8m15 1h6m-6 7h6" />
          </g>
          <g stroke="currentColor" strokeWidth="1.5">
            <rect x="8" y="8" width="80" height="88" rx="2" />
            <path d="M48 8v88M8 43h80M3 101h90" />
          </g>
        </svg>
      </button>
      <figcaption>Amsterdam, imagined. <span>{night ? "Night" : "Day"}</span></figcaption>
    </figure>
  );
}
