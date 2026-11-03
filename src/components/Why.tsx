import { reasons } from "@/lib/content";
import { Banda } from "./Banda";

export function Why() {
  return (
    <Banda
      id="swarm3"
      alterna
      opts={{ grupos: 14, densidad: 0.0048, max: 2600, tam: 2.4, vel: 74, sep: 8, ali: 26, coh: 36, tope: 18, fuerzaPtr: 520, radioPtr: 130, camara: "cluster", zoom: 3.2, corte: 7.5 }}
    >
    <section className="sec wrap" id="porque">
      <div className="sec-head">
        <p className="sec-label mono" data-reveal>[ 02 ] Por qué RX83</p>
        <h2 className="sec-title" data-split>Lo que construimos se queda contigo.</h2>
      </div>

      <ul className="why">
        {reasons.map((r) => (
          <li className="why-item" data-reveal key={r.title}>
            <h3 className="why-t"><i />{r.title}</h3>
            <p className="why-b" data-lineas>{r.body}</p>
          </li>
        ))}
      </ul>
    </section>
    </Banda>
  );
}
