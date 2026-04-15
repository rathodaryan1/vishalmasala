import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useShop } from "@/context/ShopContext";
import { calculateCartTotals } from "@/lib/cart";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateCartQuantity, removeFromCart } = useShop();
  const { resolved, subtotal, discount, total } = calculateCartTotals(cartItems);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold mb-6">Your Cart</h1>

        {resolved.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-10 text-center">
            <h2 className="font-display text-2xl font-bold">Cart is empty</h2>
            <p className="text-muted-foreground mt-2">Add products to continue checkout.</p>
            <Link to="/products" className="inline-block mt-5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground">Browse Products</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-4">
              {resolved.map(({ item, product, variant }) => (
                <div key={`${item.productId}-${item.variantWeight}`} className="border border-border rounded-xl p-4 flex gap-4">
                  <img src={product.image} alt={product.name} className="w-24 h-24 object-contain bg-muted/30 rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{item.variantWeight}</p>
                    <p className="text-primary font-semibold mt-1">₹ {variant.price.toFixed(2)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => updateCartQuantity(item.productId, item.variantWeight, item.quantity - 1)} className="w-8 h-8 border rounded">-</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.productId, item.variantWeight, item.quantity + 1)} className="w-8 h-8 border rounded">+</button>
                      <button onClick={() => removeFromCart(item.productId, item.variantWeight)} className="ml-3 text-sm text-red-600">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-border rounded-xl p-5 h-fit">
              <h3 className="font-display text-xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>₹ {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-green-700"><span>Discount</span><span>- ₹ {discount.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold text-base border-t pt-2"><span>Total</span><span>₹ {total.toFixed(2)}</span></div>
              </div>
              <button onClick={() => navigate("/checkout")} className="w-full mt-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
