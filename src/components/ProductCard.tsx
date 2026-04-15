import { useState } from "react";
import type { Product } from "@/data/products";
import { ChevronDown, Heart, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const { user } = useAuth();
  const { toast } = useToast();
  const variant = product.variants[selectedVariant];
  const discount = Math.round(
    ((variant.originalPrice - variant.price) / variant.originalPrice) * 100
  );

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative p-4 bg-muted/30">
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[11px] font-bold font-body px-2 py-0.5 rounded-md z-10">
            -{discount}%
          </span>
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-spice-gold text-spice-brown text-[10px] font-bold font-body px-2 py-0.5 rounded-md z-10">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          width={640}
          height={640}
        />
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-background/90 border border-border flex items-center justify-center hover:border-primary transition-colors"
          aria-label="Toggle wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted(product.id) ? "fill-primary text-primary" : "text-foreground"
            }`}
          />
        </button>
      </div>

      {/* Weight variants */}
      <div className="px-4 pt-3 flex flex-wrap gap-1.5">
        {product.variants.map((v, i) => (
          <button
            key={v.weight}
            onClick={() => setSelectedVariant(i)}
            className={`text-[11px] font-body font-semibold px-2.5 py-1 rounded border transition-colors ${
              i === selectedVariant
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary"
            }`}
          >
            {v.weight}
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-2">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-display text-base font-semibold text-foreground leading-tight line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="font-body text-lg font-bold text-primary">
            ₹ {variant.price.toFixed(2)}
          </span>
          <span className="font-body text-sm text-muted-foreground line-through">
            ₹ {variant.originalPrice.toFixed(2)}
          </span>
        </div>
        <div className="mt-2 space-y-1">
          {product.highlights.slice(0, 2).map((point) => (
            <p key={point} className="text-[11px] text-muted-foreground flex items-center gap-1">
              <ChevronDown className="w-3 h-3 text-primary" />
              {point}
            </p>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        <button
          onClick={() => {
            addToCart(product.id, variant.weight, 1);
            toast({ title: "Added to cart", description: `${product.name} (${variant.weight})` });
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground font-body text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          ADD TO CART
        </button>
        <button
          onClick={() => {
            addToCart(product.id, variant.weight, 1);
            if (!user) {
              toast({ title: "Login required", description: "Please login before buying." });
              navigate("/login?redirect=/checkout");
              return;
            }
            navigate("/checkout");
          }}
          className="w-full py-2.5 border-2 border-primary text-primary font-body text-sm font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          BUY NOW
        </button>
        <Link
          to={`/products/${product.id}`}
          className="w-full py-2.5 border border-border text-foreground font-body text-sm font-semibold rounded-lg hover:border-primary transition-colors text-center"
        >
          PRODUCT DETAILS
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
