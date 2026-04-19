const API_URL = import.meta.env.VITE_API_URL || "https://vishal-backend.onrender.com";

export interface ProductVariant {
  weight: string;
  price: number;
  originalPrice: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  longDescription: string;
  highlights: string[];
  isOffer?: boolean;
  badge?: string;
  variants: ProductVariant[];
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

export const listProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/api/products`);
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to fetch products", data: [] as Product[] };

    const formatted = data.map((p: any) => ({
      ...p,
      id: p._id,
    }));
    return { data: formatted as Product[], error: null };
  } catch (err: any) {
    return { error: err.message || "Server connection error", data: [] as Product[] };
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`);
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to fetch product", data: null };

    return { data: { ...data, id: data._id } as Product, error: null };
  } catch (err: any) {
    return { error: err.message || "Server connection error", data: null };
  }
};

export const createProduct = async (payload: Partial<Product>) => {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to create product" };
    return { error: null, data };
  } catch (err: any) {
    return { error: err.message || "Server connection error" };
  }
};

export const updateProduct = async (id: string, payload: Partial<Product>) => {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to update product" };
    return { error: null, data };
  } catch (err: any) {
    return { error: err.message || "Server connection error" };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to delete product" };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || "Server connection error" };
  }
};
