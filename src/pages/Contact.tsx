import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, MessageSquare, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast({ title: "Message Sent!", description: data.message });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast({ title: "Submission Error", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to connect to the server. Please try again later.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header Section - Red Branding */}
      <div className="bg-[#be1e2d] text-white pt-24 pb-32">
        <div className="container relative overflow-hidden">
          {/* Decorative background spice patterns info */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-20 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          
          <div className="max-w-3xl relative z-10">
            <span className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 animate-in fade-in slide-in-from-bottom-2">
              Contact Us
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-black mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Taste the Trust, <br />
              <span className="text-[#facc15]">Order the Best.</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Have a bulk order or just a simple query? We're here to bring the finest spices to your doorstep.
            </p>
          </div>
        </div>
      </div>

      <div className="container -mt-16 pb-24 relative z-20">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Main Form - White High Fidelity Card */}
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(190,30,45,0.1)] border border-slate-100 overflow-hidden relative">
            {/* Corner Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#be1e2d]/5 rounded-bl-[5rem]" />
            
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 bg-[#be1e2d] rounded-2xl flex items-center justify-center shadow-lg shadow-red-100">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-display text-3xl font-black text-slate-800">Send Inquiry</h2>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Response within 24 Hours</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 pl-1">Your Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aaryan Rathod"
                    className="w-full h-14 bg-[#fcfcfc] border border-slate-100 rounded-2xl px-6 focus:border-[#be1e2d] focus:ring-4 focus:ring-[#be1e2d]/5 outline-none transition-all font-bold placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 pl-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. name@example.com"
                    className="w-full h-14 bg-[#fcfcfc] border border-slate-100 rounded-2xl px-6 focus:border-[#be1e2d] focus:ring-4 focus:ring-[#be1e2d]/5 outline-none transition-all font-bold placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 pl-1">Subject of Message</label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help you today?"
                  className="w-full h-14 bg-[#fcfcfc] border border-slate-100 rounded-2xl px-6 focus:border-[#be1e2d] focus:ring-4 focus:ring-[#be1e2d]/5 outline-none transition-all font-bold placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 pl-1">Your Detailed Message</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your requirements..."
                  className="w-full bg-[#fcfcfc] border border-slate-100 rounded-[2rem] p-6 focus:border-[#be1e2d] focus:ring-4 focus:ring-[#be1e2d]/5 outline-none transition-all font-bold placeholder:text-slate-300 resize-none"
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full md:w-auto h-16 bg-[#be1e2d] text-white px-12 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#a01926] hover:-translate-y-1 transition-all shadow-2xl shadow-red-100 disabled:opacity-50"
              >
                {loading ? "SENDING..." : (
                  <>
                    FIRE MESSAGE <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Map Section Integrated into Form Card */}
            <div className="mt-16 pt-16 border-t border-slate-100">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-[#facc15] rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-[#78350f]" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-slate-800">Visit Our Store</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Physical Presence in Gujarat</p>
                  </div>
                </div>
               
               <div className="w-full h-[400px] rounded-[2rem] overflow-hidden border border-slate-100 shadow-inner group">
                  <iframe 
                    title="Vishal Masala Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.6979644026856!2d72.50239!3d23.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fccd761ecbb5234!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1713444444444!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
               </div>
            </div>
          </div>

          {/* Contact Fast Info - Red Theme */}
          <div className="space-y-6">
            <div className="bg-[#be1e2d] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-x-10 -translate-y-10" />
              <h3 className="font-display text-2xl font-black mb-10 relative z-10">Fast Connect</h3>
              
              <div className="space-y-8 relative z-10">
                <a href="tel:+919375425771" className="flex items-center gap-5 group/item bg-white/10 p-4 rounded-3xl hover:bg-white/20 transition-all">
                  <div className="w-12 h-12 bg-white text-[#be1e2d] rounded-2xl flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform">
                    <Phone className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-1">Call Store</p>
                    <p className="font-bold text-lg">+91 93754 25771</p>
                  </div>
                </a>
                
                <a href="mailto:aaryan.b.rathod99@gmail.com" className="flex items-center gap-5 group/item bg-white/10 p-4 rounded-3xl hover:bg-white/20 transition-all">
                  <div className="w-12 h-12 bg-white text-[#be1e2d] rounded-2xl flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-1">Email Box</p>
                    <p className="font-bold text-sm break-all">aaryan.b.rathod99@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-5 group/item bg-white/10 p-4 rounded-3xl">
                  <div className="w-12 h-12 bg-white text-[#be1e2d] rounded-2xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-1">Location</p>
                    <p className="font-bold">Gujarat, India</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-white/10 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Social Trust</p>
                <div className="flex justify-center gap-4">
                   <div className="w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition-all cursor-pointer" />
                   <div className="w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition-all cursor-pointer" />
                   <div className="w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition-all cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Wholesale/Bulk Query Branding */}
            <div className="bg-white p-8 rounded-[3rem] border-4 border-[#be1e2d] shadow-xl text-center flex flex-col items-center">
               <IndianRupee className="w-10 h-10 text-[#be1e2d] mb-4" />
               <h4 className="font-display text-xl font-black text-slate-800 mb-2">Wholesale Inquiries</h4>
               <p className="text-slate-500 text-sm mb-6 font-medium">For hotel, restaurant or exports orders.</p>
               <Link to="/contact" className="text-[#be1e2d] font-black text-[10px] uppercase tracking-widest border-b-2 border-[#be1e2d] pb-1 hover:text-[#a01926] transition-colors">Apply Now</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
