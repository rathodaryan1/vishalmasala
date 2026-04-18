import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

interface ProductSliderProps {
  products: Product[];
  title?: string;
}

const ProductSlider = ({ products, title }: ProductSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          {title && (
            <div className="flex flex-col">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-800">{title}</h2>
              <div className="w-20 h-1 bg-[#be1e2d] mt-4 rounded-full" />
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <button
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-[#be1e2d] hover:text-[#be1e2d] disabled:opacity-30 disabled:hover:border-slate-100 disabled:hover:text-slate-400 transition-all shadow-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-[#be1e2d] hover:text-[#be1e2d] disabled:opacity-30 disabled:hover:border-slate-100 disabled:hover:text-slate-400 transition-all shadow-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 py-6 px-1">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] min-w-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-12">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`relative transition-all duration-500 rounded-full ${
                index === selectedIndex 
                  ? "w-6 h-6 border-2 border-[#1e293b]/20 flex items-center justify-center" 
                  : "w-1.5 h-1.5 bg-slate-200 hover:bg-slate-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
                {index === selectedIndex && (
                    <div className="w-2 h-2 bg-[#1e293b] rounded-full animate-in zoom-in duration-300" />
                )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
