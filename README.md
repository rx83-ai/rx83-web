# rx83-web

Landing de **RX83 Agencia de IA**, en Next.js 15 (App Router, TypeScript).

Portada desde el prototipo estático de
`Claude/Projects/RX83/output/landing-rx83/page.html`, que sigue siendo útil
como referencia visual pero ya no es la fuente de verdad: este repo lo es.

## Arrancar

```bash
npm install
cp .env.example .env.local   # y poné el número de WhatsApp
npm run dev
```

`npm run build && npm start` para el build de producción.

## Lo que hay que configurar

| Qué | Dónde |
| --- | --- |
| Número de WhatsApp | `NEXT_PUBLIC_WHATSAPP_PHONE` en `.env.local`. Solo dígitos con indicativo. Sin él, el botón abre WhatsApp con el mensaje pero sin destinatario. |
| Todo el copy | `src/lib/content.ts` |
| Nombre, ciudad, metadatos | `src/lib/site.ts` |

## Estructura

```
src/
  app/
    layout.tsx     fuentes (next/font), metadatos, <html lang="es">
    page.tsx       composición de las secciones
    globals.css    tokens y estilos; manda la hoja, no los componentes
  components/      una sección por archivo; cliente solo donde hace falta
  lib/
    content.ts     el copy, como datos
    site.ts        configuración y WhatsApp
    motionState.ts estado compartido del movimiento, sin dependencias
    swarm.ts       el enjambre: simulación y bucle, sin React
```

Componentes de cliente: `Swarm`, `Motion`, `Cursor`, `ThemeToggle`.
Todo lo demás se renderiza en el servidor.

## Decisiones que conviene conocer antes de tocar

**Los tokens mandan.** Ningún componente declara colores ni familias sueltas:
todo sale de las variables de `globals.css`. El tema claro está **duplicado en
dos bloques** —`@media (prefers-color-scheme: light)` y
`:root[data-theme="light"]`—; hay que tocar los dos o el toggle manual y el
automático se desincronizan.

**`--accent-ink` es la tinta que va encima del accent**, no un gris cualquiera:
se invierte junto con él. Si cambiás uno sin el otro, los botones quedan de un
color sobre sí mismo.

**`--brand-dot` no sigue al tema.** Es lo único que conserva el azul `#2E5BFF`,
y empareja con los SVG del logotipo. Se define una sola vez, a propósito.

**La familia display solo tiene el eje `wght`** (Space Grotesk, 300–700).
Cualquier `font-variation-settings` con `wdth` u `opsz` quedaría inerte sin
aviso, y un valor fuera de rango se recorta en silencio. Cambiar de familia es
una línea en `layout.tsx`: las variables se llaman `--font-display-src`,
`--font-body-src` y `--font-mono-src` justo para eso.

**El fondo es un enjambre de agentes**, en lienzo 2D y sin librería 3D.
`lib/swarm.ts` no sabe nada de React: expone `montarSwarm(canvas, opts)` y
devuelve su propia función de limpieza; el componente solo monta y desmonta.
Un único bucle sirve a todos los lienzos y un `IntersectionObserver` evita
simular lo que no se ve.

**Los vecinos se buscan con rejilla espacial**, con tope por agente. Todos
contra todos a esta población serían millones de comparaciones por cuadro.
Medido en Node a 1600×760: 4.200 agentes, 2,6 ms por paso, sobre un
presupuesto de 16,7 ms. Hay dos guardas: por encima de 9 ms promedio la escena
avanza en pasos alternos, por encima de 15 además reduce población. En
pantallas de menos de 760 px la densidad baja a la mitad.

**Dos trampas del lienzo que ya están resueltas** y conviene no reintroducir:
reasignar `canvas.width` borra el dibujo aunque el valor sea idéntico, y el
`ResizeObserver` dispara al mostrar u ocultar; y `resize` no debe reiniciar la
simulación, solo reacomodarla.

**La coreografía vive en un solo componente** (`Motion`) y opera sobre el DOM
montado. Es deliberado: el movimiento cruza secciones y repartirlo por
componente obligaría a sincronizarlos. Incluye una red de seguridad: si el
reloj de animación no avanza —pestaña en segundo plano, equipo saturado, error
de script— descarta la coreografía y muestra el estado final. **El contenido no
puede quedar invisible.**

**El texto se parte en líneas y caracteres** para animarlo por partes. Dónde
cae cada salto solo lo sabe el navegador: el partidor mide `offsetTop` palabra
por palabra y después reconstruye. Es idempotente —el original vive en
`dataset`— y se vuelve a partir al cambiar el ancho, dejando las líneas
visibles sin reanimar. Si la coreografía no corre, el texto queda como párrafo
normal.

**La misma simulación, tres cámaras.** `fija` en hero y cierre, `cluster` en
«Por qué RX83» —sigue el centroide de una escuadra— y `agente` en «Cómo
trabajamos» —montada sobre una unidad, rota con su rumbo y salta a otra cada
5,5 s—. `Banda` es el envoltorio que pone lienzo, velo y rótulo alrededor de
una sección. Dos detalles no obvios: el centroide en un toro se promedia sobre
el círculo, no sobre las coordenadas; y al dibujar, cada agente se ubica en su
copia más cercana a la cámara, o los vecinos saltan al cruzar el borde.

El cursor aparta el enjambre en las tres cámaras: el puntero se convierte de
pantalla a mundo deshaciendo la transformación de la toma.

`lib/swarm.ts` es una **traducción directa** del motor de
`output/landing-rx83/page.html`. Las dos versiones tienen que moverse juntas.

**Los logotipos del stack llevan el nombre de cada marca**, en su propia
tipografía, en `src/lib/brandMarks.ts`; los archivos fuente quedaron en
`output/landing-rx83/assets/logos-texto/`. Van en línea sin atributo de color
para heredar `currentColor`, y cada uno lleva corrección óptica porque misma
altura de caja no es mismo peso visual. Kapso y AI SDK no tienen logotipo
público y van tipografiadas. **Nunca redibujar un logotipo a mano** — uno
aproximado es uno falso.

Al de Supabase hubo que recortarle el `viewBox` a su caja real y quitarle dos
gradientes con ids `a` y `b`, que en línea habrían chocado con la página.

## Pendientes de contenido

Vienen del doc original y siguen abiertos:

- El número de WhatsApp.
- **Ley 1581.** El doc marca como *por confirmar* que se pueda prometer
  cumplimiento, y la frase está publicada en «Por qué RX83»
  (`src/lib/content.ts`). Si no se sostiene, hay que quitarla o matizarla antes
  de salir al aire.
- No hay testimonios, cifras ni casos: están pendientes y no se inventó
  ninguno. Su lugar natural es entre «Por qué RX83» y «Cómo trabajamos».
