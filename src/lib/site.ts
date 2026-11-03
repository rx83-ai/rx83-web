/** Configuración del sitio. El número de WhatsApp vive en una variable de
 *  entorno, no en el código: ver .env.example. */

const phone = (process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "").replace(/\D/g, "");

export const site = {
  name: "RX83 Agencia de IA",
  shortName: "RX83",
  city: "Cartagena, Colombia",
  legal: "© 2026 RX83 S.A.S.",
  description:
    "Agentes de IA que operan tu empresa. Y que son tuyos. Diseñamos, construimos y operamos sistemas de agentes de IA para empresas.",
} as const;

export const whatsapp = {
  phone,
  text: "Hola RX83, quiero saber qué parte de mi negocio puede funcionar con agentes de IA.",
  /** Sin número configurado abre WhatsApp con el mensaje pero sin destinatario. */
  get href() {
    return `https://wa.me/${this.phone}?text=${encodeURIComponent(this.text)}`;
  },
} as const;
