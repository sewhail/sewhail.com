"use client";

import { useRef, useState } from "react";

export function DeskLamp() {
  const [on, setOn] = useState(false);
  const cordRef = useRef<SVGGElement>(null);

  function toggleLamp() {
    setOn((previous) => !previous);
    const cord = cordRef.current;
    if (!cord) return;

    cord.getAnimations().forEach((animation) => animation.cancel());
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cord.animate(
      reduceMotion
        ? { opacity: [1, 0.65, 1] }
        : { transform: ["translateY(0px)", "translateY(2px)", "translateY(0px)"] },
      {
        duration: reduceMotion ? 160 : 180,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
    );
  }

  return (
    <button
      type="button"
      className="desk-lamp"
      aria-label="Reading lamp"
      aria-pressed={on}
      title="A little light for reading"
      onClick={toggleLamp}
    >
      <svg viewBox="0 0 88 96" fill="none" aria-hidden="true">
        <path className="lamp-beam" d="m39 43 23-9 16 47H13Z" />
        <g className="lamp-lines" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 86h40M32 82h24l5 4H27l5-4ZM44 82V61L26 35l20-15" />
          <circle cx="26" cy="35" r="3" fill="var(--background)" />
          <path className="lamp-shade" d="m43 19 8-4 13 22-27 10 6-28Z" />
          <path d="m39 43 23-9" />
          <g ref={cordRef} className="lamp-cord">
            <path d="M61 40v12" />
            <circle cx="61" cy="54" r="1.5" />
          </g>
        </g>
        <ellipse className="lamp-pool" cx="45" cy="81" rx="29" ry="3" />
      </svg>
    </button>
  );
}
