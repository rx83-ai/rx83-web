import { Logo } from "./Logo";
import { Cta } from "./Cta";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <header className="nav" data-stuck="false">
      <a className="nav-logo" href="#main" aria-label="RX83 Agencia de IA, inicio">
        <Logo />
      </a>
      <nav className="nav-links" aria-label="Principal">
        <a className="nav-link" href="#servicios">Servicios</a>
        <a className="nav-link" href="#como">Cómo trabajamos</a>
        <ThemeToggle />
        <Cta>
          <span className="cta-long">Escríbenos por </span>WhatsApp
        </Cta>
      </nav>
    </header>
  );
}
