/** Los cortes del sistema, en un solo sitio.
 *
 *  Un ancho escrito a mano en un `@media` o en un `matchMedia` no lo encuentra
 *  ninguna búsqueda el día que haya que moverlo. Estos cuatro son los únicos
 *  permitidos, y `design.test.ts` falla si aparece otro.
 *
 *  Ver DESIGN.md, sección «Responsive», para qué cambia en cada uno. */
export const CORTES = {
  /** El texto largo del CTA desaparece. */
  ctaLargo: 680,
  /** Los enlaces del nav desaparecen. */
  navEnlaces: 760,
  /** `.steps` pasa a cuatro columnas. */
  pasos: 820,
  /** Riel, velo del enjambre y las rejillas de escritorio. */
  escritorio: 900,
} as const;

export const CORTES_PERMITIDOS: readonly number[] = Object.values(CORTES);

/** Los `max-width` son inclusivos, así que un `min-width` del MISMO número se
 *  solapa con su pareja en ese píxel exacto. El complemento va en +1. */
export function complemento(corte: number): number {
  return corte + 1;
}
