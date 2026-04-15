import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="contact" className="bg-spice-brown text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img src={logo} alt="Vishal Masala" className="h-12 mb-4 brightness-0 invert" />
            <p className="font-body text-sm text-primary-foreground/60 leading-relaxed">
              Bringing authentic Indian flavours to kitchens worldwide. Pure, fresh & aromatic spices for every meal.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg font-bold mb-4 text-spice-gold">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="font-body text-sm text-primary-foreground/60 hover:text-spice-gold transition-colors">Home</Link></li>
              <li><Link to="/about" className="font-body text-sm text-primary-foreground/60 hover:text-spice-gold transition-colors">About Us</Link></li>
              <li><Link to="/products" className="font-body text-sm text-primary-foreground/60 hover:text-spice-gold transition-colors">Products</Link></li>
              <li><Link to="/wishlist" className="font-body text-sm text-primary-foreground/60 hover:text-spice-gold transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="font-body text-sm text-primary-foreground/60 hover:text-spice-gold transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-bold mb-4 text-spice-gold">Products</h4>
            <ul className="space-y-2">
              {["Blended Spices", "Pure Spices", "Asafoetida", "Exotic Range", "Pastes"].map((link) => (
                <li key={link}>
                  <Link to="/products" className="font-body text-sm text-primary-foreground/60 hover:text-spice-gold transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-bold mb-4 text-spice-gold">Connect With Us</h4>
            <p className="font-body text-sm text-primary-foreground/60 mb-4">
              Follow us on social media for offers, tips & more.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-spice-gold hover:text-spice-brown transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
          <p className="font-body text-xs text-primary-foreground/40">
            © 2026 Vishal Masala. All rights reserved. | Privacy Policy | Terms & Conditions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
