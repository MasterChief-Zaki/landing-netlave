import { Founders } from "@/components/Founders";
import { Hero } from "@/components/Hero";
import { Idea } from "@/components/Idea";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <Idea />
      <Founders />
    </main>
  );
}
