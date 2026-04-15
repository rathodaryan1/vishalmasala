import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden">
      <img
        src={heroBanner}
        alt="Premium Indian Spices Collection"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={800}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-spice-brown/80 via-spice-brown/40 to-transparent" />
      <div className="relative container h-full flex flex-col justify-center">
        <div className="max-w-xl">
          <p className="font-body text-spice-gold text-sm md:text-base font-semibold tracking-widest uppercase mb-3">
            India's Most Trusted
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-4">
            Vishal <span className="text-spice-gold">Masala</span>
          </h1>
          <p className="font-body text-primary-foreground/80 text-base md:text-lg max-w-md mb-8">
            Bringing authentic flavours to kitchens for generations. Pure, fresh & aromatic spices for every meal.
          </p>
          <div className="flex gap-4">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors"
            >
              Explore Products
            </Link>
            <a
              href="#about"
              className="inline-flex items-center px-6 py-3 border-2 border-primary-foreground/40 text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary-foreground/10 transition-colors"
            >
              Know More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
