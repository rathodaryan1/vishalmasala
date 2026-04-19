import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useShop } from "@/context/ShopContext";
import { getImageUrl } from "@/lib/utils";
import { Trash2, ShoppingCart, Heart } from "lucide-react";

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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => {
              if (!product) return null;
              const defaultVariant = product.variants[0];
              return (
                <div key={product.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
                  <div className="relative p-6 bg-muted/30 flex items-center justify-center">
                    <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-44 object-contain bg-muted/30 rounded-lg" />
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full text-primary shadow-sm hover:scale-110 transition-transform"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-6">
                    <p className="font-semibold text-lg">{product.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-primary font-bold text-xl">₹ {defaultVariant.price.toFixed(2)}</p>
                      <button
                        onClick={() => addToCart(product.id, defaultVariant.weight, 1)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:gap-3 transition-all"
                      >
                        <ShoppingCart className="w-4 h-4" /> Add
                      </button>
                    </div>
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
