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
    <>
      <a className="skip-link" href="#main-content">
        skip to content
      </a>
      <div className="site-nav-shell">
        <Link className="site-signature" href="/" aria-label="Suhail home">
          s.
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {links.map((link) => {
            const exact = pathname === link.href;
            const ancestor =
              link.href !== "/" && pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={exact ? "page" : ancestor ? "location" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </>
  );
}
