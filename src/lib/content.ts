/** Todo el copy en un solo sitio. Texto aprobado en el doc
 *  «RX83 Agencia de IA · Contenido del landing page», sin reescrituras. */

export const hero = {
  eyebrow: "Agencia de IA · Cartagena, Colombia",
  /** Un elemento por renglón; el último lleva el acento. */
  lines: ["Agentes de IA", "que operan tu empresa."],
  accentLine: "Y que son tuyos.",
  sub: "Diseñamos, construimos y operamos sistemas de agentes de IA para empresas: atención al cliente, ventas, marketing y gestión de datos trabajando como un solo sistema.",
  note: "Sin compromiso · respuesta el mismo día",
} as const;

export const tech = {
  note: "Construimos con la misma tecnología que usan los equipos de IA más avanzados del mundo.",
  stack: ["Claude", "OpenAI", "AI SDK", "LangGraph", "LangChain", "MCP", "n8n", "Kapso", "Supabase", "Vercel", "Cloudflare"],
} as const;

export type Service = {
  idx: string;
  title: string;
  body: string;
  tag?: string;
};

export const services: Service[] = [
  {
    idx: "01",
    title: "Estrategia e implementación de IA",
    body: "Revisamos cómo opera tu empresa y te entregamos un plan por etapas: qué automatizar primero, qué resultados esperar y qué no vale la pena hacer con IA.",
  },
  {
    idx: "02",
    title: "Agentes de atención al cliente",
    tag: "Destacado",
    body: "Atienden a tus clientes las 24 horas por WhatsApp y el chat de tu web. Recuerdan cada conversación, hablan con la voz de tu marca y pasan el caso a tu equipo cuando no tienen la respuesta.",
  },
  {
    idx: "03",
    title: "Agentes de ventas y agendamiento",
    body: "Responden cotizaciones, califican prospectos, agendan citas y hacen seguimiento, conectados a tu calendario, tu CRM y tus medios de pago.",
  },
  {
    idx: "04",
    title: "Agentes a la medida",
    body: "Agentes diseñados para un rol específico de tu operación e integrados a los sistemas que ya usas. Por ejemplo: un agente de marketing que investiga, escribe, genera imágenes y video y programa tus publicaciones para que tú apruebes; un agente de prospección que busca clientes potenciales y mantiene tu CRM al día; o agentes de soporte interno, compras, inventario y cobranza.",
  },
  {
    idx: "05",
    title: "Automatización de procesos",
    body: "Facturas y documentos que se leen solos, reportes que se generan y se envían a tiempo, información que pasa de un sistema a otro sin copiar y pegar.",
  },
  {
    idx: "06",
    title: "Tu conocimiento, conectado a la IA",
    body: "Organizamos la información de tu empresa en una base de conocimiento y la conectamos a ChatGPT o Claude, para que consultes tu negocio desde las herramientas que ya usas.",
  },
  {
    idx: "07",
    title: "Software con IA",
    body: "Sitios web, aplicaciones, dashboards y plataformas con IA integrada desde el diseño, del prototipo a producción.",
  },
  {
    idx: "08",
    title: "Sistemas operativos agénticos",
    body: "Todo lo anterior funcionando como un solo sistema: agentes, datos, métricas y reportes que operan varias áreas de tu empresa desde un mismo lugar.",
  },
];

export const reasons = [
  {
    title: "Tu código y tu data son tuyos.",
    body: "No te amarramos a nuestra plataforma. Si algún día decides operarlo tú mismo o con otro equipo, te llevas todo.",
  },
  {
    title: "Funcionando en cuatro semanas.",
    body: "La primera etapa de tu sistema queda operando en un mes. Verás avances desde la primera semana.",
  },
  {
    title: "La IA propone, tú decides.",
    body: "Los agentes trabajan solos, pero las decisiones importantes pasan por una persona de tu equipo.",
  },
  {
    title: "No entregamos y desaparecemos.",
    body: "Operamos, medimos y mejoramos tu sistema mes a mes, y lo hacemos crecer contigo.",
  },
  {
    /* PENDIENTE: el doc marca como «por confirmar» que se pueda prometer
       cumplimiento de la Ley 1581. Si no se sostiene, quitar o matizar. */
    title: "Datos personales bien tratados.",
    body: "Diseñamos cumpliendo la Ley 1581 de Habeas Data desde el primer día.",
  },
];

export const steps = [
  {
    n: "Paso 01",
    title: "Conversamos.",
    body: "Nos escribes por WhatsApp y entendemos qué necesitas.",
  },
  {
    n: "Paso 02",
    title: "Diagnosticamos y proponemos.",
    body: "Identificamos dónde la IA genera valor real en tu empresa y diseñamos una hoja de ruta por etapas.",
  },
  {
    n: "Paso 03",
    title: "Construimos la primera etapa.",
    body: "En cuatro semanas tienes un sistema funcionando.",
  },
  {
    n: "Paso 04",
    title: "Operamos y escalamos.",
    body: "Mantenemos, medimos y sumamos nuevas capacidades a medida que tu negocio lo pide.",
  },
];

export const closing = {
  title: "¿Qué parte de tu negocio debería estar funcionando sola?",
  body: "Cuéntanos por WhatsApp y te respondemos hoy.",
  note: "Sin compromiso · respuesta el mismo día",
} as const;
