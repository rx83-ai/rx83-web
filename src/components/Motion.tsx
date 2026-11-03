"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isStill, setScrollProgress } from "@/lib/motionState";

/* La coreografía se orquesta desde un solo sitio y opera sobre el DOM ya
   montado. Es deliberado: el movimiento cruza secciones (progreso del riel,
   marquesina con inercia, entrada encadenada) y repartirlo por componente
   obligaría a sincronizarlos entre sí. */
export function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = document.documentElement;
    const still = isStill();
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let rescued = false;
    const tickers: Array<(t: number, d: number) => void> = [];

    /* Red de seguridad: nada puede dejar el contenido invisible. Si el reloj
       de animación no avanza —pestaña en segundo plano, equipo saturado,
       error de script— se descarta la coreografía y se muestra el final. */
    function rescue() {
      if (rescued) return;
      rescued = true;
      try {
        ScrollTrigger.getAll().forEach((st) => st.kill(false));
        gsap.globalTimeline.clear();
        gsap.set(
          ".hero-h1 .line > span, [data-reveal], .ch, .ln > span, .nav, .hero-eyebrow, .scroll-hint, .cta, .svc-idx, .svc-title, .step-n, .sec-label",
          { clearProps: "all" },
        );
      } catch {
        /* da igual por qué falló: lo importante es que el contenido se vea */
      }
      document.querySelectorAll<HTMLElement>(".swarm").forEach((el) => {
        el.style.opacity = "1";
      });
    }
    addEventListener("error", rescue);

    let watchTimer = 0;
    function watchdog() {
      if (rescued) return;
      const f0 = gsap.ticker.frame;
      watchTimer = window.setTimeout(() => {
        if (gsap.ticker.frame - f0 < 5) rescue();
      }, 1200);
    }
    const bootTimer = window.setTimeout(watchdog, 2000);
    const onVis = () => { if (!document.hidden) window.setTimeout(watchdog, 400); };
    document.addEventListener("visibilitychange", onVis);

    const ctx = gsap.context(() => {
      /* progreso global: el cuadrado que baja por el riel, y la rotación
         del grafo, que lee el mismo valor */
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          setScrollProgress(self.progress);
          root.style.setProperty("--prog", self.progress.toFixed(4));
        },
      });

      ScrollTrigger.create({
        start: 40,
        onToggle: (self) =>
          document.querySelector(".nav")?.setAttribute("data-stuck", self.isActive ? "true" : "false"),
      });

      if (still) {
        gsap.set(".swarm", { opacity: 1 });
        return;
      }

      /* --- entrada: una sola coreografía --- */
      const words = document.querySelectorAll<HTMLElement>(".hero-h1 .line > span");
      gsap.set(words, { yPercent: 115 });
      gsap.set(".hero-eyebrow, .hero-foot [data-reveal], .scroll-hint", { opacity: 0, y: 18 });
      gsap.set(".nav", { opacity: 0, y: -14 });

      gsap
        .timeline({ delay: 0.15, defaults: { ease: "expo.out" } })
        .fromTo(".hero-h1", { "--h1w": 400 }, { "--h1w": 800, duration: 1.9, ease: "power3.out" }, 0)
        .to(words, { yPercent: 0, duration: 1.25, stagger: 0.075 }, 0.05)
        .to("#swarm", { opacity: 1, duration: 2.8, ease: "power2.out" }, 0.1)
        .to(".nav", { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.5)
        .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.9 }, 0.35)
        .to(".hero-foot [data-reveal]", { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.65)
        .to(".scroll-hint", { opacity: 1, y: 0, duration: 0.8 }, 1);

      /* ---------- partidores de texto ----------
         Guardan el original en el dataset: volver a partir tras un cambio de
         ancho es idempotente y nunca duplica contenido. */
      const partirCaracteres = (el: HTMLElement) => {
        const orig = el.dataset.splitText ?? el.textContent ?? "";
        el.dataset.splitText = orig;
        el.textContent = "";
        const palabras = orig.split(" ");
        palabras.forEach((pal, i) => {
          const w = document.createElement("span");
          w.className = "pal";
          for (const ch of pal) {
            const c = document.createElement("span");
            c.className = "ch";
            c.textContent = ch;
            w.appendChild(c);
          }
          el.appendChild(w);
          if (i < palabras.length - 1) el.appendChild(document.createTextNode(" "));
        });
        return el.querySelectorAll(".ch");
      };

      const partirLineas = (el: HTMLElement) => {
        const orig = el.dataset.lineasTexto ?? el.textContent ?? "";
        el.dataset.lineasTexto = orig;
        el.textContent = "";
        /* primero palabra por palabra, solo para medir dónde cae cada salto */
        const sondas = orig.split(/\s+/).filter(Boolean).map((pal) => {
          const sp = document.createElement("span");
          sp.textContent = pal;
          sp.style.display = "inline-block";
          el.appendChild(sp);
          el.appendChild(document.createTextNode(" "));
          return sp;
        });
        const lineas: string[][] = [];
        let actual: string[] | null = null;
        let tope: number | null = null;
        for (const sp of sondas) {
          const t = sp.offsetTop;
          if (tope === null || Math.abs(t - tope) > 2) { tope = t; actual = []; lineas.push(actual); }
          actual!.push(sp.textContent ?? "");
        }
        el.textContent = "";
        for (const ls of lineas) {
          const caja = document.createElement("span");
          caja.className = "ln";
          const dentro = document.createElement("span");
          dentro.textContent = ls.join(" ");
          caja.appendChild(dentro);
          el.appendChild(caja);
        }
        return el.querySelectorAll(".ln > span");
      };

      /* --- títulos de sección: letra por letra, cayendo hacia el lector --- */
      document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
        gsap.from(partirCaracteres(el), {
          yPercent: 70, opacity: 0, rotateX: -62, transformOrigin: "50% 100%",
          duration: 0.9, ease: "expo.out", stagger: 0.016,
          scrollTrigger: { trigger: el, start: "top 86%" },
        });
      });

      /* --- párrafos: línea por línea --- */
      document.querySelectorAll<HTMLElement>("[data-lineas]").forEach((el) => {
        const lineas = partirLineas(el);
        if (!lineas.length) return;
        gsap.from(lineas, {
          yPercent: 108, duration: 1.0, ease: "expo.out", stagger: 0.065,
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      /* Otro ancho cambia dónde caen los saltos: se vuelve a partir y se deja
         visible, sin reanimar — reanimar a media página marea. */
      let reparto = 0;
      addEventListener("resize", () => {
        clearTimeout(reparto);
        reparto = window.setTimeout(() => {
          document.querySelectorAll<HTMLElement>("[data-lineas]").forEach((el) => {
            gsap.set(partirLineas(el), { clearProps: "all" });
          });
          ScrollTrigger.refresh();
        }, 220);
      });

      /* --- revelados genéricos --- */
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.closest(".hero")) return;
        gsap.from(el, {
          opacity: 0,
          y: 26,
          filter: "blur(8px)",
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      /* --- las bandas con cámara aparecen al entrar --- */
      ["#swarm3", "#swarm4"].forEach((sel) => {
        const el = document.querySelector(sel);
        if (!el?.parentElement) return;
        gsap.to(sel, {
          opacity: 1,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el.parentElement, start: "top 85%" },
        });
      });

      /* --- cierre: el enjambre vuelve --- */
      gsap.to("#swarm2", {
        opacity: 1,
        duration: 2.0,
        ease: "power2.out",
        scrollTrigger: { trigger: ".close", start: "top 82%" },
      });

      /* --- marquesina con inercia de scroll --- */
      const track = document.querySelector<HTMLElement>(".marquee-track");
      const item = document.querySelector<HTMLElement>(".marquee-item");
      if (track && item) {
        let x = 0, half = 0, vel = 0, skew = 0;
        const measure = () => {
          const hueco = parseFloat(getComputedStyle(track).gap) || 56;  // el hueco es clamp(), no fijo
          half = item.getBoundingClientRect().width + hueco;
        };
        measure();
        addEventListener("resize", measure);
        ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => { vel = self.getVelocity(); } });
        const tick = () => {
          const boost = gsap.utils.clamp(-60, 60, vel / 120);
          x -= 0.9 + Math.abs(boost) * 0.35;
          if (half && x <= -half) x += half;
          skew += (gsap.utils.clamp(-9, 9, vel / 420) - skew) * 0.08;
          track.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
          vel *= 0.92;
        };
        gsap.ticker.add(tick);
        tickers.push(tick);
      }

      /* --- índices de servicio: scramble al entrar --- */
      document.querySelectorAll<HTMLElement>(".svc-idx").forEach((el) => {
        const final = el.textContent ?? "";
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () => {
            let n = 0;
            const iv = setInterval(() => {
              el.textContent = String(Math.floor(Math.random() * 90) + 10);
              if (++n > 7) { clearInterval(iv); el.textContent = final; }
            }, 45);
          },
        });
      });

      /* --- cada fila de servicio entra por partes y su raya se dibuja --- */
      document.querySelectorAll<HTMLElement>(".svc").forEach((fila) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: fila, start: "top 90%" } });
        tl.fromTo(fila, { "--draw": 0 }, { "--draw": 1, duration: 0.8, ease: "power2.inOut" }, 0)
          .to(fila, { "--draw": 0, duration: 0.6, ease: "power2.in" }, 0.85)
          .from(fila.querySelector(".svc-idx"), { opacity: 0, x: -14, duration: 0.7, ease: "expo.out" }, 0.1)
          .from(fila.querySelector(".svc-title"), { opacity: 0, y: 22, duration: 0.85, ease: "expo.out" }, 0.16);
      });

      /* --- diferenciadores: el cuadrado se estira antes que el texto --- */
      document.querySelectorAll<HTMLElement>(".why-item").forEach((it) => {
        gsap.from(it.querySelector(".why-t i"), {
          scaleX: 0, transformOrigin: "left center", duration: 0.7, ease: "expo.out",
          scrollTrigger: { trigger: it, start: "top 90%" },
        });
      });

      /* --- pasos: el número sube antes que el título --- */
      document.querySelectorAll<HTMLElement>(".step").forEach((st, i) => {
        gsap.from(st.querySelector(".step-n"), {
          opacity: 0, y: 14, duration: 0.65, ease: "expo.out", delay: i * 0.06,
          scrollTrigger: { trigger: st, start: "top 92%" },
        });
      });

      /* --- las etiquetas de sección derivan con el scroll --- */
      document.querySelectorAll<HTMLElement>(".sec-label").forEach((lb) => {
        const sec = lb.closest(".sec");
        if (!sec) return;
        gsap.fromTo(lb, { y: 26 }, {
          y: -26, ease: "none",
          scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      });

      /* --- la luz de la fila sigue al cursor --- */
      if (fine) {
        document.querySelectorAll<HTMLElement>(".svc").forEach((fila) => {
          fila.addEventListener("pointermove", (e) => {
            const b = fila.getBoundingClientRect();
            const x = ((e as PointerEvent).clientX - b.left) / b.width * 100;
            fila.style.setProperty("--mx", `${x.toFixed(1)}%`);
          }, { passive: true });
        });
      }

      /* --- el hilo de los pasos se dibuja con el scroll --- */
      const pasos = document.querySelector(".steps");
      if (pasos) {
        gsap.fromTo(pasos, { "--hilo": 0 }, {
          "--hilo": 1,
          ease: "none",
          scrollTrigger: { trigger: pasos, start: "top 88%", end: "bottom 65%", scrub: 0.6 },
        });
      }

      /* --- botones magnéticos --- */
      if (fine) {
        document.querySelectorAll<HTMLElement>(".cta").forEach((btn) => {
          const qx = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
          const qy = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
          btn.addEventListener("pointermove", (e) => {
            const b = btn.getBoundingClientRect();
            qx((e.clientX - b.left - b.width / 2) * 0.28);
            qy((e.clientY - b.top - b.height / 2) * 0.4);
          });
          btn.addEventListener("pointerleave", () => { qx(0); qy(0); });
        });
      }
    });

    return () => {
      clearTimeout(bootTimer);
      clearTimeout(watchTimer);
      removeEventListener("error", rescue);
      document.removeEventListener("visibilitychange", onVis);
      tickers.forEach((t) => gsap.ticker.remove(t));
      ctx.revert();
    };
  }, []);

  return null;
}
