import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { listOrders, type OrderRecord, type OrderStatus, updateOrderStatus } from "@/lib/orders";
import { useToast } from "@/hooks/use-toast";

const statuses: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { logout } = useAuth();
  const { toast } = useToast();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const result = await listOrders();
    if (result.error) {
      toast({ title: "Unable to fetch orders", description: result.error, variant: "destructive" });
    } else {
      setOrders(result.data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.id.toLowerCase().includes(query.toLowerCase()) ||
          order.customer_name.toLowerCase().includes(query.toLowerCase())
      ),
    [orders, query]
  );

  const onStatusChange = async (id: string, status: OrderStatus) => {
    const result = await updateOrderStatus(id, status);
    if (result.error) {
      toast({ title: "Status update failed", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: "Order updated", description: `Status changed to ${status}.` });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold">Admin Orders</h1>
            <p className="text-sm text-muted-foreground">Manage incoming paid orders from checkout.</p>
          </div>
          <button onClick={logout} className="px-4 py-2 rounded-lg border border-primary text-primary">Logout</button>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order ID or customer name"
          className="w-full md:w-96 border border-border rounded-lg px-3 py-2 mb-4"
        />

        <div className="border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="p-3">Order</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="p-4 text-muted-foreground" colSpan={7}>Loading orders...</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td className="p-4 text-muted-foreground" colSpan={7}>No orders found.</td></tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-border align-top">
                      <td className="p-3 font-mono text-xs">{order.id}</td>
                      <td className="p-3">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                      </td>
                      <td className="p-3">{order.cart_items.reduce((acc, item) => acc + item.quantity, 0)}</td>
                      <td className="p-3 font-semibold">₹ {order.total_amount.toFixed(2)}</td>
                      <td className="p-3">{order.payment_status}</td>
                      <td className="p-3">
                        <select
                          value={order.status}
                          onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                          className="border border-border rounded px-2 py-1"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminOrders;
