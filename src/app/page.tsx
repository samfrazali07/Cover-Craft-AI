import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Generator from "@/components/Generator";
import { Features, Footer, HowItWorks } from "@/components/Sections";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Generator />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
