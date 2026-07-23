"use client";

import type { MouseEvent } from "react";

type Theme = "dark" | "light";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => {
    ready: Promise<void>;
  };
};

function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor?.setAttribute(
    "content",
    theme === "light" ? "#f5ecd9" : "#1a1a1a",
  );
}

export function ThemeToggle() {
  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const nextTheme = getCurrentTheme() === "light" ? "dark" : "light";
    const viewTransitionDocument = document as ViewTransitionDocument;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!viewTransitionDocument.startViewTransition || prefersReducedMotion) {
      applyTheme(nextTheme);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    document.documentElement.classList.add("theme-transitioning");

    const transition = viewTransitionDocument.startViewTransition(() => {
      applyTheme(nextTheme);
    });

    transition.ready
      .then(() => {
        const animation = document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 440,
            easing: "cubic-bezier(0.22, 0.75, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );

        return animation.finished;
      })
      .catch(() => undefined)
      .finally(() => {
        document.documentElement.classList.remove("theme-transitioning");
      });
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label="Switch between light and dark theme"
      title="Switch color theme"
      onClick={toggleTheme}
    >
      <span className="theme-toggle-thumb" aria-hidden="true" />
      <span className="theme-option theme-option-sun" aria-hidden="true">
        <svg viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="3.25" />
          <path d="M10 2.25v1.5M10 16.25v1.5M2.25 10h1.5M16.25 10h1.5M4.52 4.52l1.06 1.06M14.42 14.42l1.06 1.06M15.48 4.52l-1.06 1.06M5.58 14.42l-1.06 1.06" />
        </svg>
      </span>
      <span className="theme-option theme-option-moon" aria-hidden="true">
        <svg viewBox="0 0 20 20">
          <path d="M15.2 12.8A6.6 6.6 0 0 1 7.2 4.8 6.6 6.6 0 1 0 15.2 12.8Z" />
        </svg>
      </span>
    </button>
  );
}
