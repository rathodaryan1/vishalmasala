import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products } from "@/data/products";

export interface CartItem {
  productId: string;
  variantWeight: string;
  quantity: number;
}

interface ShopContextValue {
  cartItems: CartItem[];
  wishlist: string[];
  addToCart: (productId: string, variantWeight: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, variantWeight: string, quantity: number) => void;
  removeFromCart: (productId: string, variantWeight: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cartCount: number;
}

const CART_KEY = "spiceking_cart";
const WISHLIST_KEY = "spiceking_wishlist";

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "null") as T | null;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => readStorage(CART_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readStorage(WISHLIST_KEY, []));

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (productId: string, variantWeight: string, quantity = 1) => {
    if (!products.some((p) => p.id === productId)) return;
    setCartItems((prev) => {
      const index = prev.findIndex(
        (item) => item.productId === productId && item.variantWeight === variantWeight
      );
      if (index === -1) {
        return [...prev, { productId, variantWeight, quantity }];
      }
      const next = [...prev];
      next[index] = { ...next[index], quantity: next[index].quantity + quantity };
      return next;
    });
  };

  const updateCartQuantity = (productId: string, variantWeight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantWeight);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantWeight === variantWeight
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, variantWeight: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantWeight === variantWeight))
    );
  };

  const clearCart = () => setCartItems([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const value = {
    cartItems,
    wishlist,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted,
    cartCount,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used inside ShopProvider");
  }
  return context;
};
