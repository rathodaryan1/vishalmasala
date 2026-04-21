import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import marketingSpice from "@/assets/marketing-spice.png";

const MarketingBanner = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-slate-900" />
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-[url('/spice-pattern.png')] opacity-10 mix-blend-overlay"
      />
      
      {/* Decorative floating elements */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] w-32 h-32 bg-spice-gold/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[10%] w-48 h-48 bg-spice-red/10 rounded-full blur-3xl"
      />

      <div className="relative container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-2 bg-spice-gold/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-spice-gold animate-pulse" />
              </div>
              <span className="font-black uppercase tracking-[.4em] text-[10px] md:text-xs text-spice-gold">
                Premium Heritage Selection
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-5xl md:text-7xl font-black leading-[1.1] mb-10"
            >
              Swad Aur Sehat Ka <br />
              <span className="text-spice-gold italic relative">
                Anokha Combination
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute -bottom-2 left-0 h-1.5 bg-spice-gold/30 rounded-full"
                />
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/70 text-lg md:text-xl mb-12 leading-relaxed max-w-lg font-medium italic border-l-4 border-spice-gold pl-8"
            >
              "Experience the perfect harmony of taste and health with our farm-fresh, cold-ground spices that preserve essential oils and natural goodness."
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6"
            >
              <Link 
                to="/products"
                className="group relative inline-flex h-16 items-center px-10 bg-spice-red text-white font-black uppercase tracking-widest text-xs rounded-2xl overflow-hidden shadow-2xl shadow-red-900/40 hover:shadow-red-900/60 transition-all"
              >
                <span className="relative z-10">Shop the Range</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link 
                to="/about"
                className="inline-flex h-16 items-center px-10 bg-white/5 backdrop-blur-md text-white border border-white/10 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all"
              >
                Our Story
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative w-full max-w-xl aspect-[4/5] group"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-spice-gold/20 rounded-[4rem] blur-[80px] group-hover:bg-spice-gold/40 transition-all duration-700" />
            
            {/* Main Image Container */}
            <div className="relative w-full h-full bg-white/5 rounded-[4rem] backdrop-blur-2xl p-8 md:p-12 border border-white/10 overflow-hidden shadow-2xl">
              <motion.img 
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                src={marketingSpice} 
                alt="Premium Spice Packaging" 
                className="w-full h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-12 right-12 w-24 h-24 border-2 border-spice-gold/30 rounded-full flex items-center justify-center border-dashed"
              >
                <div className="w-20 h-20 bg-spice-gold rounded-full flex items-center justify-center text-slate-900 font-black text-[10px] uppercase tracking-tighter text-center leading-tight shadow-xl">
                  Pure<br/>Authentic<br/>Selection
                </div>
              </motion.div>
            </div>
            
            {/* Accent Elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-spice-red/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MarketingBanner;
