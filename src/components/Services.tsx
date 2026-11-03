import { services } from "@/lib/content";

export function Services() {
  return (
    <section className="sec wrap" id="servicios">
      <div className="sec-head">
        <p className="sec-label mono" data-reveal>[ 01 ] Servicios</p>
        <h2 className="sec-title" data-split>
          Ocho formas de poner la IA a trabajar en tu operación.
        </h2>
      </div>

      <ol className="svc-list">
        {services.map((s) => (
          <li className="svc" data-reveal key={s.idx}>
            <div className="svc-in">
              <span className="svc-idx mono">{s.idx}</span>
              <h3 className="svc-title">
                {s.title}
                {s.tag ? <span className="tag">{s.tag}</span> : null}
              </h3>
              <p className="svc-body" data-lineas>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
