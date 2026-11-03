/** Estado compartido por el movimiento. Deliberadamente sin dependencias:
 *  lo importan el cursor, la coreografía y el grafo, y si arrastrara three.js
 *  lo metería en el bundle inicial de todos ellos. */

export const pointer = { x: 0.68, y: 0.38 };

let scrollNorm = 0;
export const setScrollProgress = (p: number) => { scrollNorm = p; };
export const getScrollProgress = () => scrollNorm;

let stillCache: boolean | null = null;

/** Sin coreografía: movimiento reducido, o pestaña que cargó oculta —
 *  ahí el navegador congela requestAnimationFrame. */
export function isStill(): boolean {
  if (stillCache === null) {
    stillCache =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.hidden;
  }
  return stillCache;
}

/** El toggle avisa por evento en vez de llamar al grafo: así no necesita
 *  importarlo, y el tema sigue funcionando aunque el grafo no haya cargado. */
export const THEME_EVENT = "rx83:theme";
