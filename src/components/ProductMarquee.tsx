import { useShop } from "@/context/ShopContext";
import ProductCard from "./ProductCard";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

const ProductMarquee = () => {
  const { products, loadingProducts } = useShop();
  
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true, 
      dragFree: true,
      align: "start"
    }, 
    [
      AutoScroll({ 
        playOnInit: true, 
        speed: 1,
        stopOnInteraction: false,
        stopOnMouseEnter: true
      })
    ]
  );

  if (loadingProducts) return null;

  return (
    <div className="w-full bg-background py-16 overflow-hidden">
      <div className="container mb-12">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Featured Collection</h2>
          <div className="w-24 h-1.5 bg-[#be1e2d] rounded-full"></div>
        </div>
      </div>
      
      <div className="relative overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex gap-8 py-10 px-4">
          {products.map((product, idx) => (
            <div key={`${product.id}-${idx}`} className="flex-[0_0_300px] min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
          {/* Duplicate some products to ensure smoothness if the list is short */}
          {products.length < 10 && products.map((product, idx) => (
            <div key={`${product.id}-dup-${idx}`} className="flex-[0_0_300px] min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductMarquee;
