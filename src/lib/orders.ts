import type { CartItem } from "@/context/ShopContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface CheckoutPayload {
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  cart_items: CartItem[];
  total_amount: number;
  payment_id: string;
}

export interface OrderRecord extends CheckoutPayload {
  id: string;
  payment_status: "paid" | "failed";
  status: OrderStatus;
  created_at: string;
}

const getAuthHeaders = () => {
  const savedUser = localStorage.getItem("vishal_user");
  if (savedUser) {
    const user = JSON.parse(savedUser);
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    };
  }
  return { "Content-Type": "application/json" };
};

export const createOrder = async (payload: CheckoutPayload) => {
  try {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        orderItems: (payload.cart_items as any).map((item: any) => ({
          product: item.productId,
          quantity: item.quantity,
          variant: {
            weight: item.variantWeight,
            price: item.price,
          },
        })),
      }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to create order", data: null };

    return { 
      data: {
        ...payload,
        id: data._id,
        payment_status: data.payment_status,
        status: data.status,
        created_at: data.createdAt
      } as OrderRecord, 
      error: null 
    };
  } catch (err: any) {
    return { error: err.message || "Server connection error", data: null };
  }
};

export const listOrders = async () => {
  try {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to fetch orders", data: [] as OrderRecord[] };

    const formattedOrders = data.map((order: any) => ({
      id: order._id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      address: order.address,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      cart_items: order.cart_items,
      total_amount: order.total_amount,
      payment_id: order.payment_id,
      payment_status: order.payment_status,
      status: order.status,
      created_at: order.createdAt,
    }));

    return { data: formattedOrders as OrderRecord[], error: null };
  } catch (err: any) {
    return { error: err.message || "Server connection error", data: [] as OrderRecord[] };
  }
};

export const listOrdersByEmail = async (email: string) => {
  try {
    const res = await fetch(`${API_URL}/api/orders/myorders`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to fetch orders", data: [] as OrderRecord[] };

    const formattedOrders = data.map((order: any) => ({
      id: order._id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      address: order.address,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      cart_items: order.cart_items,
      total_amount: order.total_amount,
      payment_id: order.payment_id,
      payment_status: order.payment_status,
      status: order.status,
      created_at: order.createdAt,
    }));

    return { data: formattedOrders as OrderRecord[], error: null };
  } catch (err: any) {
    return { error: err.message || "Server connection error", data: [] as OrderRecord[] };
  }
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  try {
    const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to update status" };

    return { error: null };
  } catch (err: any) {
    return { error: err.message || "Server connection error" };
  }
};
