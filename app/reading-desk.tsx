"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type DeskState = {
  on: boolean;
  toggle: () => void;
};

const DeskContext = createContext<DeskState | null>(null);

export function useReadingDesk() {
  const desk = useContext(DeskContext);
  if (!desk) throw new Error("Reading-desk controls need a ReadingDesk provider.");
  return desk;
}

export function ReadingDesk({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);

  return (
    <DeskContext.Provider value={{ on, toggle: () => setOn((previous) => !previous) }}>
      <main id="main-content" tabIndex={-1} className="page home-page" data-desk-mode={on}>
        {children}
      </main>
    </DeskContext.Provider>
  );
}
