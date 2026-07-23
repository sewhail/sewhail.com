"use client";

import Image from "next/image";
import { useState } from "react";

const portraits = [
  {
    src: "/avatar.jpg",
    label: "original",
    className: "avatar-original",
  },
  {
    src: "/avatar-sketch.jpg",
    label: "ink sketch",
    className: "avatar-sketch",
  },
  {
    src: "/avatar-charcoal.jpg",
    label: "charcoal sketch",
    className: "avatar-charcoal",
  },
];

export function Portrait() {
  const [activePortrait, setActivePortrait] = useState(0);
  const nextPortrait = (activePortrait + 1) % portraits.length;

  return (
    <button
      className="portrait-button"
      type="button"
      aria-label={`Show ${portraits[nextPortrait].label} portrait`}
      onClick={() => setActivePortrait(nextPortrait)}
    >
      {portraits.map((portrait, index) => (
        <Image
          key={portrait.src}
          src={portrait.src}
          alt=""
          width={64}
          height={64}
          className={`avatar ${portrait.className}${
            index === activePortrait ? "" : " is-hidden"
          }`}
          priority
        />
      ))}
      <span className="sr-only">Portrait of Suhail</span>
    </button>
  );
}
