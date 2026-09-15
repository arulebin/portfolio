import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Internship, Freelance, PersonalProjects } from "@/components/work";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Internship />
        <Freelance />
        <PersonalProjects />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
