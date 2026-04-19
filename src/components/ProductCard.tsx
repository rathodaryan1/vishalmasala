import { useState } from "react";
import type { Product } from "@/lib/products";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Eye, Heart } from "lucide-react";
import QuickViewModal from "./QuickViewModal";
import { getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedWeight, setSelectedWeight] = useState(
    product.variants[0]?.weight || "100g"
  );
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Find current variant based on selected weight, if not found use first available
  const variant = product.variants.find(v => v.weight.toLowerCase() === selectedWeight.toLowerCase()) || product.variants[0];
  
  const discount = variant.originalPrice > variant.price 
    ? Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    addToCart(product.id, variant.weight, 1);
    toast({ title: "Added to cart", description: `${product.name} (${variant.weight})` });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    addToCart(product.id, variant.weight, 1);
    if (!user) {
      toast({ title: "Login required", description: "Please login before buying." });
      navigate("/login?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  const standardWeights = ["100g", "200g", "500g", "1kg"];

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full relative animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Image Area */}
        <div className="relative p-4 bg-white aspect-square flex items-center justify-center overflow-hidden">
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-[#be1e2d] text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">
              -{discount}%
            </span>
          )}

          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
            <span className="bg-[#facc15] text-[#78350f] text-[8px] font-black uppercase tracking-tighter px-1 py-0.5 rounded shadow-sm">
              NEW PACK
            </span>
          </div>

          {/* New Sleek Action Buttons (Top Right Corner - per mockup) */}
          <div className="absolute top-8 right-2 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md bg-white text-slate-400 hover:text-[#be1e2d] transition-all`}
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? "fill-[#be1e2d] text-[#be1e2d]" : ""}`} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(true); }}
              className="w-8 h-8 bg-white text-slate-400 hover:text-[#be1e2d] rounded-full flex items-center justify-center shadow-md transition-all"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          
          <Link to={`/products/${product.id}`} className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className={`w-full h-full object-contain transition-all duration-500 ${product.images && product.images.length > 0 ? "group-hover:opacity-0 group-hover:scale-95" : "group-hover:scale-105"}`}
              loading="lazy"
            />
            {product.images && product.images.length > 0 && (
              <img
                src={getImageUrl(product.images[0])}
                alt={`${product.name} back`}
                className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                loading="lazy"
              />
            )}
          </Link>
        </div>

        {/* Product Card Body */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Weight Selectors (Mockup Style) */}
          <div className="flex gap-1.5 mb-3">
            {standardWeights.map((w) => {
              const isAvailable = product.variants.some(v => v.weight.toLowerCase() === w.toLowerCase());
              const isSelected = selectedWeight.toLowerCase() === w.toLowerCase();
              
              return (
                <button
                  key={w}
                  disabled={!isAvailable}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isAvailable) setSelectedWeight(w);
                  }}
                  className={`w-10 h-6 flex items-center justify-center text-[9px] font-bold border rounded transition-all ${
                    !isAvailable 
                      ? "opacity-30 cursor-not-allowed border-slate-200 text-slate-400" 
                      : isSelected
                      ? "bg-[#be1e2d] text-white border-[#be1e2d]"
                      : "bg-white text-slate-600 border-slate-300 hover:border-[#be1e2d]"
                  }`}
                >
                  {w.toUpperCase()}
                </button>
              );
            })}
          </div>

          <Link to={`/products/${product.id}`}>
            <h3 className="font-display text-sm font-bold text-slate-800 mb-1 group-hover:text-[#be1e2d] transition-colors truncate">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#be1e2d] text-lg font-black">
              ₹ {variant.price.toFixed(2)}
            </span>
            {variant.originalPrice > variant.price && (
              <span className="text-slate-400 text-xs line-through font-bold">
                ₹ {variant.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Action Buttons Stacked (Mockup Style) */}
          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={handleAddToCart}
              className="w-full h-10 bg-[#be1e2d] text-white font-black text-[10px] uppercase tracking-widest rounded transition-all hover:bg-[#a01926] shadow-md"
            >
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full h-10 bg-[#be1e2d] text-white font-black text-[10px] uppercase tracking-widest rounded transition-all hover:bg-[#a01926] shadow-md"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;
