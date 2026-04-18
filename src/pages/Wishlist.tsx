import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useShop } from "@/context/ShopContext";

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart, products, loadingProducts } = useShop();
  const wishlistProducts = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold mb-6">Wishlist</h1>
        {loadingProducts ? (
          <div className="text-center py-20 font-display text-2xl text-muted-foreground">
            Loading wishlist...
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-10 text-center">
            <h2 className="font-display text-2xl font-bold">No wishlist items yet</h2>
            <Link to="/products" className="inline-block mt-5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground">Explore Products</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistProducts.map((product) => {
              if (!product) return null;
              const defaultVariant = product.variants[0];
              return (
                <div key={product.id} className="border border-border rounded-xl p-4">
                  <img src={product.image} alt={product.name} className="w-full h-44 object-contain bg-muted/30 rounded-lg" />
                  <p className="font-semibold mt-3">{product.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                  <p className="text-primary font-semibold mt-2">₹ {defaultVariant.price.toFixed(2)}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToCart(product.id, defaultVariant.weight, 1)}
                      className="py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
                    >
                      Add to cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="py-2 border border-primary text-primary rounded-lg text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
