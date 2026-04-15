import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import type { CartItem } from "@/context/ShopContext";

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

const tableName = "orders";

export const createOrder = async (payload: CheckoutPayload) => {
  if (!supabase || !hasSupabaseConfig) {
    return { error: "Supabase is not configured. Unable to save order.", data: null };
  }

  const primaryInsert = await supabase
    .from(tableName)
    .insert([{ ...payload, payment_status: "paid", status: "pending" }])
    .select()
    .single();

  if (!primaryInsert.error) {
    return { data: primaryInsert.data as OrderRecord | null, error: null };
  }

  // Backward-compatible retry for schemas that use address_line_1/address_line_2
  // instead of a single "address" column.
  if (primaryInsert.error.message.toLowerCase().includes("address")) {
    const retryInsert = await supabase
      .from(tableName)
      .insert([
        {
          user_id: payload.user_id ?? null,
          customer_name: payload.customer_name,
          customer_email: payload.customer_email,
          customer_phone: payload.customer_phone,
          address_line_1: payload.address,
          address_line_2: "",
          city: payload.city,
          state: payload.state,
          pincode: payload.pincode,
          cart_items: payload.cart_items,
          total_amount: payload.total_amount,
          payment_id: payload.payment_id,
          payment_status: "paid",
          status: "pending",
        },
      ])
      .select()
      .single();

    return { data: retryInsert.data as OrderRecord | null, error: retryInsert.error?.message ?? null };
  }

  return { data: null, error: primaryInsert.error.message };
};

export const listOrders = async () => {
  if (!supabase || !hasSupabaseConfig) {
    return { error: "Supabase is not configured.", data: [] as OrderRecord[] };
  }
  const { data, error } = await supabase.from(tableName).select("*").order("created_at", { ascending: false });
  return { data: (data ?? []) as OrderRecord[], error: error?.message ?? null };
};

export const listOrdersByEmail = async (email: string) => {
  if (!supabase || !hasSupabaseConfig) {
    return { error: "Supabase is not configured.", data: [] as OrderRecord[] };
  }
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("customer_email", email)
    .order("created_at", { ascending: false });
  return { data: (data ?? []) as OrderRecord[], error: error?.message ?? null };
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  if (!supabase || !hasSupabaseConfig) {
    return { error: "Supabase is not configured." };
  }
  const { error } = await supabase.from(tableName).update({ status }).eq("id", id);
  return { error: error?.message ?? null };
};
