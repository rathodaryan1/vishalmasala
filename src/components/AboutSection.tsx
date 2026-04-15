import blendedSpices from "@/assets/blended-spices.jpg";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-spice-pattern">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={blendedSpices}
                alt="Our spice heritage"
                className="w-full h-[400px] object-cover"
                loading="lazy"
                width={640}
                height={640}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-spice-gold rounded-full flex items-center justify-center shadow-lg">
              <span className="font-display text-spice-brown text-sm font-bold text-center leading-tight">
                Since<br />1950
              </span>
            </div>
          </div>

          <div>
            <p className="font-body text-primary text-sm font-semibold tracking-widest uppercase mb-2">
              About Us
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              The Purest Indian Spices
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              At Vishal Masala, spice isn't just an ingredient — it's an emotion. It evokes the joy of festive feasts, the warmth of family recipes, and the magic of perfectly seasoned plates shared with loved ones.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              As India's trusted spice brand, we've been bringing authentic flavours to kitchens for generations. Made with the finest and purest ingredients, our spices and condiments lend traditional taste to your meals. We use Ambient Grinding Technology which keeps the taste and flavour intact.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
