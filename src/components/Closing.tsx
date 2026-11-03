import { closing } from "@/lib/content";
import { Cta } from "./Cta";
import { Swarm } from "./Swarm";

export function Closing() {
  return (
    <section className="close">
      <Swarm id="swarm2" opts={{ grupos: 18, densidad: 0.0042, max: 2400, tam: 2.2, sep: 8, ali: 26, coh: 36, tope: 18, vel: 70, fuerzaPtr: 520, radioPtr: 130 }} />
      <div className="veil" aria-hidden="true" />
      <div className="close-in wrap">
        <h2 className="close-h" data-split>{closing.title}</h2>
        <p className="close-p" data-reveal data-lineas>{closing.body}</p>
        <div data-reveal>
          <Cta large>Escríbenos por WhatsApp</Cta>
          <p className="close-note mono">{closing.note}</p>
        </div>
      </div>
    </section>
  );
}
