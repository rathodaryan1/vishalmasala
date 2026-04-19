import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/products";
import { getImageUrl } from "@/lib/utils";

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
          <div className="md:w-1/2 bg-[#f8fafc] rounded-3xl p-8 flex items-center justify-center relative overflow-hidden group">
            <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-[420px] object-contain" />
            
            {product.badge && (
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                {product.badge}
              </span>
            )}
          </div>

          <div className="space-y-6">
            <div className="pb-6 border-b border-slate-100">
                <span className="text-[#be1e2d] font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">{product.category}</span>
                <h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">{product.name}</h1>
                {product.description && (
                    <p className="font-body text-slate-500 text-lg leading-relaxed italic border-l-4 border-spice-gold pl-6">
                        {product.description}
                    </p>
                )}
            </div>

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

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  addToCart(product.id, variant.weight, quantity);
                  toast({ title: "Added to cart", description: `${product.name} (${variant.weight}) x ${quantity}` });
                }}
                className="h-14 rounded-2xl bg-slate-900 text-white font-bold flex justify-center items-center gap-3 hover:bg-slate-800 transition-all active:scale-95"
              >
                <ShoppingCart className="w-5 h-5" />
                Add To Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product.id, variant.weight, quantity);
                  navigate("/checkout");
                }}
                className="h-14 rounded-2xl bg-[#be1e2d] text-white font-bold flex justify-center items-center gap-3 hover:bg-[#a01926] transition-all shadow-xl shadow-red-200 active:scale-95"
              >
                Buy It Now
              </button>
            </div>
            
            <div className="mt-4">
              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-full h-14 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold flex justify-center items-center gap-3 hover:border-[#be1e2d] hover:text-[#be1e2d] transition-all active:scale-95"
              >
                <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? "fill-[#be1e2d] text-[#be1e2d]" : ""}`} />
                {isWishlisted(product.id) ? "In Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            <div className="pt-8 border-t border-slate-100">
               <details className="group" open>
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Product Description</span>
                    <span className="text-slate-300 group-open:rotate-180 transition-transform duration-300">▼</span>
                  </summary>
                  <div className="mt-6 text-slate-600 leading-relaxed font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    {product.longDescription}
                  </div>
               </details>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Product Highlights</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-spice-gold mt-1.5 shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
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
