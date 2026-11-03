"use client";

import { useEffect, useRef } from "react";
import { montarSwarm, type SwarmOpts } from "@/lib/swarm";

/** Lienzo del enjambre. React solo monta y desmonta; el bucle de render, el
 *  observador de visibilidad y las guardas de rendimiento viven en lib/swarm,
 *  que no sabe nada de React. */
export function Swarm({
  id,
  opts,
  banda = false,
  hudId,
}: {
  id: string;
  opts: SwarmOpts;
  banda?: boolean;
  hudId?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    return montarSwarm(cv, opts, hudId ? document.getElementById(hudId) : null);
    // opts es un literal estable por sección
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      className={`swarm ${banda ? "swarm--banda" : ""}`.trim()}
      id={id}
      ref={ref}
      aria-hidden="true"
    />
  );
}
