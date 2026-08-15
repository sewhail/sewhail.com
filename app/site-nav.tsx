"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/", label: "home" },
  { href: "/notes", label: "notes" },
  { href: "/books", label: "books" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <div className="site-nav-shell">
      <nav className="site-nav" aria-label="Primary navigation">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <ThemeToggle />
    </div>
  );
}
