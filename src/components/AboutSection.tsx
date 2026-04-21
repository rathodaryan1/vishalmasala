import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { History, Award, CheckCircle2 } from "lucide-react";
import heritageAbout from "@/assets/heritage-about.png";

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 md:py-40 bg-white overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden select-none opacity-[0.03]">
        <h2 className="text-[20vw] font-black leading-none whitespace-nowrap -ml-20">
          VISHAL MASALA VISHAL MASALA
        </h2>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          <div className="relative order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)]"
            >
              <img
                src={heritageAbout}
                alt="Our spice heritage"
                className="w-full h-[500px] md:h-[700px] object-cover hover:scale-105 transition-transform duration-1000"
                loading="lazy"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            </motion.div>

            {/* Heritage Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -bottom-10 -right-10 w-48 h-48 bg-spice-gold p-1 rounded-full shadow-2xl z-20"
            >
              <div className="w-full h-full rounded-full border-2 border-white/20 border-dashed flex flex-col items-center justify-center text-slate-900 text-center p-4">
                <span className="font-black uppercase tracking-[0.2em] text-[10px] mb-1">Our spice heritage</span>
                <span className="font-display text-4xl font-black">Since</span>
                <span className="font-display text-5xl font-black leading-none mt-1">1950</span>
              </div>
            </motion.div>

            {/* Floating Accents */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-spice-red/5 rounded-full blur-3xl" />
          </div>

          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-spice-red" />
                <span className="font-black uppercase tracking-[0.4em] text-[10px] text-spice-red">
                  About Our Legacy
                </span>
              </div>

              <h2 className="font-display text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
                The Purest <span className="text-spice-gold italic">Indian Spices</span>
              </h2>

              <div className="space-y-8">
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium">
                  At Vishal Masala, spice isn't just an ingredient — it's an emotion. It evokes the joy of festive feasts, the warmth of family recipes, and the magic of perfectly seasoned plates shared with loved ones.
                </p>

                <div className="grid md:grid-cols-2 gap-8 py-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-spice-gold">
                      <History className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">70+ Years Legacy</h4>
                      <p className="text-sm text-slate-500">Trusted by generations since 1950 for authentic taste.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-spice-red">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Ambient Grinding</h4>
                      <p className="text-sm text-slate-500">Preserving natural oils and aroma with advanced tech.</p>
                    </div>
                  </div>
                </div>

                <p className="text-slate-500 leading-relaxed border-l-4 border-slate-100 pl-6 py-2 italic">
                  As India's trusted spice brand, we've been bringing authentic flavours to kitchens for generations. Made with the finest and purest ingredients, our spices and condiments lend traditional taste to your meals.
                </p>

                <div className="flex flex-wrap gap-10 pt-6">
                   <Link
                    to="/about"
                    className="group flex items-center gap-4 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-spice-red transition-all shadow-xl shadow-slate-200"
                  >
                    Learn More 
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </motion.div>
                  </Link>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1,2,3].map((i) => (
                        <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200`} />
                      ))}
                    </div>
                    <div className="text-xs font-bold text-slate-400">
                      <span className="text-slate-900">10k+</span> Happy Families
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
