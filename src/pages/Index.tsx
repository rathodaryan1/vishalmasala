import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import AboutSection from "@/components/AboutSection";
import ProductSlider from "@/components/ProductSlider";
import CategoryCard from "@/components/CategoryCard";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { useShop } from "@/context/ShopContext";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { listBlogs, type BlogPost } from "@/lib/blogs";

const Index = () => {
  const { products } = useShop();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const load = async () => {
      try {
        const [blogRes, catRes] = await Promise.all([
          listBlogs(),
          fetch(`${API_URL}/api/categories`).then(res => res.json())
        ]);
        setBlogs(blogRes.data.slice(0, 3));
        if (Array.isArray(catRes)) {
            setCategories(catRes);
        }
      } catch (err) {
        console.error("Error loading home data", err);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroBanner />
      
      {/* Top Selling Products Section */}
      <section className="pt-20 pb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="container text-center">
            <h2 className="font-display text-3xl md:text-5xl font-black text-[#1e293b] mb-4">Top Selling Products</h2>
        </div>
        <ProductSlider 
            products={products.filter(p => p.badge === "NEW PACK" || products.indexOf(p) < 8)} 
        />
      </section>

      {/* Our Spices Collection */}
      <section className="py-24 bg-white border-t border-slate-50 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="container">
          <div className="text-center mb-16 px-4">
            <h2 className="font-display text-4xl md:text-5xl font-black text-[#1e293b] mb-4">Range of Spices</h2>
            <div className="w-20 h-1.5 bg-[#be1e2d] mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {categories.length > 0 ? categories.map((cat) => (
              <CategoryCard 
                key={cat._id || cat.title}
                title={cat.name || cat.title}
                image={cat.image}
              />
            )) : (
              <div className="col-span-full py-10 text-center text-slate-400 font-bold uppercase tracking-widest leading-loose">
                   Catalog coming soon...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Marketing Banner: Anokha Combination */}
      <section className="relative py-24 overflow-hidden animate-in fade-in duration-1000">
        <div className="absolute inset-0 bg-[#be1e2d] rotate-[-1deg] scale-110" />
        <div className="relative container flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-white max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-[#facc15]" />
              <span className="font-black uppercase tracking-[.3em] text-xs">Premium Heritage</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-black leading-tight mb-8">
              Swad Aur Sehat Ka <br />
              <span className="text-[#facc15]">Anokha Combination</span>
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed max-w-lg font-medium italic">
              "Experience the perfect harmony of taste and health with our farm-fresh, cold-ground spices that preserve essential oils and natural goodness."
            </p>
            <Link 
              to="/products"
              className="inline-flex h-14 items-center px-10 bg-white text-[#be1e2d] font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-50 transition-all hover:-translate-y-1 shadow-2xl"
            >
              Shop the Range
            </Link>
          </div>
          
          <div className="relative w-full max-w-sm aspect-square bg-white/10 rounded-[3rem] backdrop-blur-sm p-8 border border-white/20">
             <div className="w-full h-full bg-white/20 rounded-[2rem] flex items-center justify-center text-white/40 italic text-center px-10">
                [High Quality Spice Pack Image Display]
             </div>
          </div>
        </div>
      </section>

      <AboutSection />

      {/* Blog Highlights */}
      <section className="py-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-800 mb-4">The Spice Journal</h2>
              <div className="w-20 h-1.5 bg-[#be1e2d] rounded-full" />
              <p className="text-slate-500 mt-6 max-w-xl text-lg">Read heritage stories, kitchen secrets, and culinary guides from our masala experts.</p>
            </div>
            <Link 
              to="/blog" 
              className="group flex items-center gap-3 text-[#be1e2d] font-black uppercase tracking-widest text-xs hover:gap-5 transition-all"
            >
              View All Stories <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {blogs.length > 0 ? blogs.map((blog) => (
              <Link 
                key={blog._id} 
                to={`/blog/${blog.slug}`}
                className="group flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden rounded-[2rem] mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#be1e2d]">
                    {blog.date}
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold mb-3 group-hover:text-[#be1e2d] transition-colors leading-tight line-clamp-2">
                  {blog.title}
                </h3>
                <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <BookOpen className="w-3.5 h-3.5" /> Read Full Story
                </div>
              </Link>
            )) : (
              <div className="col-span-3 text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                 <p className="text-slate-400 font-bold uppercase tracking-widest">Collecting stories...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
