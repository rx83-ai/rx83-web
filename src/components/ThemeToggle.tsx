"use client";

import { THEME_EVENT } from "@/lib/motionState";

/** El tema vive en data-theme sobre <html>. Sin atributo manda la
 *  preferencia del sistema, que la hoja resuelve sola por tokens. */
export function ThemeToggle() {
  function current(): "dark" | "light" {
    const root = document.documentElement;
    const set = root.getAttribute("data-theme");
    if (set === "dark" || set === "light") return set;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label="Cambiar entre tema claro y oscuro"
      onClick={() => {
        document.documentElement.setAttribute(
          "data-theme",
          current() === "dark" ? "light" : "dark",
        );
        dispatchEvent(new Event(THEME_EVENT));
      }}
    >
      <span />
    </button>
  );
}
