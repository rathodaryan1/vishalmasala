import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Home Chef",
    content: "Vishal Masala's Garam Masala is a game changer! The aroma and freshness are unmatched. It has become a staple in my kitchen.",
    stars: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    name: "Rajesh Kumar",
    role: "Restaurant Owner",
    content: "We've been using these spices for our restaurant for over a year now. The consistency in quality is what keeps us coming back.",
    stars: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh"
  },
  {
    name: "Anjali G.",
    role: "Culinary Blogger",
    content: "Authenticity at its best! Their pure turmeric powder gives a vibrant color and flavor that is hard to find in other brands.",
    stars: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-[#f8fafc] overflow-hidden">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">What Our Secret Chefs Say</h2>
          <div className="w-24 h-1.5 bg-[#be1e2d] mx-auto rounded-full mb-6" />
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Trusted by thousands of families across India for authentic heritage flavors.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={t.name}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 relative group animate-in fade-in slide-in-from-bottom-6"
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-[#be1e2d]/5 group-hover:text-[#be1e2d]/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#facc15] text-[#facc15]" />
                ))}
              </div>

              <p className="text-slate-600 leading-relaxed mb-8 italic text-lg">"{t.content}"</p>
              
              <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-[#be1e2d]/20" />
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
