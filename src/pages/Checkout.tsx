import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useShop } from "@/context/ShopContext";
import { calculateCartTotals } from "@/lib/cart";
import { loadRazorpayScript } from "@/lib/razorpay";
import { createOrder } from "@/lib/orders";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface CheckoutForm {
  country: string;
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
  const { cartItems, clearCart } = useShop();
  const { user } = useAuth();
  const { total, resolved } = useMemo(() => calculateCartTotals(cartItems), [cartItems]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    country: String(user?.user_metadata?.country ?? "India"),
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
    if (
      !form.country.trim() ||
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.customer_email.trim() ||
      !form.customer_phone.trim() ||
      !form.address_line_1.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      toast({ title: "Missing details", description: "Please fill delivery details.", variant: "destructive" });
      return;
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      toast({ title: "Razorpay key missing", description: "Set VITE_RAZORPAY_KEY_ID in env.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      toast({ title: "Payment failed", description: "Unable to load Razorpay checkout.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const options = {
      key,
      amount: Math.round(total * 100),
      currency: "INR",
      name: "Vishal Masala",
      description: "Demo payment flow (frontend only)",
      handler: async (response: { razorpay_payment_id: string }) => {
        const result = await createOrder({
          user_id: user?.id ?? null,
          customer_name: `${form.first_name} ${form.last_name}`.trim(),
          customer_email: form.customer_email,
          customer_phone: form.customer_phone,
          address: `${form.address_line_1}${form.address_line_2 ? `, ${form.address_line_2}` : ""}`,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          cart_items: cartItems,
          total_amount: total,
          payment_id: response.razorpay_payment_id,
        });
        if (result.error) {
          toast({ title: "Order save failed", description: result.error, variant: "destructive" });
          setLoading(false);
          return;
        }
        clearCart();
        toast({ title: "Payment successful", description: "Your order has been placed." });
        setLoading(false);
        navigate("/products");
      },
      prefill: {
        name: `${form.first_name} ${form.last_name}`.trim(),
        email: form.customer_email,
        contact: form.customer_phone,
      },
      notes: {
        warning: "Demo flow without server-side signature verification",
      },
      theme: { color: "#be1e2d" },
      modal: {
        ondismiss: () => {
          setLoading(false);
          toast({ title: "Payment cancelled", description: "You can retry anytime." });
        },
      },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-sm text-muted-foreground mb-6">Frontend Razorpay flow for demo use. Add server verification for production.</p>

        <div className="grid lg:grid-cols-[1fr_330px] gap-6">
          <div className="border border-border rounded-xl p-5 space-y-4">
            <input className="w-full border border-border rounded-lg px-3 py-2" placeholder="Country / Region" value={form.country} onChange={(e) => onChange("country", e.target.value)} />
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="border border-border rounded-lg px-3 py-2" placeholder="First name" value={form.first_name} onChange={(e) => onChange("first_name", e.target.value)} />
              <input className="border border-border rounded-lg px-3 py-2" placeholder="Last name" value={form.last_name} onChange={(e) => onChange("last_name", e.target.value)} />
            </div>
            <input className="w-full border border-border rounded-lg px-3 py-2 bg-muted/30" placeholder="Email" value={form.customer_email} disabled onChange={(e) => onChange("customer_email", e.target.value)} />
            <input className="w-full border border-border rounded-lg px-3 py-2" placeholder="Address" value={form.address_line_1} onChange={(e) => onChange("address_line_1", e.target.value)} />
            <input className="w-full border border-border rounded-lg px-3 py-2" placeholder="Apartment, suite, etc." value={form.address_line_2} onChange={(e) => onChange("address_line_2", e.target.value)} />
            <div className="grid sm:grid-cols-3 gap-3">
              <input className="border border-border rounded-lg px-3 py-2" placeholder="City" value={form.city} onChange={(e) => onChange("city", e.target.value)} />
              <input className="border border-border rounded-lg px-3 py-2" placeholder="State" value={form.state} onChange={(e) => onChange("state", e.target.value)} />
              <input className="border border-border rounded-lg px-3 py-2" placeholder="Pincode" value={form.pincode} onChange={(e) => onChange("pincode", e.target.value)} />
            </div>
            <input className="w-full border border-border rounded-lg px-3 py-2" placeholder="Phone" value={form.customer_phone} onChange={(e) => onChange("customer_phone", e.target.value)} />
          </div>

          <div className="border border-border rounded-xl p-5 h-fit">
            <h2 className="font-display text-xl font-bold mb-4">Payment Summary</h2>
            <div className="text-sm space-y-2">
              {resolved.map((line) => (
                <div key={`${line.product.id}-${line.item.variantWeight}`} className="flex justify-between">
                  <span>{line.product.name} x {line.item.quantity}</span>
                  <span>₹ {(line.variant.price * line.item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>₹ {total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handlePayment} disabled={loading} className="w-full mt-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-60">
              {loading ? "Processing..." : "Pay with Razorpay"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
