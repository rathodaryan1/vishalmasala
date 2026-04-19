import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, Minus, Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import type { Product } from "@/lib/products";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/lib/utils";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setSelectedVariant(0);
      setQuantity(1);
    }
  }, [isOpen]);

  if (!product) return null;

  const variant = product.variants[selectedVariant];
  const discountAmount = variant.originalPrice - variant.price;
  const discountPercent = Math.round((discountAmount / variant.originalPrice) * 100);

  const handleAddToCart = () => {
    addToCart(product.id, variant.weight, quantity);
    toast({
      title: "Added to Cart",
      description: `${product.name} (${variant.weight}) x ${quantity}`,
    });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
          <div className="flex flex-col md:flex-row h-full">
            {/* Left: Image Area */}
            <div className="md:w-1/2 bg-[#f8fafc] p-8 flex items-center justify-center relative">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
              {product.badge && (
                <span className="absolute top-6 left-6 bg-[#facc15] text-[#78350f] text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Right: Info Area */}
            <div className="md:w-1/2 p-8 md:p-10 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <Dialog.Title className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                  {product.name}
                </Dialog.Title>
                <Dialog.Close className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </Dialog.Close>
              </div>

              {product.description && (
                <p className="font-body text-slate-600 mb-6 leading-relaxed italic">
                  {product.description}
                </p>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-4 mb-1">
                  <span className="text-3xl font-black text-[#be1e2d]">
                    ₹ {variant.price.toFixed(2)}
                  </span>
                  {variant.originalPrice > variant.price && (
                    <span className="text-xl text-slate-400 line-through">
                      ₹ {variant.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {discountAmount > 0 && (
                  <p className="text-[#be1e2d] text-sm font-bold uppercase tracking-wider">
                    Discount: ₹ {discountAmount.toFixed(2)} ({discountPercent}%)
                  </p>
                )}
              </div>

              {/* Weight Grid */}
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">Select Weight</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.weight}
                      onClick={() => setSelectedVariant(i)}
                      className={`min-w-[60px] h-10 flex items-center justify-center text-xs font-bold border-2 transition-all rounded-xl ${
                        i === selectedVariant
                          ? "bg-[#be1e2d] text-white border-[#be1e2d] shadow-lg shadow-red-100"
                          : "bg-white text-slate-600 border-slate-100 hover:border-[#be1e2d]"
                      }`}
                    >
                      {v.weight.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty & Add to Cart */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border-2 border-slate-100 rounded-xl px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-400 hover:text-[#be1e2d] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-slate-800">{quantity.toString().padStart(2, '0')}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-400 hover:text-[#be1e2d] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-grow h-14 bg-[#be1e2d] text-white font-bold text-sm uppercase tracking-[0.15em] rounded-xl hover:bg-[#a01926] transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-100 hover:shadow-2xl hover:-translate-y-0.5"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add To Cart
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#be1e2d] uppercase tracking-widest transition-colors mb-8"
              >
                <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? "fill-[#be1e2d] text-[#be1e2d]" : ""}`} />
                {isWishlisted(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>

              {/* Meta */}
              <div className="space-y-4 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-widest">Availability:</span>
                  <span className="text-green-600 font-black uppercase tracking-widest">In Stock</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-widest">Type:</span>
                  <span className="text-slate-800 font-black uppercase tracking-widest">Spices</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-widest">Category:</span>
                  <span className="text-slate-800 font-black uppercase tracking-widest">{product.category}</span>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default QuickViewModal;
