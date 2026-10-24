"use client";

import { useEffect, useRef, type MouseEvent } from "react";

type Theme = "dark" | "light";

const THEME_OVERRIDE_KEY = "theme-override";
const LIGHT_START_HOUR = 7;
const DARK_START_HOUR = 19;

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => {
    ready: Promise<void>;
  };
};

function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getAutomaticTheme(date = new Date()): Theme {
  const hour = date.getHours();
  return hour >= LIGHT_START_HOUR && hour < DARK_START_HOUR
    ? "light"
    : "dark";
}

function getNextThemeBoundary(date = new Date()) {
  const boundary = new Date(date);

  if (date.getHours() < LIGHT_START_HOUR) {
    boundary.setHours(LIGHT_START_HOUR, 0, 0, 0);
  } else if (date.getHours() < DARK_START_HOUR) {
    boundary.setHours(DARK_START_HOUR, 0, 0, 0);
  } else {
    boundary.setDate(boundary.getDate() + 1);
    boundary.setHours(LIGHT_START_HOUR, 0, 0, 0);
  }

  return boundary;
}

function getThemeForNow(date = new Date()): Theme {
  const savedOverride = localStorage.getItem(THEME_OVERRIDE_KEY);

  if (!savedOverride) return getAutomaticTheme(date);

  try {
    const override = JSON.parse(savedOverride) as {
      theme?: unknown;
      expiresAt?: unknown;
    };
    const isValidTheme = override.theme === "light" || override.theme === "dark";
    const isCurrent = Number(override.expiresAt) > date.getTime();

    if (isValidTheme && isCurrent) return override.theme as Theme;
  } catch {}

  localStorage.removeItem(THEME_OVERRIDE_KEY);
  return getAutomaticTheme(date);
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor?.setAttribute(
    "content",
    theme === "light" ? "#f5ecd9" : "#1a1a18",
  );
}

export function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  function updateLabel(theme: Theme) {
    const nextTheme = theme === "light" ? "dark" : "light";
    const boundary = getNextThemeBoundary();
    const boundaryTime = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(boundary);
    const label = `Switch to ${nextTheme} theme until ${boundaryTime}`;

    buttonRef.current?.setAttribute("aria-label", label);
    buttonRef.current?.setAttribute("title", label);
  }

  useEffect(() => {
    let boundaryTimer: number | undefined;

    function syncTheme() {
      const theme = getThemeForNow();
      applyTheme(theme);
      updateLabel(theme);
    }

    function scheduleBoundary() {
      window.clearTimeout(boundaryTimer);

      const now = new Date();
      const boundary = getNextThemeBoundary(now);
      const delay = Math.max(0, boundary.getTime() - now.getTime() + 100);

      boundaryTimer = window.setTimeout(() => {
        localStorage.removeItem(THEME_OVERRIDE_KEY);
        syncTheme();
        scheduleBoundary();
      }, delay);
    }

    function syncWhenVisible() {
      if (document.visibilityState === "visible") {
        syncTheme();
        scheduleBoundary();
      }
    }

    syncTheme();
    scheduleBoundary();
    document.addEventListener("visibilitychange", syncWhenVisible);
    window.addEventListener("focus", syncWhenVisible);

    return () => {
      window.clearTimeout(boundaryTimer);
      document.removeEventListener("visibilitychange", syncWhenVisible);
      window.removeEventListener("focus", syncWhenVisible);
    };
  }, []);

  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const nextTheme = getCurrentTheme() === "light" ? "dark" : "light";
    const expiresAt = getNextThemeBoundary().getTime();
    const viewTransitionDocument = document as ViewTransitionDocument;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    localStorage.setItem(
      THEME_OVERRIDE_KEY,
      JSON.stringify({ theme: nextTheme, expiresAt }),
    );

    if (
      !viewTransitionDocument.startViewTransition ||
      prefersReducedMotion ||
      event.detail === 0
    ) {
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
            duration: 240,
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
