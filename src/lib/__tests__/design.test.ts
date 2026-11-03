/** Las reglas de DESIGN.md, como tests.
 *
 *  Un documento que dice «usá tokens» lo cumple quien se acuerda. Esto falla el
 *  build. Cada bloque cita la sección de DESIGN.md que hace cumplir. */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { CORTES_PERMITIDOS, complemento } from "../breakpoints";

const read = (rel: string) =>
  readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), "utf8");

const css = read("app/globals.css");

/** Trozos `@media (...){ ... }` con su contenido, emparejando llaves. */
function bloquesMedia(source: string): { cond: string; body: string }[] {
  const out: { cond: string; body: string }[] = [];
  const re = /@media([^{]*)\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    let depth = 1;
    let i = re.lastIndex;
    while (i < source.length && depth > 0) {
      if (source[i] === "{") depth++;
      else if (source[i] === "}") depth--;
      i++;
    }
    out.push({ cond: m[1].trim(), body: source.slice(re.lastIndex, i - 1) });
  }
  return out;
}

/** Comentarios fuera: documentan hex a propósito. */
const sinComentarios = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "");

const COLOR_LITERAL = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;

describe("color (DESIGN.md · Carácter, Tokens)", () => {
  it("ningún literal de color dentro de un @media", () => {
    for (const { cond, body } of bloquesMedia(css)) {
      const hallado = sinComentarios(body).match(COLOR_LITERAL);
      expect(hallado, `@media ${cond} trae el literal ${hallado?.[0]}`).toBeNull();
    }
  });

  it("el único literal de color de la hoja es --brand-dot", () => {
    const lineas = sinComentarios(css)
      .split("\n")
      .filter((l) => COLOR_LITERAL.test(l))
      .map((l) => l.trim());
    expect(lineas).toHaveLength(1);
    expect(lineas[0]).toMatch(/^--brand-dot:/);
  });
});

describe("tipografía (DESIGN.md · Tipografía)", () => {
  it("ninguna familia declarada a mano", () => {
    const sueltas = sinComentarios(css)
      .split("\n")
      .filter((l) => /font-family\s*:/.test(l))
      .filter((l) => !/var\(--font-/.test(l))
      .filter((l) => !/font-family\s*:\s*inherit/.test(l))
      .map((l) => l.trim());
    expect(sueltas).toEqual([]);
  });
});

describe("cortes (DESIGN.md · Responsive)", () => {
  const anchos = [...css.matchAll(/\((max|min)-width:\s*(\d+)px\)/g)].map((m) => ({
    tipo: m[1] as "max" | "min",
    px: Number(m[2]),
  }));

  it("hay cortes que comprobar", () => {
    expect(anchos.length).toBeGreaterThan(0);
  });

  it("todo ancho sale de CORTES", () => {
    const validos = new Set([
      ...CORTES_PERMITIDOS,
      ...CORTES_PERMITIDOS.map(complemento),
    ]);
    for (const { tipo, px } of anchos) {
      expect(validos.has(px), `${tipo}-width: ${px}px no está en CORTES`).toBe(true);
    }
  });

  it("ningún número se usa como max-width y como min-width a la vez", () => {
    // Los max-width son inclusivos: el mismo número en los dos sentidos se
    // solapa en ese píxel exacto. El min-width va en el complemento +1.
    const max = new Set(anchos.filter((a) => a.tipo === "max").map((a) => a.px));
    const solapados = anchos
      .filter((a) => a.tipo === "min" && max.has(a.px))
      .map((a) => a.px);
    expect(solapados, `usar min-width: ${solapados[0] ?? 0}px + 1`).toEqual([]);
  });

  it("ningún ancho a mano en matchMedia", () => {
    for (const archivo of [
      "components/Cursor.tsx",
      "components/Motion.tsx",
      "components/ThemeToggle.tsx",
      "lib/motionState.ts",
    ]) {
      const fuente = read(archivo);
      const aMano = [...fuente.matchAll(/matchMedia\(\s*["'`]([^"'`]*)["'`]/g)]
        .map((m) => m[1])
        .filter((q) => /\d+px/.test(q));
      expect(aMano, `${archivo} escribe un ancho a mano`).toEqual([]);
    }
  });
});

describe("temas (DESIGN.md · Tokens)", () => {
  /** Los dos bloques claros son copias literales y van a divergir. */
  const bloqueClaroMedia = bloquesMedia(css)
    .find((b) => b.cond.includes("prefers-color-scheme: light"))!.body;
  const bloqueClaroAttr = css.match(
    /:root\[data-theme="light"\]\{([\s\S]*?)\n\}/,
  )![1];

  const tokens = (s: string) =>
    Object.fromEntries(
      [...s.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [
        m[1],
        m[2].trim(),
      ]),
    );

  it("los dos bloques claros declaran exactamente lo mismo", () => {
    expect(tokens(bloqueClaroAttr)).toEqual(tokens(bloqueClaroMedia));
  });

  it("todo token del tema claro existe en :root", () => {
    const raiz = tokens(css.match(/^:root\{([\s\S]*?)\n\}/m)![1]);
    for (const token of Object.keys(tokens(bloqueClaroAttr))) {
      expect(token in raiz, `${token} solo existe en claro`).toBe(true);
    }
  });

  it("--brand-dot no se redefine por tema", () => {
    expect(tokens(bloqueClaroAttr)).not.toHaveProperty("--brand-dot");
    expect(tokens(bloqueClaroMedia)).not.toHaveProperty("--brand-dot");
  });
});
