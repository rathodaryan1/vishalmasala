import { useShop } from "@/context/ShopContext";
import ProductCard from "./ProductCard";

const ProductMarquee = () => {
  const { products, loadingProducts } = useShop();

  if (loadingProducts) return null;

  // Duplicate products to create a seamless loop
  const displayProducts = [...products, ...products, ...products];

  return (
    <div className="w-full bg-background py-16 overflow-hidden">
      <div className="container mb-12">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Featured Collection</h2>
          <div className="w-24 h-1.5 bg-[#be1e2d] rounded-full"></div>
        </div>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee flex gap-8 whitespace-nowrap py-10 px-4">
          {displayProducts.map((product, idx) => (
            <div key={`${product.id}-${idx}`} className="w-[300px] inline-block shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="absolute top-0 animate-marquee2 flex gap-8 whitespace-nowrap py-10 px-4">
          {displayProducts.map((product, idx) => (
            <div key={`${product.id}-second-${idx}`} className="w-[300px] inline-block shrink-0">
               <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .animate-marquee2 {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee2:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
};

export default ProductMarquee;
