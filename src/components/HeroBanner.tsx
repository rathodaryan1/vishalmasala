import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const slides = [
  {
    image: heroBanner,
    subtitle: "heritage of purity",
    title: "The Heart of Indian Kitchens",
    description: "Bringing you the finest selection of hand-picked spices, cold-ground to preserve 100% natural oils and heritage aroma.",
    cta: "Explore Our Range",
    link: "/products"
  },
  {
    image: heroBanner,
    subtitle: "Taste the Tradition",
    title: "Pure Authentic & Natural",
    description: "Savour the love in every bite. Our spices are crafted with care to bring out the true essence of Indian culinary excellence.",
    cta: "Shop Now",
    link: "/products"
  }
];

const HeroBanner = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  return (
    <section className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden bg-slate-900 border-b border-slate-100" ref={emblaRef}>
      <div className="flex h-full">
        {slides.map((slide, index) => (
          <div key={index} className="relative flex-[0_0_100%] h-full min-w-0">
            {/* Background Image with optimized contrast */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover scale-105 animate-[pulse_8s_infinite] opacity-50 md:opacity-100"
            />
            {/* Cinematic Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

            <div className="relative container h-full flex flex-col justify-center text-white px-6">
              <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
                <div className="inline-block px-4 py-1.5 bg-[#be1e2d] rounded-full">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white">
                    {slide.subtitle}
                  </span>
                </div>
                
                <h1 className="font-display text-5xl md:text-[7rem] font-black leading-[1.1] drop-shadow-2xl">
                  {slide.title.split(" ").map((word, i) => (
                    <React.Fragment key={i}>
                      {word === "Indian" || word === "Pure" ? (
                        <span className="text-spice-gold italic serif block md:inline">{word} </span>
                      ) : (
                        <span className="block md:inline">{word} </span>
                      )}
                    </React.Fragment>
                  ))}
                </h1>

                <p className="text-white/80 text-lg md:text-2xl font-medium max-w-lg leading-relaxed drop-shadow-md">
                  {slide.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-6">
                  <a
                    href={slide.link}
                    className="h-16 inline-flex items-center px-10 bg-[#be1e2d] text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-[#a01926] hover:-translate-y-1 transition-all shadow-2xl shadow-red-900/40"
                  >
                    {slide.cta}
                  </a>
                  <a
                    href="#about"
                    className="group h-16 inline-flex items-center gap-3 text-white font-black uppercase tracking-widest text-xs"
                  >
                   <span className="border-b-2 border-white/40 group-hover:border-white transition-all pb-1">Read More</span>
                   <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#be1e2d] transition-all">
                      <ChevronRight className="w-5 h-5" />
                   </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Indicators matching Image 2 style */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`transition-all duration-500 rounded-full ${
              index === selectedIndex 
                ? "w-12 h-2.5 bg-[#facc15]" 
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
