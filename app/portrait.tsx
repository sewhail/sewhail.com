"use client";

import Image from "next/image";

function revealPortrait(image: HTMLImageElement) {
  try {
    if (sessionStorage.getItem("portrait-revealed")) return;
    sessionStorage.setItem("portrait-revealed", "true");
  } catch {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  image.animate(
    reduceMotion
      ? { opacity: [0, 1] }
      : { opacity: [0, 1], transform: ["scale(1.035)", "scale(1)"] },
    {
      duration: reduceMotion ? 160 : 260,
      easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    },
  );
}

export function Portrait() {
  return (
    <div className="portrait-control">
      <Image
        src="/avatar-ink-plate.jpg"
        alt="Ink portrait of Suhail"
        width={480}
        height={560}
        className="avatar"
        priority
        onLoad={(event) => revealPortrait(event.currentTarget)}
      />
    </div>
  );
}
