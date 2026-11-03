import { site, whatsapp } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="foot wrap">
      <div className="foot-top">
        <div className="foot-logo"><Logo /></div>
        <nav className="foot-nav mono" aria-label="Pie de página">
          <a className="nav-link" href="#servicios">Servicios</a>
          <a className="nav-link" href="#como">Cómo trabajamos</a>
          <a className="nav-link" href={whatsapp.href} target="_blank" rel="noopener">WhatsApp</a>
        </nav>
      </div>
      <div className="foot-bot mono">
        <span>{site.name} · {site.city}</span>
        <span>{site.legal}</span>
      </div>
    </footer>
  );
}
