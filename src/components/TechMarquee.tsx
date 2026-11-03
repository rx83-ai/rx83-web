import { tech } from "@/lib/content";
import { marcas } from "@/lib/brandMarks";

/** La marquesina es decorativa y se duplica para el bucle, así que va oculta
 *  a lectores de pantalla; debajo queda la misma lista como texto. */
function Track() {
  return (
    <div className="marquee-item">
      {marcas.map((m) => (
        <span key={m.nombre} style={{ display: "contents" }}>
          {m.paths ? (
            <svg
              className="lg"
              viewBox={m.viewBox}
              fill="currentColor"
              role="img"
              aria-label={m.nombre}
              style={m.escala ? ({ "--s": m.escala } as React.CSSProperties) : undefined}
            >
              {m.paths.map((p, i) => (
                <path key={i} d={p.d} fillOpacity={p.opacidad} />
              ))}
            </svg>
          ) : (
            <span className="lg-word">{m.nombre}</span>
          )}
          <i />
        </span>
      ))}
    </div>
  );
}

export function TechMarquee() {
  return (
    <section className="tech">
      <div className="wrap">
        <p className="tech-note" data-reveal data-lineas>{tech.note}</p>
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <Track />
          <Track />
        </div>
      </div>
      <p className="wrap mono" style={{ marginTop: "1.75rem" }}>
        {tech.stack.join(" · ")}
      </p>
    </section>
  );
}
