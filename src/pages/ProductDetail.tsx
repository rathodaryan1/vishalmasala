import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/products";

const ProductDetail = () => {
  const { productId } = useParams();
  const { products, addToCart, toggleWishlist, isWishlisted, loadingProducts } = useShop();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    if (productId && products.length > 0) {
      const found = products.find((p) => p.id === productId);
      if (found) {
        setProduct(found);
      }
    }
  }, [productId, products]);

  const variant = product?.variants[selectedVariant];
  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.id !== product.id && item.category === product.category)
      .slice(0, 4);
  }, [product, products]);

  if (loadingProducts) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center font-display text-2xl text-muted-foreground">
          Loading product...
        </div>
        <Footer />
      </div>
    );
  }

  if (!product || !variant) return <Navigate to="/products" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <div className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link> /{" "}
          <Link to="/products" className="hover:text-primary">Products</Link> /{" "}
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-muted/30 rounded-xl border border-border p-6">
            <img src={product.image} alt={product.name} className="w-full h-[420px] object-contain" />
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-2">{product.longDescription}</p>
            <p className="text-xs mt-2 text-primary font-semibold">{product.category}</p>

            <div className="mt-5">
              <p className="text-sm font-semibold mb-2">Select Weight</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, index) => (
                  <button
                    key={v.weight}
                    onClick={() => setSelectedVariant(index)}
                    className={`px-3 py-1.5 rounded border text-sm ${
                      selectedVariant === index ? "bg-primary text-primary-foreground border-primary" : "border-border"
                    }`}
                  >
                    {v.weight}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">₹ {variant.price.toFixed(2)}</span>
              <span className="text-muted-foreground line-through">₹ {variant.originalPrice.toFixed(2)}</span>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded border border-border">-</button>
              <span className="w-10 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="w-9 h-9 rounded border border-border">+</button>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  addToCart(product.id, variant.weight, quantity);
                  toast({ title: "Added to cart", description: `${product.name} (${variant.weight}) x ${quantity}` });
                }}
                className="py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex justify-center items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add To Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="py-3 rounded-lg border border-primary text-primary font-semibold flex justify-center items-center gap-2"
              >
                <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? "fill-primary" : ""}`} />
                {isWishlisted(product.id) ? "Wishlisted" : "Add Wishlist"}
              </button>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-muted-foreground list-disc list-inside">
              {product.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="font-display text-2xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
