import { useEffect, useMemo, useState, useRef } from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Plus, Minus, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/products";
import { getImageUrl } from "@/lib/utils";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isWishlisted, loadingProducts } = useShop();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState<"description" | "additional">("description");
  const { toast } = useToast();
  
  // Zoom state
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (productId && products.length > 0) {
      const found = products.find((p) => p.id === productId);
      if (found) {
        setProduct(found);
        setActiveImage(found.image);
      }
    }
  }, [productId, products]);

  const variant = product?.variants[selectedVariant];
  const allImages = useMemo(() => {
    if (!product) return [];
    return [product.image, ...(product.images || [])].filter(Boolean);
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.id !== product.id && item.category === product.category)
      .slice(0, 6);
  }, [product, products]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const px = e.clientX - left;
    const py = e.clientY - top;
    const x = (px / width) * 100;
    const y = (py / height) * 100;
    setZoomPos({ x, y, px, py });
  };

  if (loadingProducts) return <div className="min-h-screen bg-white" />;
  if (!product || !variant) return <Navigate to="/products" replace />;

  const discountPercent = Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container pt-32 pb-20">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">
          <Link to="/" className="hover:text-[#be1e2d] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/products?category=${product.category}`} className="hover:text-[#be1e2d] transition-colors">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-[100px_1fr_450px] gap-8 items-start mb-20">
          {/* Vertical Thumbnails */}
          <div className="hidden lg:flex flex-col gap-4 sticky top-32">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-full aspect-square rounded-xl border-2 overflow-hidden transition-all p-1 ${activeImage === img ? "border-[#be1e2d] shadow-lg shadow-red-50" : "border-slate-100 hover:border-slate-300"}`}
              >
                <img src={getImageUrl(img)} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Main Image with Lens Zoom */}
          <div 
            className="relative bg-white rounded-3xl p-8 border border-slate-100 flex items-center justify-center cursor-none overflow-hidden group h-[600px]"
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
          >
            <img 
              ref={imgRef}
              src={getImageUrl(activeImage)} 
              alt={product.name} 
              className="max-w-full max-h-full object-contain animate-in fade-in zoom-in-95 duration-500" 
            />
            
            {/* Magnifying Glass Lens */}
            {showZoom && (
              <div 
                className="absolute pointer-events-none z-20 border-4 border-white shadow-[0_0_20px_rgba(0,0,0,0.2)] rounded-full w-48 h-48 overflow-hidden bg-white"
                style={{
                  left: `${zoomPos.px - 96}px`,
                  top: `${zoomPos.py - 96}px`,
                  backgroundImage: `url(${getImageUrl(activeImage)})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: '400%',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            )}

            {/* Mobile Thumbnails (Horizontal) */}
            <div className="lg:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
               {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-12 h-12 bg-white rounded-lg border-2 overflow-hidden p-1 ${activeImage === img ? "border-[#be1e2d]" : "border-slate-100"}`}
                  >
                    <img src={getImageUrl(img)} className="w-full h-full object-contain" />
                  </button>
                ))}
            </div>

            <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
               <span className="bg-[#facc15] text-[#78350f] text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded shadow-sm">NEW PACK</span>
               {discountPercent > 0 && <span className="bg-[#be1e2d] text-white text-[10px] font-black px-2 py-1 rounded shadow-sm">-{discountPercent}% OFF</span>}
            </div>
          </div>

          {/* Product Details Panel */}
          <div className="flex flex-col">
            <div className="pb-8 border-b border-slate-100">
              <h1 className="font-display text-4xl font-bold text-slate-800 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-[#be1e2d]">₹ {variant.price.toFixed(2)}</span>
                {variant.originalPrice > variant.price && (
                  <span className="text-2xl text-slate-300 line-through">₹ {variant.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <p className="text-[#be1e2d] text-xs font-bold mt-2 uppercase tracking-widest">Discount: ₹ {(variant.originalPrice - variant.price).toFixed(2)} ({discountPercent}%)</p>
            </div>

            {/* Weights */}
            <div className="py-8 border-b border-slate-100">
               <div className="flex flex-wrap gap-2">
                 {product.variants.map((v, idx) => (
                   <button
                    key={v.weight}
                    onClick={() => setSelectedVariant(idx)}
                    className={`min-w-[50px] px-3 h-9 flex items-center justify-center text-[10px] font-black uppercase tracking-widest border rounded-md transition-all ${selectedVariant === idx ? "bg-[#be1e2d] text-white border-[#be1e2d] shadow-lg shadow-red-50" : "bg-white text-slate-600 border-slate-200 hover:border-[#be1e2d]"}`}
                   >
                     {v.weight}
                   </button>
                 ))}
               </div>
            </div>

            {/* Qty & Add to Cart */}
            <div className="py-8 space-y-6">
               <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Qty:</span>
                  <div className="flex items-center bg-slate-50 rounded-full px-2 py-1 h-12">
                    <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="p-2 text-slate-400 hover:text-[#be1e2d]"><Minus className="w-4 h-4" /></button>
                    <span className="w-10 text-center font-bold text-slate-800 text-lg">{quantity.toString().padStart(2, '0')}</span>
                    <button onClick={() => setQuantity(q => q+1)} className="p-2 text-slate-400 hover:text-[#be1e2d]"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart(product.id, variant.weight, quantity);
                      toast({ title: "Added to Cart" });
                    }}
                    className="flex-grow h-12 bg-[#be1e2d] text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-[#a01926] transition-all shadow-xl shadow-red-100"
                  >
                    Add to Cart
                  </button>
               </div>

               <button 
                onClick={() => {
                  addToCart(product.id, variant.weight, quantity);
                  navigate("/checkout");
                }}
                className="w-full h-14 bg-[#be1e2d] text-white font-black text-sm uppercase tracking-[0.2em] rounded-md hover:bg-[#a01926] transition-all shadow-2xl shadow-red-200"
               >
                 Buy Now
               </button>

               <button 
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-[#be1e2d] uppercase tracking-[0.2em] transition-all pl-2"
               >
                 <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? "fill-[#be1e2d] text-[#be1e2d]" : ""}`} />
                 Add Wishlist
               </button>
            </div>

            {/* Meta Info */}
            <div className="space-y-3 pt-8 mt-auto">
               <div className="flex items-center text-[11px] gap-10">
                  <span className="text-slate-400 font-bold w-20">Availability:</span>
                  <span className="text-green-500 font-bold">In Stock</span>
               </div>
               <div className="flex items-center text-[11px] gap-10">
                  <span className="text-slate-400 font-bold w-20">Type:</span>
                  <span className="text-slate-600 font-medium">spices</span>
               </div>
               <div className="flex items-center text-[11px] gap-10">
                  <span className="text-slate-400 font-bold w-20">Categories:</span>
                  <span className="text-slate-600 font-medium uppercase tracking-tighter">{product.category}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Info Tabs */}
        <div className="mb-32">
           <div className="flex gap-10 border-b border-slate-100 mb-10 justify-center">
              <button 
                onClick={() => setActiveTab("description")}
                className={`pb-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === "description" ? "text-slate-900" : "text-slate-300 hover:text-slate-500"}`}
              >
                Description
                {activeTab === "description" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#be1e2d]" />}
              </button>
              <button 
                onClick={() => setActiveTab("additional")}
                className={`pb-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === "additional" ? "text-slate-900" : "text-slate-300 hover:text-slate-500"}`}
              >
                Additional Information
                {activeTab === "additional" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#be1e2d]" />}
              </button>
           </div>

           <div className="max-w-4xl mx-auto prose prose-slate">
              {activeTab === "description" ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="text-slate-600 leading-[1.8] font-medium whitespace-pre-line text-sm">
                    {product.longDescription}
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <div className="w-2 h-2 rounded-full bg-[#be1e2d]" />
                           <span className="text-sm font-bold text-slate-700">{h}</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Related Products */}
        <div className="pt-20 border-t border-slate-100">
           <div className="flex flex-col items-center mb-16">
              <h2 className="font-display text-4xl font-bold text-slate-800 mb-4">Related Products</h2>
              <div className="w-16 h-1 bg-[#be1e2d] rounded-full" />
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
