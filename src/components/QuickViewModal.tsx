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
  const [activeImage, setActiveImage] = useState("");
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setSelectedVariant(0);
      setQuantity(1);
      setActiveImage(product?.image || "");
    }
  }, [isOpen, product]);

  if (!product) return null;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

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
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl z-[101] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
          <div className="flex flex-col md:flex-row h-full">
            {/* Left: Image Area */}
            <div className="md:w-1/2 bg-white p-6 flex flex-col items-center justify-center relative border-r border-slate-100">
              <div className="w-full h-[400px] flex items-center justify-center mb-4">
                <img
                  src={getImageUrl(activeImage)}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              {/* Image Thumbnails (Gallery) */}
              {allImages.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-14 h-14 border-2 rounded-md overflow-hidden transition-all ${activeImage === img ? "border-[#be1e2d] shadow-md" : "border-slate-100 hover:border-slate-300"}`}
                    >
                      <img src={getImageUrl(img)} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {product.badge && (
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                  <span className="bg-[#facc15] text-[#78350f] text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded shadow-sm">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Right: Info Area */}
            <div className="md:w-1/2 p-6 md:p-10 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <Dialog.Title className="font-display text-2xl font-bold text-slate-800 tracking-tight">
                  {product.name}
                </Dialog.Title>
                <Dialog.Close className="p-1 hover:bg-slate-100 rounded-full transition-colors -mt-2 -mr-2">
                  <X className="w-6 h-6 text-slate-400" />
                </Dialog.Close>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-[#be1e2d]">
                    ₹ {variant.price.toFixed(2)}
                  </span>
                  {variant.originalPrice > variant.price && (
                    <span className="text-xl text-slate-300 line-through">
                      ₹ {variant.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {discountAmount > 0 && (
                  <p className="text-[#be1e2d] text-xs font-bold mt-1">
                    Discount: ₹ {discountAmount.toFixed(2)} ({discountPercent}%)
                  </p>
                )}
              </div>

              {/* Weight Grid */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.weight}
                      onClick={() => setSelectedVariant(i)}
                      className={`min-w-[50px] px-2 h-9 flex items-center justify-center text-[10px] font-bold border rounded transition-all uppercase tracking-widest ${
                        i === selectedVariant
                          ? "bg-[#be1e2d] text-white border-[#be1e2d]"
                          : "bg-white text-slate-600 border-slate-300 hover:border-[#be1e2d]"
                      }`}
                    >
                      {v.weight}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty & Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center bg-slate-50 rounded-full px-2 py-1 h-12">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mr-4">Qty:</span>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-slate-600 hover:text-[#be1e2d] transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-bold text-slate-800 text-sm">{quantity.toString().padStart(2, '0')}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-slate-600 hover:text-[#be1e2d] transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-grow h-12 bg-[#be1e2d] text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-[#a01926] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100"
                >
                  Add To Cart
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-[#be1e2d] uppercase tracking-[0.2em] transition-all mb-8 pl-1"
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted(product.id) ? "fill-[#be1e2d] text-[#be1e2d]" : ""}`} />
                Add Wishlist
              </button>

              {/* Meta */}
              <div className="space-y-3 pt-6 border-t border-slate-100 mt-auto">
                <div className="flex items-center text-[11px] gap-8">
                  <span className="text-slate-400 font-bold w-20">Availability:</span>
                  <span className="text-green-500 font-bold">In Stock</span>
                </div>
                <div className="flex items-center text-[11px] gap-8">
                  <span className="text-slate-400 font-bold w-20">Type:</span>
                  <span className="text-slate-600 font-medium">spices</span>
                </div>
                <div className="flex items-center text-[11px] gap-8">
                  <span className="text-slate-400 font-bold w-20">Categories:</span>
                  <span className="text-slate-600 font-medium">{product.category}</span>
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
