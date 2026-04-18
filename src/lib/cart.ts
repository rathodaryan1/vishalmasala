import type { CartItem } from "@/context/ShopContext";
import type { Product } from "@/lib/products";

export const resolveCartItems = (items: CartItem[], products: Product[]) => {
  return items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.weight === item.variantWeight);
      if (!product || !variant) return null;
      return { item, product, variant };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
};

export const calculateCartTotals = (items: CartItem[], products: Product[]) => {
  const resolved = resolveCartItems(items, products);
  const subtotal = resolved.reduce((acc, line) => acc + line.variant.originalPrice * line.item.quantity, 0);
  const total = resolved.reduce((acc, line) => acc + line.variant.price * line.item.quantity, 0);
  const discount = subtotal - total;
  return { subtotal, discount, total, resolved };
};
