# rx83-web — entrypoint de Claude Code

Portada pública de RX83 Agencia de IA. Next.js 15 (App Router), React 19, TypeScript, CSS
plano. Sin base de datos, sin secretos, sin API.

**Esto es el SITIO. `repos/rx83-agents` es otra cosa** — el agente de WhatsApp, otro repo, otro
deploy, otro ciclo. No se mezclan.

## Antes de tocar estilo: leé `DESIGN.md`

Es el sistema de diseño y manda. Lo que no se negocia:

1. **Solo tokens.** Ningún componente declara un color ni una familia tipográfica. Si hace
   falta un valor nuevo, se agrega como token en `:root` **y en el bloque claro**, no suelto en
   la pantalla.
2. **El único literal de color del sistema es `--brand-dot`.** Está documentado y es de marca,
   no de tema.
3. **Nada de `#hex`, `rgb()` ni `hsl()` dentro de un `@media`.** Se ve bien en el tema en que
   se programó y desaparece en el otro, y para notarlo hay que estar en ese ancho Y en ese
   tema a la vez.
4. **Cortes solo del conjunto permitido** (`src/lib/breakpoints.ts`), y los `min-width` van en
   el complemento **+1** para que ninguna pareja se solape.
5. **Si lo que manda es el espacio disponible y no el dispositivo, no se pone un corte.** Se
   resuelve con `auto-fit`, `flex-wrap` o `clamp`.

`npm test` hace cumplir las cinco. No son sugerencias: son tests.

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm test             # reglas del sistema de diseño
npm run typecheck    # tsc --noEmit
npm run build        # producción
```

## Ver el sitio

El dev server se levanta con **`preview_start`** (hay entrada en `.claude/launch.json`),
**nunca con Bash**: `npm run build` y `next dev` comparten `.next` y se pisan.

**Medir, no mirar.** `tsc` en verde no prueba que algo se vea bien. El método, las tres
trampas conocidas y cómo resolver un OKLCH a sRGB real están en `DESIGN.md`, sección «Cómo se
comprueba».

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Todo el estilo | `src/app/globals.css` |
| El sistema explicado | `DESIGN.md` |
| Cortes permitidos | `src/lib/breakpoints.ts` |
| Copy del sitio | `src/lib/content.ts` — texto aprobado, no se reescribe al pasar |
| Configuración y WhatsApp | `src/lib/site.ts` |
| Animaciones de scroll | `src/components/Motion.tsx` (GSAP) |
| Enjambre | `src/lib/swarm.ts` + `src/components/Swarm.tsx` |

## Cuidado con

- **El copy no se toca sin que lo pidan.** `content.ts` lleva texto aprobado.
- **`prefers-reduced-motion` tiene que seguir apagando todo.** Es la última regla de
  `globals.css` y gana por orden; si agregás animación, comprobá que la respeta.
- **El cursor propio y el enjambre se deciden por capacidad del dispositivo**
  (`hover: none`, `pointer: coarse`), nunca por ancho.
