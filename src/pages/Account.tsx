import { useEffect, useState } from "react";
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
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold">My Account</h1>
          <button onClick={logout} className="px-4 py-2 rounded-lg border border-primary text-primary">Logout</button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="border border-border rounded-xl p-5">
            <h2 className="font-display text-xl font-bold mb-3">Profile & Address</h2>
            <div className="space-y-3">
              <input value={profile.country} onChange={(event) => setProfile((prev) => ({ ...prev, country: event.target.value }))} placeholder="Country / Region" className="w-full border border-border rounded-lg px-3 py-2" />
              <div className="grid grid-cols-2 gap-2">
                <input value={profile.first_name} onChange={(event) => setProfile((prev) => ({ ...prev, first_name: event.target.value }))} placeholder="First name" className="border border-border rounded-lg px-3 py-2" />
                <input value={profile.last_name} onChange={(event) => setProfile((prev) => ({ ...prev, last_name: event.target.value }))} placeholder="Last name" className="border border-border rounded-lg px-3 py-2" />
              </div>
              <input value={profile.email} disabled placeholder="Email" className="w-full border border-border rounded-lg px-3 py-2 bg-muted/30" />
              <input value={profile.address_line_1} onChange={(event) => setProfile((prev) => ({ ...prev, address_line_1: event.target.value }))} placeholder="Address" className="w-full border border-border rounded-lg px-3 py-2" />
              <input value={profile.address_line_2} onChange={(event) => setProfile((prev) => ({ ...prev, address_line_2: event.target.value }))} placeholder="Apartment, suite, etc." className="w-full border border-border rounded-lg px-3 py-2" />
              <div className="grid grid-cols-3 gap-2">
                <input value={profile.city} onChange={(event) => setProfile((prev) => ({ ...prev, city: event.target.value }))} placeholder="City" className="border border-border rounded-lg px-3 py-2" />
                <input value={profile.state} onChange={(event) => setProfile((prev) => ({ ...prev, state: event.target.value }))} placeholder="State" className="border border-border rounded-lg px-3 py-2" />
                <input value={profile.pincode} onChange={(event) => setProfile((prev) => ({ ...prev, pincode: event.target.value }))} placeholder="Pincode" className="border border-border rounded-lg px-3 py-2" />
              </div>
              <input value={profile.mobile} onChange={(event) => setProfile((prev) => ({ ...prev, mobile: event.target.value }))} placeholder="Phone" className="w-full border border-border rounded-lg px-3 py-2" />
              <button onClick={onProfileSave} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold">Save profile</button>
            </div>
          </div>

          <div className="border border-border rounded-xl p-5">
            <h2 className="font-display text-xl font-bold mb-3">Order Delivery Status</h2>
            {loadingOrders ? (
              <p className="text-sm text-muted-foreground">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders found yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border border-border rounded-lg p-3">
                    <p className="text-xs font-mono">{order.id}</p>
                    <p className="text-sm mt-1">Amount: <span className="font-semibold">₹ {order.total_amount.toFixed(2)}</span></p>
                    <p className="text-sm">Payment: {order.payment_status}</p>
                    <p className="text-sm">Delivery status: <span className="font-semibold capitalize">{order.status}</span></p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
