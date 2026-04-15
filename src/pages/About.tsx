import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-muted border-b border-border">
        <div className="container py-12 text-center">
          <h1 className="font-display text-4xl font-bold">About Vishal Masala</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            We craft authentic Indian spices with consistency, purity, and flavor at the center of everything we do.
          </p>
        </div>
      </div>
      <AboutSection />
      <section className="container py-12 grid md:grid-cols-3 gap-4">
        <div className="border border-border rounded-xl p-5">
          <h3 className="font-display text-xl font-bold">Our Mission</h3>
          <p className="text-sm text-muted-foreground mt-2">Deliver trustworthy, flavorful spices to every Indian kitchen.</p>
        </div>
        <div className="border border-border rounded-xl p-5">
          <h3 className="font-display text-xl font-bold">Our Promise</h3>
          <p className="text-sm text-muted-foreground mt-2">Fresh batches, strict quality checks, and transparent sourcing.</p>
        </div>
        <div className="border border-border rounded-xl p-5">
          <h3 className="font-display text-xl font-bold">Our Values</h3>
          <p className="text-sm text-muted-foreground mt-2">Tradition with innovation, customer trust, and long-term consistency.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
