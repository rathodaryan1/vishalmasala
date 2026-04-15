import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import AboutSection from "@/components/AboutSection";
import ProductCategories from "@/components/ProductCategories";
import StatsSection from "@/components/StatsSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner />
      <AboutSection />
      <ProductCategories />
      <StatsSection />
      <MarqueeBanner />
      <section className="container py-12 grid md:grid-cols-2 gap-4">
        <Link to="/offers" className="border border-border rounded-xl p-6 hover:border-primary transition-colors">
          <h3 className="font-display text-2xl font-bold">Offers</h3>
          <p className="text-sm text-muted-foreground mt-2">Discover ongoing discounts and festive deals.</p>
        </Link>
        <Link to="/blog" className="border border-border rounded-xl p-6 hover:border-primary transition-colors">
          <h3 className="font-display text-2xl font-bold">Blog</h3>
          <p className="text-sm text-muted-foreground mt-2">Read spice tips, cooking guides, and kitchen stories.</p>
        </Link>
      </section>
      <Footer />
    </div>
  );
};

export default Index;
