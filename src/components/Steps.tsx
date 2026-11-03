import { steps } from "@/lib/content";
import { Banda } from "./Banda";

export function Steps() {
  return (
    <Banda
      id="swarm4"
      opts={{ grupos: 12, densidad: 0.0052, max: 2600, tam: 2.6, vel: 74, sep: 8, ali: 26, coh: 36, tope: 18, fuerzaPtr: 520, radioPtr: 130, camara: "agente", zoom: 5.0, corte: 5.5 }}
    >
    <section className="sec wrap" id="como">
      <div className="sec-head">
        <p className="sec-label mono" data-reveal>[ 03 ] Cómo trabajamos</p>
        <h2 className="sec-title" data-split>De un mensaje a un sistema operando.</h2>
      </div>

      <ol className="steps">
        {steps.map((s) => (
          <li className="step" data-reveal key={s.n}>
            <span className="step-n mono">{s.n}</span>
            <h3 className="step-t">{s.title}</h3>
            <p className="step-b" data-lineas>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
    </Banda>
  );
}
