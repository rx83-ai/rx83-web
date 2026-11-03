import { Swarm } from "./Swarm";
import type { SwarmOpts } from "@/lib/swarm";

/** Sección con el enjambre detrás, visto con otra cámara. La simulación es
 *  la misma del hero; lo que cambia es el punto de vista, y el rótulo de la
 *  esquina dice a qué unidad o escuadra está mirando ahora. */
export function Banda({
  id,
  opts,
  alterna = false,
  children,
}: {
  id: string;
  opts: SwarmOpts;
  alterna?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`banda ${alterna ? "banda--alt" : ""}`.trim()}>
      <Swarm id={id} opts={opts} banda hudId={`hud-${id}`} />
      <div className="veil veil--banda" aria-hidden="true" />
      <p className="cam-hud mono" id={`hud-${id}`} aria-hidden="true" />
      {children}
    </div>
  );
}
