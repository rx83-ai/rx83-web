import { hero } from "@/lib/content";
import { Cta } from "./Cta";
import { Swarm } from "./Swarm";

export function Hero() {
  return (
    <section className="hero">
      <Swarm id="swarm" opts={{ grupos: 28, densidad: 0.0060, max: 4200, tam: 2.1, sep: 8, ali: 26, coh: 36, tope: 18, vel: 74, fuerzaPtr: 520, radioPtr: 130 }} />
      <div className="veil" aria-hidden="true" />
      <div className="hero-inner wrap">
        <div className="hero-copy">
        <p className="hero-eyebrow mono"><i />{hero.eyebrow}</p>

        <h1 className="hero-h1">
          {hero.lines.map((line) => (
            <span className="line" key={line}><span>{line}</span></span>
          ))}
          <span className="line h1-accent"><span>{hero.accentLine}</span></span>
        </h1>

        <div className="hero-foot">
          <p className="hero-sub" data-reveal data-lineas>{hero.sub}</p>
          <div className="hero-cta" data-reveal>
            <Cta large>Escríbenos por WhatsApp</Cta>
            <span className="mono">{hero.note}</span>
          </div>
        </div>

          <p className="scroll-hint mono" data-reveal><i />Desliza</p>
        </div>

      </div>
    </section>
  );
}
