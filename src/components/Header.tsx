"use client";

import { useState } from "react";
import { Menu, PenLine, X } from "lucide-react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#home" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
            <PenLine size={18} />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">CoverCraft AI</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              {l.label}
            </a>
          ))}
          <a href="#generator" className="btn btn-primary">
            Create Cover Letter
          </a>
        </nav>

        <button
          type="button"
          className="btn btn-ghost md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-slate-200 bg-white px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#generator"
                onClick={() => setOpen(false)}
                className="btn btn-primary w-full"
              >
                Create Cover Letter
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
