import { whatsapp } from "@/lib/site";

/** Botón de WhatsApp. El href sale de la variable de entorno; sin número
 *  configurado abre WhatsApp con el mensaje pero sin destinatario. */
export function Cta({
  children,
  large = false,
  className = "",
}: {
  children: React.ReactNode;
  large?: boolean;
  className?: string;
}) {
  return (
    <a
      className={`cta ${large ? "cta--lg" : ""} ${className}`.trim()}
      href={whatsapp.href}
      target="_blank"
      rel="noopener"
    >
      <span>{children}</span>
      <span className="cta-sq" />
    </a>
  );
}
