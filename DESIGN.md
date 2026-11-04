# RX83 — sistema de diseño del sitio

> Este documento es del **sitio** (`rx83-web`). `rx83-agents` no tiene interfaz: su
> documento equivalente es el contrato del webhook, en su propio README.

Todo el estilo vive en **`src/app/globals.css`** (CSS plano por clases, sin Tailwind ni
librería de componentes). Los componentes solo usan tokens (`var(--…)`): el sistema se cambia
en los tokens, no en las pantallas. **Si añades una sección, usa los tokens; no metas hex
sueltos ni familias sueltas.**

Los valores de las tablas están **medidos en el navegador** el 2026-11-03, no leídos del
código: los tokens se declaran en OKLCH y lo que importa es a qué sRGB resuelven.

## Carácter

- **Oscuro por defecto.** `:root` declara `color-scheme: dark` y los valores oscuros. El claro
  es la variante, no al revés.
- **Escala de grises en OKLCH, croma cero.** Todos los tokens de color son `oklch(L 0 0)`. La
  luminosidad es lo único que cambia, así que los saltos entre tonos son perceptualmente
  parejos — que es lo que OKLCH compra y hex no.
- **Un solo color en todo el sitio: `--brand-dot: #2E5BFF`.** Es el punto del logotipo.
  Es color de **marca, no de tema**: se define una sola vez y no se redefine en el bloque
  claro, para que coincida con el `#2E5BFF` que los SVG de `assets/` llevan dentro del `path`.
- **El acento se invierte.** En oscuro `--accent` es casi blanco; en claro es grafito.
  `--accent-ink` es siempre su opuesto. Por eso **ningún texto sobre `--accent` puede ser un
  blanco literal**: en tema claro desaparecería.
- **Contención por filete, nunca por sombra.** No hay una sola `box-shadow` de tarjeta en el
  sistema. Las secciones se separan con `1px solid var(--line-soft)`.
- **Grano sobre todo el documento** (`body::after`, `mix-blend-mode: overlay`), a `--grain-op`:
  0.055 en oscuro, 0.04 en claro.

## Tokens de color

Medidos. La columna «hex» es a lo que resuelve el OKLCH en sRGB.

| Token | Oscuro | hex | Claro | hex | Uso |
|---|---|---|---|---|---|
| `--bg` | `oklch(.145 0 0)` | `#0a0a0a` | `oklch(.962 0 0)` | `#f2f2f2` | Fondo de página |
| `--bg-2` | `oklch(.185 0 0)` | `#131313` | `oklch(.985 0 0)` | `#fafafa` | Bandas alternas (`.banda--alt`) |
| `--bg-3` | `oklch(.225 0 0)` | `#1c1c1c` | `oklch(.925 0 0)` | `#e6e6e6` | Declarado; sin uso hoy |
| `--ink` | `oklch(.965 0 0)` | `#f3f3f3` | `oklch(.185 0 0)` | `#131313` | Títulos y texto fuerte |
| `--ink-dim` | `oklch(.715 0 0)` | `#a3a3a3` | `oklch(.455 0 0)` | `#565757` | Texto corrido secundario |
| `--ink-faint` | `oklch(.600 0 0)` | `#808080` | `oklch(.500 0 0)` | `#636363` | Mono, índices, pistas |
| `--line` | `oklch(.300 0 0)` | `#2e2e2e` | `oklch(.845 0 0)` | `#cccccc` | Borde interactivo (toggle, botón fantasma) |
| `--line-soft` | `oklch(.235 0 0)` | `#1e1e1e` | `oklch(.900 0 0)` | `#dedede` | Filete pasivo: secciones, filas, footer |
| `--accent` | `oklch(.985 0 0)` | `#fafafa` | `oklch(.255 0 0)` | `#232323` | Relleno del CTA, cuadritos, rail |
| `--accent-ink` | `oklch(.145 0 0)` | `#0a0a0a` | `oklch(.985 0 0)` | `#fafafa` | Texto sobre `--accent` |
| `--brand-dot` | `#2E5BFF` | — | *igual* | — | **Solo** el punto del logo |

`--accent-text` existe y vale lo mismo que `--accent` en los dos temas. Está separado porque
marca intención (texto acentuado, `.h1-accent`) y no relleno.

### Contraste, medido

Razones WCAG contra su fondo. Umbrales: **4.5** texto normal AA, **3.0** texto grande y
elementos gráficos.

| Par | Oscuro | Claro |
|---|---|---|
| `--ink` sobre `--bg` | 17.84 | 16.60 |
| `--ink-dim` sobre `--bg` | 7.85 | 6.48 |
| `--ink-faint` sobre `--bg` | 5.01 | 5.37 |
| `--ink-dim` sobre `--bg-2` | 7.37 | 6.95 |
| **`--ink-faint` sobre `--bg-2`** | **4.70** | 5.76 |
| `--accent-ink` sobre `--accent` | 18.97 | 15.06 |
| `--brand-dot` sobre `--bg` | 3.82 | 4.62 |

**El suelo del sistema es 4.70**: `--ink-faint` sobre `--bg-2` en tema oscuro. Pasa AA por
0.20. Cualquier token de texto más tenue, o cualquier fondo nuevo más claro que `--bg-2` en
oscuro, rompe AA. Si hace falta un cuarto nivel de tinta, no sale de bajarle luminosidad a
`--ink-faint`.

**`--brand-dot` no puede llevar texto.** A 3.82 en oscuro pasa como elemento gráfico y no como
texto. Es el punto del logo y ahí se queda.

**`--line` y `--line-soft` están muy por debajo de 3.0** (1.46 y 1.19 sobre `--bg`). Es la
decisión estética de «contención por filete», y tiene una consecuencia: **un filete nunca
puede ser el único indicador de algo**. Si un borde comunica estado, hace falta algo más.

## Tipografía

Tres familias, todas por `next/font/google`, autoalojadas: sin petición a Google en runtime y
sin salto de texto al cargar. Cada una expone su variable y `globals.css` las mapea.

| Rol | Familia | Variable | Dónde |
|---|---|---|---|
| Display | **Space Grotesk** | `--font-display` | `h1,h2,h3`, el logotipo de marcas del marquee |
| Texto | **Instrument Sans** | `--font-body` | `body`, y los títulos de sección media (`.svc-title`, `.why-t`, `.step-t`) |
| Mono | **Martian Mono** | `--font-mono` | `.mono`: etiquetas, índices, HUD de cámara |

**Dos niveles a propósito.** La display hace eco del logotipo y se reserva para los momentos
monumentales — el `h1` del hero, los títulos de sección, el cierre. Los títulos intermedios
van en la de texto a peso 600. No es un descuido: es la jerarquía.

### Escala, toda fluida

No hay tamaños fijos. Cada rol es un `clamp(mínimo, preferido, máximo)`, así que no hay cortes
tipográficos en ningún ancho.

| Token | Valor | Rol |
|---|---|---|
| `--t-h1` | `clamp(2.2rem, 5.9vw, 6.1rem)` | Hero |
| `--t-h2` | `clamp(1.9rem, 4.9vw, 4.5rem)` | Título de sección |
| `--t-h3` | `clamp(1.45rem, 2.7vw, 2.55rem)` | Título de servicio |
| `--t-lead` | `clamp(1.1rem, 1.75vw, 1.6rem)` | Entradilla |
| `--t-body` | `clamp(1rem, 1.05vw, 1.15rem)` | Cuerpo |
| `--t-mono` | `clamp(.64rem, .78vw, .72rem)` | Etiquetas en mono |

**Tracking negativo que crece con el tamaño:** −0.034em en el `h1`, −0.03em en títulos de
sección, −0.02em en los intermedios, normal en el cuerpo. La mono va al revés: **+0.14em y
versalitas**, que es lo que la hace leerse como etiqueta y no como texto.

**Peso por `font-variation-settings`, no por `font-weight`,** en los títulos grandes
(`"wght" 700`). El hero lo deja en una variable (`--h1w`) para que la animación de entrada
pueda interpolarlo.

## Medidas y ritmo

| Token | Valor | Qué es |
|---|---|---|
| `--maxw` | `1680px` | Ancho máximo del contenido |
| `--pad` | `clamp(1.25rem, 4.2vw, 4.75rem)` | Margen lateral del `.wrap` |
| `--rail` | igual que `--pad` | Posición del riel: va a `--rail / 2`, o sea a la mitad del margen |

El ritmo vertical es todo `clamp`, no una escala de pasos: `.sec` va
`clamp(5rem, 11vw, 11rem)`, el cierre `clamp(6rem, 14vw, 14rem)`. **La página respira con el
ancho**, no con cortes.

Medidas de línea en `ch`, que es lo correcto porque dependen de la tipografía y no del
viewport: `16ch` los titulares, `46ch` la entrada del hero, `52ch` el cuerpo de servicio,
`34ch` el párrafo de cierre.

## Movimiento

- **Una sola curva: `--ease: cubic-bezier(0.22, 1, 0.36, 1)`.** Salida rápida y frenada larga.
  Todo el sitio la usa; no hay una segunda.
- Duraciones entre `.3s` y `.6s`. Las de entrada por scroll viven en `Motion.tsx` con GSAP.
- **`prefers-reduced-motion: reduce` apaga todo** (`.01ms !important`) y además esconde el
  cursor. Es la última regla del archivo, a propósito: gana por orden.
- El cursor propio y el enjambre solo existen con puntero fino:
  `@media (hover: none), (pointer: coarse)` los retira. Eso se decide por **capacidad del
  dispositivo, no por ancho**, y es la forma correcta.

## Componentes

- **`.cta`** — relleno `--accent`, texto `--accent-ink`, sin radio (el sistema es de esquinas
  vivas). El hover **no cambia el fondo**: un `::before` del color del fondo sube desde abajo
  (`translateY(101%)` → `0`) y el texto pasa a `--ink`. Variantes: `.cta--ghost` (invierte el
  juego), `.cta--lg`. Siempre con `.cta-sq`, el cuadrito de 9px.
- **`.theme-toggle`** — 44×44 (el mínimo táctil), borde `--line`. El cuadrito de dentro es
  sólido en oscuro y hueco (`box-shadow: inset`) en claro.
- **`.rail`** — línea de 1px fija a la izquierda con un cuadrito de 9px que marca el avance del
  scroll por `--prog`. Desaparece en ≤900.
- **`.cursor`** — cuadrito de 10px que sigue al ratón, por `transform`.
- **`.banda` + `.swarm` + `.veil`** — dos secciones llevan el mismo enjambre detrás con cámara
  distinta. El velo es un degradado **lateral** en escritorio y **vertical** en ≤900, porque en
  vertical el texto ocupa casi todo el alto y un degradado lateral no lo protegería.
- **Cuadritos de 8–10px** como viñeta recurrente (`.hero-eyebrow i`, `.why-t i`, `.step::before`,
  `.marquee-item i`). Es la unidad gráfica de la casa.

**Esquinas vivas en todo el sistema.** No hay un solo `border-radius` fuera de
`:focus-visible` (1px) y los cuadritos. Si una pantalla nueva necesita un radio, es una
decisión de sistema, no de pantalla.

## Responsive

### La escala de hoy: cuatro cortes, y no son una escala

| Corte | Qué cambia |
|---|---|
| **900 / 901** | A **≤900** el riel desaparece, el CTA del nav se encoge y el velo del enjambre pasa de lateral a vertical. A **≥901** `.sec-head`, `.svc-in` y `.why-item` pasan a dos y tres columnas. El complemento +1 es lo que evita que los dos lados coincidan en 900. |
| **820** | `.steps` pasa a cuatro columnas (`min-width`). |
| **760** | Los enlaces del nav desaparecen; el toggle baja a 44px. |
| **680** | El texto largo del CTA desaparece. |

Casi todo lo demás es fluido (`clamp`, `ch`, `flex-wrap`), que es por qué el sistema aguanta
bien pese a tener cuatro cortes sin relación entre sí.

### Barrido de desbordamiento, medido

`document.documentElement.scrollWidth - clientWidth` en la portada:

| Ancho | Desbordamiento | Riel | `.sec-head` |
|---|---|---|---|
| 360 | **0** | oculto | 1 col (320px) |
| 768 | **0** | oculto | 1 col (688.5px) |
| 900 | **0** | oculto | 1 col (809.4px) |
| 901 | **0** | visible | 2 col (192 + 595.8) |
| 1024 | **0** | visible | 2 col (192 + 705.4) |

**Cero desbordamiento en todos los anchos.** Eso está sano y conviene que siga así.

### Por qué los `min-width` van en +1

`max-width: 900px` y `min-width: 900px` **coinciden los dos a 900px exactos**, porque los
`max-width` son inclusivos. Hasta el 2026-11-03 el sistema tenía ese solape: medido, **a 900 la
rejilla ya era de escritorio y el riel seguía oculto**, y el riel solo aparecía a 901. Un píxel
de incoherencia, invisible en la práctica, y la clase de cosa que crece.

Corregido pasando los tres `min-width: 900px` a **901**. La tabla de arriba es la medición de
después: a 900 todo es móvil, a 901 todo es escritorio.

**Regla:** los `min-width` van en el complemento **+1** (681 · 761 · 821 · 901), para que
ninguna pareja se solape ni deje hueco. `design.test.ts` falla si un número aparece en los dos
sentidos.

### Regla: si manda el ancho disponible, no pongas un corte

Un corte habla del **dispositivo**. Si lo que manda es cuánto espacio hay, se resuelve con algo
que lo mida solo: `repeat(auto-fit, minmax(Npx, 1fr))`, `flex-wrap`, `clamp()`. Este sistema ya
lo hace casi en todas partes y por eso sobrevive a sus propios cortes.

El único corte que está bien justificado como corte es **900 para el velo**: ahí no cambia el
espacio disponible, cambia la *orientación* del contenido, y eso ninguna rejilla lo deduce.

## Cómo se comprueba, y las trampas

`npm test` hace cumplir por sí solo las reglas de color, tipografía y cortes de este
documento: lo que sigue es para lo que ningún test puede ver. `tsc` en verde **no prueba que
algo se vea bien**. Hay que medir.

- El dev server se levanta con `preview_start` (`.claude/launch.json`), **nunca con Bash**:
  `npm run build` y `next dev` comparten `.next` y se pisan.
- **Medir, no mirar:** `getBoundingClientRect()` y `getComputedStyle()`. El desbordamiento
  horizontal es objetivo: `scrollWidth > clientWidth`.
- Los colores se resuelven **pintando en un canvas de 1×1 y leyendo el píxel**. Es la única
  forma fiable de saber a qué sRGB resuelve un OKLCH; `getComputedStyle` puede devolver la
  función sin resolver.

Trampas, las tres pagadas:

1. **Con el panel del navegador oculto las transiciones CSS se congelan** y `getComputedStyle`
   devuelve para siempre el valor de ANTES. Antes de medir hay que inyectar
   `*{transition:none!important;animation:none!important}`.
2. **`resize_window({colorScheme})` no cambia el tema de este sitio** cuando hay un
   `data-theme` puesto en el `<html>`: el atributo gana sobre `prefers-color-scheme`. Lo que
   funciona es `document.documentElement.setAttribute('data-theme','light')` y volver a medir.
3. **Que no desborde no quiere decir que se vea.** Una pista `minmax(0, 1fr)` se encoge a cero
   antes que desbordar, así que el barrido de desbordamiento aprueba un panel desaparecido. En
   layouts de varias columnas hay que medir **el ancho de cada columna**, no solo el de la
   página.

### Lo que este sistema ya hace bien y conviene no romper

Verificado por grep el 2026-11-03: **no hay un solo `#hex`, `rgb()` ni `hsl()` dentro de
ningún `@media`**, y el único literal de color en toda la hoja es `--brand-dot`, declarado en
`:root` y documentado. Esa es justamente la clase de regla que se rompe sin que nadie lo note,
porque un literal dentro de un `@media` solo se evalúa en un ancho que no es el del escritorio
donde se programó, y para verlo hay que estar en ese ancho **y** en ese tema a la vez.

## Deudas conocidas

La auditoría del 2026-11-03 encontró cuatro. Dos se corrigieron en el acto porque no cambian
nada de lo que se ve; las otras dos siguen abiertas porque sí lo cambian y es una decisión.

### Corregidas

- **`.tag` declaraba `font-family: "Martian Mono", monospace` a mano**, en contra de la regla
  que encabeza la hoja. Pasó a `var(--font-mono)`. Render idéntico —el token resuelve a la
  misma familia, verificado en el navegador—, y se va el riesgo de que `.tag` se quede con la
  mono vieja el día que se cambie en `layout.tsx`.
- **El solape de 900**, arriba.

Las dos las detectó `design.test.ts` la primera vez que se corrió. Es el argumento entero de
tener las reglas como tests.

### Abiertas

1. **`themeColor` está separado de `--bg`.** `layout.tsx` declara `#121212` (oscuro) y
   `#f2f1ed` (claro); los fondos reales, medidos, son **`#0a0a0a`** y **`#f2f2f2`**. El color
   del cromo del navegador no coincide con el de la página en ninguno de los dos temas. Es el
   mismo hecho escrito en dos sitios, que es por qué divergió. **Corregirlo cambia un color que
   se ve** —la barra del navegador en móvil—, así que va con el visto bueno de Fito. No hay
   test que lo vigile todavía: haría falta resolver OKLCH a sRGB en Node.
2. **El tema no se recuerda.** `ThemeToggle` escribe `data-theme` sobre `<html>` pero no
   persiste nada: al recargar vuelve a mandar la preferencia del sistema. Puede ser deliberado
   para una portada. Persistirlo cuesta un script bloqueante en el `<head>` para evitar el
   parpadeo, que es un costo real y hay que decidirlo a propósito.

## Fuera de alcance

- `output/landing-rx83/` son los prototipos en HTML de los que salió esta portada. No es
  código vivo y no sigue estos tokens.
- Los logotipos de terceros del marquee (`src/lib/brandMarks.ts`) son marcas ajenas: van
  monocromas por `currentColor` y no se les cambia el dibujo.
