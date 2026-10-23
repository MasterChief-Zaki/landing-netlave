import { Contact } from "@/components/Contact";
import { Founders } from "@/components/Founders";
import { Hero } from "@/components/Hero";
import { Idea } from "@/components/Idea";
import { ProjectFacts } from "@/components/ProjectFacts";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <Idea />
      <ProjectFacts />
      <Founders />
      <Contact />
    </main>
  );
}
