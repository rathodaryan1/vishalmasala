import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { listOrdersByEmail, type OrderRecord } from "@/lib/orders";
import { useToast } from "@/hooks/use-toast";

const Account = () => {
  const { user, logout, updateProfileMetadata } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profile, setProfile] = useState({
    country: String(user?.user_metadata?.country ?? "India"),
    first_name: String(user?.user_metadata?.first_name ?? ""),
    last_name: String(user?.user_metadata?.last_name ?? ""),
    mobile: String(user?.user_metadata?.mobile ?? user?.user_metadata?.phone ?? ""),
    email: String(user?.email ?? ""),
    address_line_1: String(user?.user_metadata?.address_line_1 ?? user?.user_metadata?.address ?? ""),
    address_line_2: String(user?.user_metadata?.address_line_2 ?? ""),
    city: String(user?.user_metadata?.city ?? ""),
    state: String(user?.user_metadata?.state ?? ""),
    pincode: String(user?.user_metadata?.pincode ?? ""),
  });

  useEffect(() => {
    const load = async () => {
      if (!user?.email) {
        setLoadingOrders(false);
        return;
      }
      const result = await listOrdersByEmail(user.email);
      if (result.error) {
        toast({ title: "Unable to load orders", description: result.error, variant: "destructive" });
      } else {
        setOrders(result.data);
      }
      setLoadingOrders(false);
    };
    load();
  }, [user?.email, toast]);

  const onProfileSave = async () => {
    const result = await updateProfileMetadata(profile);
    if (result.error) {
      toast({ title: "Profile update failed", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: "Profile updated", description: "Your profile and address have been saved." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[#be1e2d] font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Welcome Back</span>
            <h1 className="font-display text-4xl md:text-6xl font-black text-slate-900 leading-tight">My Profile</h1>
            <p className="text-slate-500 mt-4 text-lg font-medium">{user?.email}</p>
          </div>
          <button 
            onClick={logout} 
            className="h-12 px-8 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest hover:border-[#be1e2d] hover:text-[#be1e2d] transition-all"
          >
            Logout Account
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-100/50">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-10">Personal Details & Address</h2>
              <div className="grid gap-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">First Name</label>
                    <input value={profile.first_name} onChange={(e) => setProfile(p => ({...p, first_name: e.target.value}))} placeholder="Aryan" className="w-full h-14 px-6 bg-slate-50 border-2 border-transparent focus:border-[#be1e2d]/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Last Name</label>
                    <input value={profile.last_name} onChange={(e) => setProfile(p => ({...p, last_name: e.target.value}))} placeholder="Rathod" className="w-full h-14 px-6 bg-slate-50 border-2 border-transparent focus:border-[#be1e2d]/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Mobile Number</label>
                  <input value={profile.mobile} onChange={(e) => setProfile(p => ({...p, mobile: e.target.value}))} placeholder="+91 00000 00000" className="w-full h-14 px-6 bg-slate-50 border-2 border-transparent focus:border-[#be1e2d]/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Shipping Address</label>
                  <input value={profile.address_line_1} onChange={(e) => setProfile(p => ({...p, address_line_1: e.target.value}))} placeholder="House No, Street Name" className="w-full h-14 px-6 bg-slate-50 border-2 border-transparent focus:border-[#be1e2d]/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all" />
                  <input value={profile.address_line_2} onChange={(e) => setProfile(p => ({...p, address_line_2: e.target.value}))} placeholder="Landmark, Area" className="w-full h-14 px-6 bg-slate-50 border-2 border-transparent focus:border-[#be1e2d]/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">City</label>
                    <input value={profile.city} onChange={(e) => setProfile(p => ({...p, city: e.target.value}))} placeholder="Surat" className="w-full h-14 px-6 bg-slate-50 border-2 border-transparent focus:border-[#be1e2d]/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">State</label>
                    <input value={profile.state} onChange={(e) => setProfile(p => ({...p, state: e.target.value}))} placeholder="Gujarat" className="w-full h-14 px-6 bg-slate-50 border-2 border-transparent focus:border-[#be1e2d]/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all" />
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Pincode</label>
                    <input value={profile.pincode} onChange={(e) => setProfile(p => ({...p, pincode: e.target.value}))} placeholder="395001" className="w-full h-14 px-6 bg-slate-50 border-2 border-transparent focus:border-[#be1e2d]/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all" />
                  </div>
                </div>

                <button 
                  onClick={onProfileSave} 
                  className="w-full h-16 bg-[#be1e2d] text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-[#a01926] transition-all shadow-xl shadow-red-100 active:scale-95"
                >
                  Save Profile Information
                </button>
              </div>
            </div>
          </div>

          {/* Order Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-full shadow-2xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">Recent Orders</h2>
              {loadingOrders ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />)}
                </div>
              ) : orders.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto no-scrollbar">
                  {orders.map((order) => (
                    <div key={order.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-mono text-white/40">#{order.id.slice(-8)}</span>
                        <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-spice-gold/20 text-spice-gold'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xl font-black mb-1">₹ {order.total_amount.toFixed(2)}</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              <Link to="/products" className="mt-8 flex items-center justify-center w-full h-14 border-2 border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-slate-900 transition-all">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
