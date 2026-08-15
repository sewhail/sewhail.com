"use client";

import { useEffect, useRef, type MouseEvent } from "react";

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
    theme === "light" ? "#f5ecd9" : "#1a1a18",
  );
}

export function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  function updateLabel(theme: Theme) {
    buttonRef.current?.setAttribute(
      "aria-label",
      theme === "light" ? "Switch to dark theme" : "Switch to light theme",
    );
  }

  useEffect(() => {
    updateLabel(getCurrentTheme());
  }, []);

  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const nextTheme = getCurrentTheme() === "light" ? "dark" : "light";
    const viewTransitionDocument = document as ViewTransitionDocument;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!viewTransitionDocument.startViewTransition || prefersReducedMotion) {
      applyTheme(nextTheme);
      updateLabel(nextTheme);
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
      updateLabel(nextTheme);
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
            duration: 360,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
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
      ref={buttonRef}
      className="theme-toggle"
      type="button"
      aria-label="Switch color theme"
      title="Switch color theme"
      onClick={toggleTheme}
    >
      <span className="theme-icon theme-icon-sun" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3.25" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M18.36 5.64l-1.41 1.41M7.05 16.95l-1.41 1.41" />
        </svg>
      </span>
      <span className="theme-icon theme-icon-moon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </span>
    </button>
  );
}
