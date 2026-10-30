"use client";

import { useState, useSyncExternalStore } from "react";

const BOOKMARK_KEY = "reading-desk-bookmark";
const BOOKMARK_CHANGE = "reading-desk-bookmark-change";

function getBookmark() {
  try {
    return localStorage.getItem(BOOKMARK_KEY) === "true";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(BOOKMARK_CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(BOOKMARK_CHANGE, onChange);
  };
}

export function SiteBookmark() {
  const saved = useSyncExternalStore(subscribe, getBookmark, () => false);
  const [message, setMessage] = useState("");

  function toggleBookmark() {
    const next = !getBookmark();
    try {
      if (next) localStorage.setItem(BOOKMARK_KEY, "true");
      else localStorage.removeItem(BOOKMARK_KEY);
      window.dispatchEvent(new Event(BOOKMARK_CHANGE));
      setMessage(next ? "A bookmark left on this device." : "Bookmark removed.");
    } catch {
      setMessage("This browser cannot save a bookmark. Nothing was stored.");
    }
  }

  return (
    <div className="site-bookmark">
      <button
        type="button"
        className="bookmark-control"
        aria-label="Leave a bookmark on this site"
        aria-pressed={saved}
        title="Leave a bookmark on this device, not in your browser bookmarks"
        onClick={toggleBookmark}
      >
        <svg viewBox="0 0 24 28" aria-hidden="true">
          <path d="M6 3h12v22l-6-4-6 4V3Z" />
        </svg>
      </button>
      <span className="sr-only" role="status">{message}</span>
    </div>
  );
}
