"use client";

import { useEffect, useRef } from "react";
import { isStill } from "@/lib/motionState";

/** Cuadrado que sigue al puntero y crece sobre lo interactivo.
 *  Solo con ratón: en táctil estorba. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || isStill()) return;

    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy, cs = 1, ts = 1;
    let raf = 0;

    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; el.style.opacity = "1"; };
    const down = () => { ts = 0.6; };
    const up = () => { ts = 1; };
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", down);
    addEventListener("pointerup", up);

    const targets = Array.from(document.querySelectorAll("a, button"));
    const enter = () => { ts = 3.2; };
    const leave = () => { ts = 1; };
    targets.forEach((t) => { t.addEventListener("pointerenter", enter); t.addEventListener("pointerleave", leave); });

    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cs += (ts - cs) * 0.15;
      el.style.transform = `translate(${cx - 5}px,${cy - 5}px) scale(${cs})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
      targets.forEach((t) => { t.removeEventListener("pointerenter", enter); t.removeEventListener("pointerleave", leave); });
    };
  }, []);

  return <div className="cursor" ref={ref} aria-hidden="true" />;
}
