import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { useShop } from "@/context/ShopContext";
import { calculateCartTotals } from "@/lib/cart";
import { loadRazorpayScript } from "@/lib/razorpay";
import { createOrder } from "@/lib/orders";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { User, Phone, MapPin, Mail, CreditCard, ChevronRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface CheckoutForm {
  first_name: string;
  last_name: string;
  customer_email: string;
  customer_phone: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  pincode: string;
}

const Checkout = () => {
  const { cartItems, clearCart, products } = useShop();
  const { user } = useAuth();
  const { total, resolved } = useMemo(() => calculateCartTotals(cartItems, products), [cartItems, products]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    first_name: String(user?.user_metadata?.first_name ?? ""),
    last_name: String(user?.user_metadata?.last_name ?? ""),
    customer_email: String(user?.email ?? ""),
    customer_phone: String(user?.user_metadata?.mobile ?? user?.user_metadata?.phone ?? ""),
    address_line_1: String(user?.user_metadata?.address_line_1 ?? user?.user_metadata?.address ?? ""),
    address_line_2: String(user?.user_metadata?.address_line_2 ?? ""),
    city: String(user?.user_metadata?.city ?? ""),
    state: String(user?.user_metadata?.state ?? ""),
    pincode: String(user?.user_metadata?.pincode ?? ""),
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const onChange = (key: keyof CheckoutForm, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handlePayment = async () => {
    if (!resolved.length) {
      toast({ title: "Cart is empty", description: "Add products before checkout.", variant: "destructive" });
      return;
    }
    
    // Strict enforcement of mandatory fields
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.customer_phone.trim() ||
      !form.address_line_1.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      toast({ title: "Action Required", description: "Name, Phone, and Address are compulsory for delivery.", variant: "destructive" });
      return;
    }

    // Phone number validation (simple 10 digit check)
    if (!/^\d{10}$/.test(form.customer_phone.replace(/\D/g, '').slice(-10))) {
        toast({ title: "Invalid Phone", description: "Please enter a valid 10-digit mobile number.", variant: "destructive" });
        return;
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      toast({ title: "Razorpay error", description: "System configuration missing (Key ID).", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        toast({ title: "Service Unavailable", description: "Unable to load payment gateway.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const resOrder = await fetch(`${API_URL}/api/payment/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ amount: total }),
      });
      const razorpayOrder = await resOrder.json();
      if (!resOrder.ok) throw new Error(razorpayOrder.message || "Failed to initiate payment");

      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Vishal Masala",
        description: "Secure Spice Delivery",
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          try {
            const resVerify = await fetch(`${API_URL}/api/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              },
              body: JSON.stringify(response),
            });
            const verification = await resVerify.json();
            if (!resVerify.ok || !verification.success) throw new Error("Payment verification failed");

            const result = await createOrder({
              user_id: user?.id ?? null,
              customer_name: `${form.first_name} ${form.last_name}`.trim(),
              customer_email: form.customer_email,
              customer_phone: form.customer_phone,
              address: `${form.address_line_1}${form.address_line_2 ? `, ${form.address_line_2}` : ""}`,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
              cart_items: resolved.map(r => ({
                productId: r.product.id,
                variantWeight: r.variant.weight,
                quantity: r.item.quantity,
                price: r.variant.price
              })) as any, 
              total_amount: total,
              payment_id: response.razorpay_payment_id,
            });

            if (result.error) {
              toast({ title: "Order error", description: "Your payment was successful but we failed to save the order. Contact support.", variant: "destructive" });
              setLoading(false);
              return;
            }

            clearCart();
            toast({ title: "Order Placed!", description: "Your authentic spices are on the way." });
            setLoading(false);
            navigate("/account"); 
          } catch (err: any) {
            toast({ title: "Transaction Error", description: err.message, variant: "destructive" });
            setLoading(false);
          }
        },
        prefill: {
          name: `${form.first_name} ${form.last_name}`.trim(),
          email: form.customer_email,
          contact: form.customer_phone,
        },
        theme: { color: "#be1e2d" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <Navbar />
      <div className="container py-8 max-w-5xl">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-hidden">
            <span>Cart</span> <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-bold">Delivery Details</span> <ChevronRight className="w-3 h-3" />
            <span>Payment</span>
        </div>

        <h1 className="font-display text-2xl md:text-3xl font-black mb-8 text-slate-800">Secure Checkout</h1>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-10">
            {/* Contact Info */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#be1e2d]">
                        <User className="w-4 h-4" />
                    </div>
                    <h2 className="font-bold text-lg text-slate-800">Personal Information</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name *</label>
                        <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-[#be1e2d]/20 transition-all font-bold placeholder:text-slate-300" placeholder="e.g. Aaryan" value={form.first_name} onChange={(e) => onChange("first_name", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name *</label>
                        <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-[#be1e2d]/20 transition-all font-bold placeholder:text-slate-300" placeholder="e.g. Rathod" value={form.last_name} onChange={(e) => onChange("last_name", e.target.value)} />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Phone *</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r pr-3 border-slate-200">
                           <span className="text-xs font-black text-slate-400">+91</span>
                        </div>
                        <input 
                            type="tel"
                            className="w-full bg-slate-50 border-none rounded-xl pl-16 pr-4 py-3 focus:ring-2 ring-[#be1e2d]/20 transition-all font-bold placeholder:text-slate-300" 
                            placeholder="Mobile number" 
                            value={form.customer_phone} 
                            onChange={(e) => onChange("customer_phone", e.target.value)} 
                        />
                    </div>
                </div>
                <div className="space-y-1.5 opacity-60">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email (Autofilled)</label>
                    <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold cursor-not-allowed" value={form.customer_email} disabled />
                </div>
            </section>

            {/* Delivery Info */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#be1e2d]">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <h2 className="font-bold text-lg text-slate-800">Shipping Address</h2>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Street Address *</label>
                    <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-[#be1e2d]/20 transition-all font-bold placeholder:text-slate-300" placeholder="House number and street name" value={form.address_line_1} onChange={(e) => onChange("address_line_1", e.target.value)} />
                </div>
                <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-[#be1e2d]/20 transition-all font-bold placeholder:text-slate-300" placeholder="Apartment, suite, unit, etc. (optional)" value={form.address_line_2} onChange={(e) => onChange("address_line_2", e.target.value)} />
                
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">City *</label>
                        <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-[#be1e2d]/20 transition-all font-bold placeholder:text-slate-300" placeholder="Ahmedabad" value={form.city} onChange={(e) => onChange("city", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">State *</label>
                        <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-[#be1e2d]/20 transition-all font-bold placeholder:text-slate-300" placeholder="Gujarat" value={form.state} onChange={(e) => onChange("state", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pincode *</label>
                        <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-[#be1e2d]/20 transition-all font-bold placeholder:text-slate-300" placeholder="380001" value={form.pincode} onChange={(e) => onChange("pincode", e.target.value)} />
                    </div>
                </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-[#be1e2d] text-white rounded-[2rem] p-8 shadow-2xl shadow-red-100 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                 <CreditCard className="w-5 h-5" />
                 <h2 className="font-bold text-lg">Order Summary</h2>
              </div>
              
              <div className="space-y-4 mb-8">
                {resolved.map((line) => (
                  <div key={`${line.product.id}-${line.item.variantWeight}`} className="flex justify-between items-start gap-4 text-sm">
                    <span className="font-medium opacity-80">{line.product.name} ({line.variant.weight}) x {line.item.quantity}</span>
                    <span className="font-black whitespace-nowrap">₹ {(line.variant.price * line.item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6 mt-auto">
                <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest opacity-60">Grand Total</span>
                    <span className="text-3xl font-black">₹ {total.toFixed(0)}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment} 
                disabled={loading} 
                className="w-full mt-8 py-4 rounded-xl bg-white text-[#be1e2d] font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-xl disabled:opacity-50 active:scale-95"
              >
                {loading ? "PROCESSING..." : "PLACE ORDER NOW"}
              </button>
              
              <p className="mt-4 text-[9px] font-black uppercase tracking-widest text-center opacity-40">
                Secure 256-bit encrypted checkout
              </p>
            </div>
          </aside>
        </div>
      </div>
      <BottomNav />
      <Footer />
    </div>
  );
};

export default Checkout;
