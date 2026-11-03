import { Nav } from "@/components/Nav";
import { Rail } from "@/components/Rail";
import { Cursor } from "@/components/Cursor";
import { Hero } from "@/components/Hero";
import { TechMarquee } from "@/components/TechMarquee";
import { Services } from "@/components/Services";
import { Why } from "@/components/Why";
import { Steps } from "@/components/Steps";
import { Closing } from "@/components/Closing";
import { Footer } from "@/components/Footer";
import { Motion } from "@/components/Motion";

export default function Page() {
  return (
    <>
      <a className="skip" href="#main">Saltar al contenido</a>
      <Rail />
      <Cursor />
      <Nav />

      <main id="main">
        <Hero />
        <TechMarquee />
        <Services />
        <Why />
        <Steps />
        <Closing />
      </main>

      <Footer />
      <Motion />
    </>
  );
}
